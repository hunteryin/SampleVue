<template>
  <div>
    <mt-header title="犹他家园" fixed>
      <mt-button slot="left" class="item-content open-panel" v-on:click="goback()">
        <img style= "width:40px;height:40px;margin-bottom:200px" src="../assets/goback.png" />
    </mt-button>  

    <mt-button v-if="haswechat" slot="right" class="item-content open-panel" v-on:click="shareWechat()">
        <h2>分享</h2>
    </mt-button>
    </mt-header>
  </div>
</template>

<script>
  import axios from 'axios';
  import VueRouter from 'vue-router';
  import config from '../Config.js'
  import Vue from 'vue'
  import { Toast } from 'mint-ui'

 export default {
    data() {
      return {
        headimgurl:'',
        userid: '' ,
        filehost: '',
        haswechat:''     
      }
    },
    props:['title', 'description', 'thumb', 'wechaturl', 'topath'],
    methods: {
    
    goback:function()
    { 
      if (this.topath)
      {
        this.$router.push({ path: this.topath, query: { scrollHeight: this.$route.query.scrollHeight } } )         
      }else{
       this.$router.go(-1)
      }
    },
    shareWechat()
    {    
     
      Vue.cordova.on('deviceready', () => {               
          Wechat.isInstalled(function (installed) {
              console.log("Wechat installed: " + (installed ? "Yes" : "No"));
          }, function (reason) {
              console.log("Failed: " + reason);
          }); 

            if (!this.thumb)  
            {              
              this.thumb = this.filehost + "/pictures/logo.png"
            }            
            Wechat.share({
                message: {  
                    title: this.title,  
                    description: this.description,
                    thumb: this.thumb,                 
                    media: {                         
                        type: Wechat.Type.WEBPAGE,
                        webpageUrl: this.wechaturl
                    }
                },
                scene: Wechat.Scene.SESSION   // share to Timeline
            }, function () {
                //alert("Success");
            }, function (reason) {    
                //hunter -- to add reason but skip user cancelled                
                //alert("Failed: " + reason);
            })
      })
    } 
    },  
    created() {   
      this.filehost = config.filehost   
       var self = this 
       Wechat.isInstalled(function (installed) {
        //alert("Wechat installed: " + (installed ? "Yes" : "No"));        
        self.haswechat = installed        
        }, function (reason) {
           config.logerror(e)  
        });    
    }            
 }
 </script>
