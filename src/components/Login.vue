<template>
  <div>    
    <mt-header  title="" > 
        <mt-button slot="left" v-on:click="GoBack">
          <img style="width:40px;height:40px;margin-bottom:200px" src="../assets/goback.png" />
        </mt-button>    
    </mt-header>
    
    <div class="Login_Home">UTAH 家园</div>
    <div class="Login_Detail">
      <div class="Login_UserName">
        <img class="Login_Img" src="../assets/Mobile.png" />
        <input class="Login_Input" v-model="inputname"  type="text" placeholder="手机号,用户名或者邮箱" />
      </div>
      <div class="Login_BR"></div>
      <div  class="Login_Password"> 
        <img class="Login_Img_Mobile" src="../assets/password.png" />
        <input class="Login_Input" type="password" placeholder="密码" v-model="inputpassword" maxlength="10"/>
      </div>    
    </div>
    <div class="Login_Submit">
      <mt-button size="large" type="primary" v-on:click="login()">登录</mt-button></div>
    <div class="Login_Register" >
      <span  v-on:click="ToRegister">新用户注册</span> &nbsp; &nbsp;&nbsp;  <span v-on:click="ToFindpwd">找回密码</span>
    </div>

    <div v-if="haswechat" class="Login_OtherLogin">----社交帐号直接登陆----</div>
    <div v-if="haswechat" class="Login_WeChat">
      <button style="border:0" v-on:click="wechatlogin()">
        <img class="Login_WeChat_Img" src="../assets/weChat.png" />
      </button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import VueRouter from 'vue-router';
  import config from '../Config.js';
  import { Toast } from 'mint-ui';
  import { Indicator } from 'mint-ui';
  

  export default {
    data() {
      return {
        haswechat: '',
        inputname: '',
        inputpassword: '',
        userinfo: {
          UserName: '',
          UserID: '',
          RoleID: '',
          Password: '',
          ImagePath: '',
          Phonenumber: '',
          ThirdPartyType: '',
          ThirdPartyId: '',
          sex: '',
          city: '',
          province: '',
          country: ''
        },              
        isLogin: 0,
        host: '',
        selected: '1'
      }
    },
    methods: {
      login()
      {    
        if(!this.inputname)
        {
          Toast('登录名不能为空') 
          return 
        }
        if (this.inputpassword)
        {
          var re = /^[_!@#()0-9a-zA-Z]*$/;            
          if (!re.test(this.inputpassword) || !this.inputpassword.length >= 5)
          {
            Toast('密码格式不对') 
            return 
          }
        }else{
          Toast('密码不能为空') 
          return 
        }  
        
        var encryptedpwd = config.encode(this.inputpassword)
        axios.put(this.host + 'api/Users/login',
           {
            inputname: this.inputname,
            password: encryptedpwd
          })
          .then(response => {            
            this.userinfo = response.data     
            if (!this.userinfo)
            {
              Toast('账户不存在或者密码错误') 
              return
            }
            var storage = window.localStorage;   
            storage.setItem("userid", this.userinfo.UserID)      
            storage.setItem("username", this.userinfo.UserName)    
            storage.setItem("imagepath", this.userinfo.ImagePath)                       
            Toast(this.userinfo.UserName + '欢迎回来'); 
            this.$router.go(-1) 
          })
          .catch(e => {          
            config.logerror(e)    
            Toast('登录失败，请稍后重试一次'); 
          }); 
      },
      ToFindpwd()
      {
        this.$router.push({ name: 'Findpwd' })                
      },
      ToRegister()
      {
        this.$router.push({ path: 'Register' }); 
      },
      GoBack: function (event) {         
        if (this.$route.query.tabname)
        {         
          this.$router.push({path: this.$route.query.tabname})
        }else{
          this.$router.go(-1) 
        }
      },       
      wechatlogin()
      {        
        var scope = "snsapi_userinfo"
        var state = "_" + (+new Date())
        var self = this      
        Wechat.auth(scope, state, function (response) {            
            // you may use response.code to get the access token.            
            //alert(JSON.stringify(response));  
           Indicator.open({
              text:'微信登陆中，请稍候',
              spinnerType: 'fading-circle'
           })               
            axios.get(config.wechathost + 'sns/oauth2/access_token?appid=' + config.appid + '&secret=' + config.app_secret + '&code=' + response.code + '&grant_type=authorization_code')
            .then(response => {                                    
                //alert(JSON.stringify(response));               
                axios.get(config.wechathost + 'sns/userinfo?access_token=' + response.data.access_token + '&openid=' + response.data.openid)
                .then(response => {   
                  //alert(JSON.stringify(response));                                                              
                  self.userinfo.ImagePath = response.data.headimgurl 
                  self.userinfo.UserName = response.data.nickname
                  self.userinfo.ThirdPartyId = response.data.unionid
                  self.userinfo.sex = response.data.sex
                  self.userinfo.city = response.data.city
                  self.userinfo.province = response.data.province
                  self.userinfo.country = response.data.country                
                  
                  axios.post(self.host + 'api/Users/tpLogin', {
                    user: 
                    {
                      UserName: self.userinfo.UserName,
                      ImagePath: self.userinfo.ImagePath,
                      ThirdPartyId: self.userinfo.ThirdPartyId,
                      Sex: self.userinfo.sex,
                      City: self.userinfo.city,
                      Province: self.userinfo.province,
                      Country: self.userinfo.country
                    }
                  })
                  .then(response => {   
                    self.userinfo = response.data  
                    if (!self.userinfo)                   
                    { 
                      Indicator.close()                     
                      Toast('登录失败，请稍后重试一次'); 
                      return
                    }
                    var storage = window.localStorage;   
                    storage.setItem("username", self.userinfo.UserName)     
                    storage.setItem("userid", self.userinfo.UserID)     
                    storage.setItem("imagepath", self.userinfo.ImagePath)                   
                      
                    Indicator.close()
                    Toast('登录成功');   
                    self.$router.go(-1)           
                  })
                  .catch(e => {                    
                    Indicator.close()                 
                    config.logerror(e)    
                    Toast('登录失败，请稍后重试一次'); 
                  });
                })
                .catch(e => {    
                  Indicator.close()            
                  config.logerror(e)    
                  Toast('登录失败，请稍后重试一次'); 
                });
            })
            .catch(e => {
              Indicator.close()  
              config.logerror(e)    
              Toast('登录失败，请稍后重试一次'); 
            }); 
        }, function (reason) {
            Indicator.close()
            config.logerror(e)    
            Toast('登录失败，请稍后重试一次'); 
        });      
      }  
    },
    created() {        
       this.host = config.apihost 
       var self = this 
       Wechat.isInstalled(function (installed) {
        //alert("Wechat installed: " + (installed ? "Yes" : "No"));        
        self.haswechat = installed        
        }, function (reason) {
           config.logerror(e)  
        }); 
    },
  }
</Script>
