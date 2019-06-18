<template>
  <div>
    <headerhome></headerhome>  
    <br/>
    <div v-if="userinfo.UserID == null">
      <router-link :to="{ path: '/Login'}">
        <div class="MyInfo_Info_Box">
          <img class="MyInfo_Img" src="../assets/Not_login.png" /><div class="MyInfo_Info">未登录</div>
        </div>
      </router-link>
    </div>
      <div v-else>
        <div class="MyInfo_Info_Box">
          <img class="MyInfo_Img" :src="userinfo.ImagePath" /><div class="MyInfo_Info">{{userinfo.UserName}}</div>
        </div>
    </div>
     <br />
  
      <div class="MyInfo_Post_Box" v-on:click="goMycircle()" >
        <img class="MyInfo_Post_Img" src="../assets/circle.png" /> <div class="MyInfo_Post" >我的帖子</div>
      </div>   
     
      <div class="MyInfo_Setting_Box" v-on:click="goSetting()">
        <img class="MyInfo_Setting_Img" src="../assets/settings.png" /><div class="MyInfo_Setting" >设置</div>
      </div>
      <div style="text-align:center;font-size:15px;color:blue;margin-top:10px;margin-left:10px;margin-right:10px" v-on:click="goTerms()">
         犹他家园用户协议
      </div>
      
      <div style="text-align:center;font-size:15px;margin-top:10px;margin-left:10px;margin-right:10px">
         关于我们
      </div>
      <div style="margin-top:10px;margin-left:10px;margin-right:10px;height:400px">
        <p>我们是一群生活在犹他的游子，深知生在异乡为异客的孤独.谨以自己微薄之力搭建一个简陋的小屋，</p>
        <p>希望无论是新来乍到的新生还是枝繁叶茂的老犹他都能在这里找到心中的家园.</p>
        <p>目前实现的功能：</p>
        <p>1. 提供本地餐馆信息和各种打折特色菜的发布</p>
        <p>2. 提供本地各种生活类服务信息的发布</p>
        <p>3. 提供本地二手，分类广告的发布和交流</p><p>更多更新的功能还在开发中......</p><br>
        <p>我们的联系方式:</p><p><h2>微信:hunter_yin2015</h2></p><p>邮箱:utahhome2000@gmail.com</p>
      </div>
     
</div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
  import config from '../Config.js';
  import axios from 'axios';
  import { Toast } from 'mint-ui'
  import headerhome from './HeaderHome'

  export default {
   data() {
      return {   
          host:'',    
          frompath: 'Myinfo', 
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
          Email: '',
        }
    }
    },   
   components: {
     headerhome
   },
    methods: {
      goSetting()
      {         
        if (!this.userinfo.UserID)
        {
            Toast('请先登录');   
            this.$router.push({ path: "/Login", query: {tabname: this.frompath}})
        }else{
            this.$router.push({ path: "/Settings"})
        }
      },
      goTerms()
      {
         this.$router.push({ path: "/Userterm"})
      },
      goMycircle()
      {       
        if (!this.userinfo.UserID)
        {        
            Toast('请先登录');    
            this.$router.push({ path: '/Login', query: {tabname: this.frompath}});             
        }else{
            this.$router.push({ path: "/MyCircle"})
        }
      },
      GoBack: function (event) {
        window.history.back();
      },
      setHeader()
      {   
        this.host = config.apihost   
        this.filehost = config.filehost     
        var storage = window.localStorage;            
        this.userinfo.UserName = storage.getItem("username")     
        this.userinfo.UserID = storage.getItem("userid")     
             
        if (this.userinfo.UserID != null)
        {    
            var path = storage.getItem("imagepath")               
            if (path.startsWith("http://wx"))
            {
              this.userinfo.ImagePath = path 
            }else
            {
              this.userinfo.ImagePath = this.filehost + path   
            }          
        }
      }
    },
    created() {        
       this.$emit('update-tab', "settab");    
       this.setHeader()
    }   
  }

</script>