<template>
  <div>
    <mt-header title="设置">
      <mt-button slot="left" v-on:click="GoBack">
        <img style="width:40px;height:40px;margin-bottom:200px" src="../assets/goback.png" />
      </mt-button>
      <mt-button slot="right" v-on:click="Logout">
      登出
      </mt-button>      
    </mt-header>      

    <div class="page-cell">    
        <div v-if="isreadonly">
          <mt-field label="用户名" :placeholder="用户名"  :state="accountstate" v-model="userinfo.Account" :attr="{ maxlength: 20 }" readonly></mt-field> 
        </div>
        <div v-else>
          <mt-field label="用户名" :placeholder="用户名"  :state="accountstate" v-model="userinfo.Account" :attr="{ maxlength: 20 }" ></mt-field>
        </div>
        <mt-field label="昵称" :placeholder="昵称" :state="usernamestate" v-model="userinfo.UserName" :attr="{ maxlength: 20 }"></mt-field>
        <mt-field label="手机号" :placeholder="手机号" :state="phonenumberstate" v-model="userinfo.Phonenumber" type="tel" :attr="{ maxlength: 10 }"></mt-field>
      <!--注意用户名没有的，不能修改手机-->
        <mt-field label="邮箱" :placeholder="邮箱" :state="emailstate" v-model="userinfo.Email" type="email"></mt-field>
        <mt-field label="新密码" placeholder="请输入新密码" type="password" :state="passwordstate" v-model="newpassword"  :attr="{ maxlength: 10 }"></mt-field> 
        <mt-field label="新密码" placeholder="请再输入一边新密码" type="password" :state="retypepasswordstate" v-model="retypepassword" :attr="{ maxlength: 10 }"></mt-field>    
        {{validation}}
      <!--不输入密码不用修改-->
      <br />
      <mt-button size="large" type="primary" v-on:click="Save">保存</mt-button>
    </div>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
  import config from '../Config.js';
  import axios from 'axios';
  import { Toast } from 'mint-ui'
  import CryptoJS from 'crypto-js'
  

  export default {
    data: function () {
      return {   
          accountstate: '',
          usernamestate: '',
          phonenumberstate: '',
          emailstate: '',
          newpassword: '',        
          retypepassword: '',
          passwordstate: '',
          retypepasswordstate: '',
          host:'',   
          isreadonly: '',
          passphase:'',  
          userinfo: {
            UserID: '',
            UserName: '',        
            RoleID: '',
            Password: '',
            ImagePath: '',
            Phonenumber: '',
            ThirdPartyType: '',
            ThirdPartyId: '',
            Account: '',
            Email: ''
        }
    }
   },  
   computed: {
    // a computed getter
    validation: function () {  

      if (this.userinfo.Email)
      {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(this.userinfo.Email) )
          this.emailstate =  "success"
        else 
          this.emailstate = "error"             
      }else
      {
        this.emailstate = ""     
      }

      if (this.userinfo.Account)
      {
        var re = /^[_@0-9a-zA-Z]*$/;
        if (re.test(this.userinfo.Account))
          this.accountstate =  "success"
        else 
          this.accountstate = "error"   
      }else{
        this.accountstate = ""  
      }

      if (this.newpassword)
      {
        var re = /^[_!@#()0-9a-zA-Z]*$/;           
        if (re.test(this.newpassword) && this.newpassword.length >= 5)
          this.passwordstate =  "success"
        else 
          this.passwordstate = "error"   
      }else{
        this.passwordstate = ""  
      }  

      if (this.userinfo.Phonenumber)
      {
        var re = /^\d{10}$/;
        if (re.test(this.userinfo.Phonenumber))
            this.phonenumberstate =  "success"
          else 
            this.phonenumberstate = "error"       
      }else
      {
        this.phonenumberstate = ""  
      }

      //username no limitation for now
      this.usernamestate = "success"        
    } 
  },    
    methods: {
      Save: function () {      
        if (this.phonenumberstate == "error"
            || this.accountstate == "error"
            || this.emailstate == "error"
            || this.passwordstate == "error")
            {
              Toast('请修改错误信息后再保存');
              return    
            }        

        if (!this.userinfo.Account && !this.userinfo.Phonenumber && !this.userinfo.Email)  
        {
           Toast('为安全考虑，用户名，手机号和邮箱不能同时都设置为空');    
           return       
        }

        if (this.retypepassword || this.newpassword)
        {
            if (this.retypepassword != this.newpassword)
            {              
                Toast('两次密码输入不一致');    
                return  
            }
        }      
        axios.get(this.host + 'api/GetTokens/' +  this.userinfo.UserID)
        .then(response => {
          var result = "2507" + response.data.token
          var token =  result.substring(0,16)
            
          var key = CryptoJS.enc.Utf8.parse(token);
          var iv = CryptoJS.enc.Utf8.parse(token);
          var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(response.data.token), key,
          {
              keySize: 128 / 8,
              iv: iv,
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7
          });
         this.passphase = encrypted.toString(); 
         this.putuser()
        })
         .catch(e => {           
            Toast('网络连接有问题，，请稍后重试一次'); 
            config.logerror(e)             
        }) 
      },
      putuser()
      {        
         axios.put(this.host + 'api/Users/', {            
            token:  this.passphase,
              user: 
              {
                UserID:this.userinfo.UserID,
                UserName: this.userinfo.UserName,
                Account: this.userinfo.Account,         
                Email: this.userinfo.Email,
                Password: this.newpassword,
                Phonenumber: this.userinfo.Phonenumber   
              }           
            }).then(response => {  
            this.userinfo = response.data 
            if (this.userinfo.Account)
            {
              this.isreadonly = true
            }
            if (!this.userinfo.UserID)
            {
              Toast('网络连接有问题，，请稍后重试一次'); 
            }
            var storage = window.localStorage;   
            storage.setItem("username", this.userinfo.UserName)   
            storage.setItem("userid", this.userinfo.UserID)     
            storage.setItem("imagepath", this.userinfo.ImagePath) 
            Toast('保存成功');
            window.history.back();
          })
          .catch(e => {            
            if (e.response.data == '01')
            {
                Toast('昵称已经被使用');
            }
            else if (e.response.data == '02')
            {
              Toast('电话号码已经被使用');
            }  
            else if (e.response.data == '03')
            {
              Toast('用户名已经被使用');
            }  
            else if (e.response.data == '04')
            {
              Toast('邮箱地址已经被使用');
            }else{
                Toast('网络连接有问题，，请稍后重试一次'); 
                config.logerror(e) 
            }  
                      
            });

      },
      Logout: function (event) {  
          var storage = window.localStorage;       
          storage.removeItem("userid")      
          storage.removeItem("username")    
          storage.removeItem("ImagePath")           
          Toast('登出成功'); 
          window.history.back();
      },
      GoBack: function (event) {
        window.history.back();
      }
    },
    created() {     
 
        this.host = config.apihost     
        var storage = window.localStorage;   
        this.userinfo.username = storage.getItem("username")     
        this.userinfo.UserID = storage.getItem("userid")     
        this.userinfo.ImagePath = storage.getItem("imagepath")   
        if (this.userinfo.Account)
        {
          this.isreadonly = true
        }
        axios.get(this.host + 'api/Users/' +  this.userinfo.UserID)
          .then(response => {
             this.userinfo = response.data
             if (!this.userinfo)
             {
                Toast('获取用户信息异常,请登出后再重新登陆');   
             }
          })
        .catch(e => {            
            Toast('获取用户信息异常,请登出后再重新登陆');   
            config.logerror(e)    
        }); 
    }   
  }

</script>