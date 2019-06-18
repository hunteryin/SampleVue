<template>
  <div>
    <div v-if="userid != null">
    <div class="div-header" >       
        <div class="item-content open-panel" v-on:click="usersetting()">
            <img style="width:40px;height:40px;border-radius:50%;" :src="headimgurl" />  
        </div>       
        <div  style="width:60%;float:right;margin-left:30%" v-on:click="search()"> 
          <div class="mint-searchbar-inner">         
            <div class="mintui mintui-search" style="width:400px">川菜 | 油条 | 保险 ...</div>
            <input class="mint-searchbar-core" />
          </div>
        </div>  
    </div>
    </div>

    <div v-else>
    <div class="div-header" > 
         <div class="item-content open-panel" v-on:click="login()">
             <img style="width:40px;height:30px;border-radius:50%;" src="../assets/logon.png" /> 
         </div>          
         <div  style="width:60%;float:right;margin-left:30%" v-on:click="search()"> 
          <div class="mint-searchbar-inner">          
            <div class="mintui mintui-search" style="width:400px">川菜 | 油条 | 保险 ...</div>
            <input class="mint-searchbar-core" />
          </div>
        </div>  
     </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import VueRouter from 'vue-router';
  import config from '../Config.js'
  import { Toast } from 'mint-ui'

 export default {
    data() {
      return {
        headimgurl:'',
        userid: '',
        filehost:''
      }
    },
    methods: {
     login()
      {
        this.$router.push({ path: 'login' }); 
      },
      search()
      {
         this.$router.push({ path: 'Search' }); 
      },
      usersetting()
      {  
        this.$router.push({ path: 'myinfo' }); 
      },
      setHeader()
      {   
        this.host = config.apihost  
        this.filehost = config.filehost      
        var storage = window.localStorage;   
        this.userid =  storage.getItem("userid")   
      
        if (this.userid != null)
        {    
            var path = storage.getItem("imagepath")               
            if (path.startsWith("http://wx"))
            {
              this.headimgurl = path 
            }else
            {
              this.headimgurl = this.filehost + path   
            }          
        }
      }
    },
    activated:function () {
        this.setHeader()
    },
    created() {       
        this.setHeader()       
    }            
 }
 </script>
