<template>
  <div>    
    <mt-header title="" > 
      <mt-button slot="left" v-on:click="GoBack">
        <img style="width:40px;height:40px;margin-bottom:200px" src="../assets/goback.png" />
      </mt-button>  
    </mt-header>
    
    <div class="Register_Home">UTAH 家园</div>
    <div class="Register_Detail">
      <div class="Register_UserName"><img class="Register_Img" src="../assets/username.png" /><input class="Register_Input" type="text" placeholder="你的昵称" v-model="inputname" maxlength="20"/></div>
      <div class="Register_BR"></div>
      <div class="Register_UserName">
        <img class="Register_Img_Mobile" src="../assets/Mobile.png" />
        <input class="Register_Input" type="text" placeholder="手机号" v-model="inputphone" maxlength="10"/>
       
      </div>      
      <div class="Register_BR"></div>
      <img class="Register_Img_Mobile" src="../assets/Code.png" />
      <input class="Register_Code" type="text" placeholder="验证码" v-model="inputcode" maxlength="10"/>     
      <span style="font-size:22px;color:#c1c0c0">| &nbsp;</span>
      <span v-if="date == ''">
        <span v-on:click="sendcode">发送验证码</span>
      </span>
      <span v-if="date != ''">
        重新发送({{59 - seconds}})
      </span>
   
    </div>
    <div class="Register_Submit"><mt-button size="large" class="Register_Submit_Button" v-on:click="register">注册</mt-button></div>
    <div style="color:grey;margin-top:20px;text-align:center">点击注册按钮，即代表你同意 - <span style="color:blue" v-on:click="gototerm()">犹他家园协议</span></div>
  </div>
</template>

<script>
  import axios from 'axios';
  import VueRouter from 'vue-router';
  import config from '../Config.js'
  import { Toast } from 'mint-ui'
  import { MessageBox } from 'mint-ui';
  import CryptoJS from 'crypto-js'

  export default {
    data() {
      return {
        host: '',
        inputname: '',
        inputphone: '',
        inputcode: '',
        error: '',
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
        }, 
        host: '',
        date: '',      
        now: Math.trunc((new Date()).getTime() / 1000)
      }
    },       
    computed: {
      seconds() {  
          if (this.date != '') 
          {
            if ((this.now - this.date) % 60 == 59)
            {
              this.date = ''
            }    
            return (this.now - this.date) % 60;
          }
      },
    },
    methods: {
      gototerm()
      {
          this.$router.push({ path: 'Userterm' }); 
      },
      register()
      {  
          if (!this.inputname || !this.inputname.trim())
          {
             Toast('昵称不能为空')
             return
          }
          if (!this.inputname.length > 20)
          {
             Toast('昵称不能超过20位')
             return
          }
          if (!this.inputphone)
          {
             Toast('电话号码不能为空') 
            return
          }
          if (!this.inputcode)
          {
             Toast('验证码不能为空') 
            return
          }

          if (this.inputphone)
          {
            var re = /^\d{10}$/;
            if (!re.test(this.inputphone))
            { Toast('电话号码格式不对')
              return       
            }
          }
          if (this.inputphone)
          {
            var re = /^\d{4}$/;
            if (!re.test(this.inputcode))
            { Toast('验证码格式不对')
              return       
            }
          }         
          axios.post(this.host + 'api/Users/Register', {
            code: this.inputcode,
            user: 
            { 
              UserName:this.inputname,
              Phonenumber: this.inputphone           
            }
          })
          .then(response => {             
            this.userinfo = response.data   
            if (!this.userinfo)
            {
               Toast('注册失败，请稍后重试一次' );   
               return
            }          
            var storage = window.localStorage;   
          
            storage.setItem("username", this.userinfo.UserName)     
            storage.setItem("userid", this.userinfo.UserID)     
            storage.setItem("imagepath", this.userinfo.ImagePath)  
          
            var value = storage.getItem("username"); // Pass a key name to get its value.  
            Toast('登录成功'); 
            this.$router.go(-2) 
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
                Toast('电话号码和验证码不匹配或已过期');
              }
            else{
              Toast('注册失败，请稍后重试一次');   
              config.logerror(e)    
            
            }
          });
      },
      GoBack: function (event) {
        window.history.back();
      },
      //01 -- success
      //02 -- phone number doesn't exists
      sendcode()
      {  
          if (!this.inputphone)
          {
             Toast('电话号码不能为空') 
            return
          }

          if (this.inputphone)
          {
            var re = /^\d{10}$/;
            if (!re.test(this.inputphone))
            { Toast('电话号码格式不对')
              return       
            }
          }  

        var passphase = config.encode(this.inputphone)
      
        axios.put(this.host + 'api/sendAccessCode/',
          {  
            phone: passphase,
            type: "01"
          }) //01 register new phone number
          .then(response => {            
            if (response.data == "01")
            {
              Toast("注册码已发送")
            }             
            this.date = Math.trunc(Date.parse(new Date()) / 1000)          
          })
          .catch(e => {
            if (e.response.data == "04")
            {
               MessageBox('警告', '电话号码已经被注册过')
            }else if (e.response.data == "05")
            {
               MessageBox('警告', '尝试次数过多，请稍后再试')
            }
            else{
              config.logerror(e)    
              Toast('网络连接有问题，请稍后重试一次');   
            }          
          }); 
      },     
    },    
    created() {  
       this.host = config.apihost      
    },
    mounted () {
      window.setInterval(() => {
          this.now = Math.trunc((new Date()).getTime() / 1000);
      },1000);
    }
  }
</Script>
