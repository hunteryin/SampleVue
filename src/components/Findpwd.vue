<template>
  <div>    
    <mt-header  title="" > 
      <mt-button slot="left" v-on:click="GoBack">
        <img style="width:40px;height:40px;margin-bottom:200px" src="../assets/goback.png" />
      </mt-button>  
    </mt-header>
    
    <div class="Register_Home">找回密码</div>
    <div class="Register_Detail">          
      <div class="Register_UserName">
        <img class="Register_Img_Mobile" src="../assets/Mobile.png" />
        <input class="Register_Input" type="text" placeholder="手机号" v-model="inputphone" maxlength="10"/>      
      </div>      
      <div class="Register_BR"></div>
      <img class="Register_Img_Mobile" src="../assets/Code.png" />
      <input class="Register_Code" type="text" placeholder="验证码" v-model="inputcode" maxlength="4"/>  
      <span style="font-size:22px;color:#c1c0c0">| &nbsp;</span>
      <span v-if="date == ''">
        <span v-on:click="sendcode">发送验证码</span>
      </span>
      <span v-if="date != ''">
        重新发送({{59 - seconds}})
      </span>
      <div class="Register_BR"></div>
      <div class="Register_Password"> <img class="Register_Img" src="../assets/password.png" /><input class="Register_Input" type="password" placeholder="请输入新密码" v-model="inputpassword" maxlength="10"/></div>     
      <div class="Register_BR"></div>
      <div class="Register_Password"> <img class="Register_Img" src="../assets/password.png" /><input class="Register_Input" type="password" placeholder="请再输入一遍新密码" v-model="reinputpassword" maxlength="10"/></div>     
    </div>
    <div class="Register_Submit"><mt-button size="large" class="Register_Submit_Button" v-on:click="submit">提交</mt-button></div>
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
        inputpassword: '',
        reinputpassword:'',
        inputcode: '',
        error: '',        
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
            type: "02"
          }) //01 register new phone number      
          .then(response => {            
            if (response.data == "01")
            {
              Toast("注册码已发送")
            }             
             this.date = Math.trunc(Date.parse(new Date()) / 1000)
          })
          .catch(e => {           
            if (e.response.data == "02")
            {
               MessageBox('警告', '电话号码没有注册过')
            }else if (e.response.data == "05")
            {
               MessageBox('警告', '尝试次数过多，请稍后再试')
            }else{
               Toast('网络连接有问题，，请稍后重试一次'); 
               config.logerror(e) 
            }           
          }); 
      },
      GoBack: function (event) {
        this.$router.go(-1)
      },
      submit()
      {
         if (this.inputpassword)
          {
            if (this.inputpassword.length < 5)
            {
              Toast('密码长度不能小于5位')
              return       
            }
           
            var re = /^[_!@#()0-9a-zA-Z]*$/;       
            if (!re.test(this.inputpassword))
             {
               Toast('密码格式不对')
               return
             }
          }

          if (!this.inputcode)
          {
             Toast('验证码不能为空') 
            return
          }

          if (this.inputphone)
          {
            var re = /^\d{4}$/;
            if (!re.test(this.inputcode))
            { Toast('验证码格式不对')
              return       
            }
          } 

          if (this.reinputpassword != this.inputpassword)
          {
            Toast('两次密码输入不一致')
              return 
          }

          axios.get(this.host + 'api/Changepd/' + this.inputphone + "/" + this.inputcode + '/' + this.inputpassword)
          .then(response => {           
           if (response.data  == "01")
           { 
             Toast('密码修改成功')
             this.$router.go(-1)
           }
          })
          .catch(e => {
            if (e.response.data == '02')
              {
                Toast('电话号码不存在');
              }
            else if (e.response.data == '03')
              {
                Toast('电话号码和验证码不匹配或已过期');
              }
            else if (e.response.data == '04')
             {
               Toast('出现错误，请再尝试一次');              
             }
             else{
               Toast('网络连接有问题，，请稍后重试一次'); 
               config.logerror(e)              
             }         
          });
        
      }     
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
