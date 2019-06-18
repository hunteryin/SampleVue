<template>	
<div>	
    <mt-header  title="我的帖子" fixed>    
    <mt-button slot="left" v-on:click="GoBack">
        <img style="width:40px;height:40px;margin-bottom:200px" src="../assets/goback.png" />
    </mt-button>
    </mt-header>
   <div class="Box-Below-Header-Withspace">
    <mt-loadmore  :bottom-method="circleLoadBottom" :topDistnace="0.5" :distanceIndex="1" :top-method="circleLoadTop" @top-status-change="circleHandleTopChange" @bottom-status-change="circleHandleBottomChange" :bottom-all-loaded="circleAllLoaded" :auto-fill="autoFill" ref="loadmore">        		
       <div  v-for="item in circleMore">
         <router-link :to="{ path: '/MyCircleEdit', query: { circleItem: item}}">
            <div class="CircleTemplate-Box">
              <div class="CircleTemplate-Box-Left">
              <div v-if="item.UserImagePath.startsWith('http://wx')"> 
                <img class="CircleTemplate-header-pic" v-if="item.UserImagePath !== null"  v-lazy="item.UserImagePath">
              </div>
              <div v-else>
                <img class="CircleTemplate-header-pic" v-if="item.UserImagePath !== null"  v-lazy="filehost + item.UserImagePath">
              </div>
              <div class="CircleTemplate-name">
                {{item.UserName.substring(0,10)}}   
              </div>
              <div>
                <div class="CircleTemplate-Box-Text" >
                {{item.Title}} 
                </div> 
                <div class="CircleTemplate-Box-Date">{{item.CreatedDate}}</div>
                </div>  
            </div>
            <div class="CircleTemplate-Box-Right">
              <img class="CircleTemplate-Pic" v-if="item.CircleImagePath1 !== null" v-lazy="filehost + item.CircleImagePath1">
              <!--<img class="CircleTemplate-Pic" v-if="item.CircleImagePath2 !== null" v-lazy="host + item.CircleImagePath2">
              <img class="CircleTemplate-Pic" v-if="item.CircleImagePath3 !== null" v-lazy="host + item.CircleImagePath3">--> 
            </div>
            </div>
           </router-link>
            <div class="CircleTemplate-Box-Space"></div>
        </div>       

        <div v-if="circleAllLoaded === true"><center>(*￣ω￣)没有更多了</center></div>
    </mt-loadmore>
   </div>
</div>  	
</template>

<script>
  import axios from 'axios';
  import { Toast } from 'mint-ui'
  import VueRouter from 'vue-router';
  import config from '../Config.js';



  export default {
    data() {
      return {
        host: '',  
        userid: '',
        filehost: '', 
        errors: [],
        autoFill: false,// do not use auto fill
        isFirstLoad: true,
       
        //川菜
        circleMore: [],
        circlePageNo: 0,
        circleAllLoaded: false,
        circlePageSize: 5,
        circleBottomStatus: '',
        circleWrapperHeight: ''       
      }
    },
	props:['type'],
    methods: {  
      GoBack: function (event) {
        window.history.back();
      },    
      circleHandleBottomChange(status) {
        this.circleTopStatus = status;
      },
      circleHandleTopChange(status) {
        this.circlebottomStatus = status;
      },
      circleLoadTop() {     
        this.circleAllLoaded = false;
        setTimeout(() => {        
        axios.get(this.host + 'api/RefreshCircleCommentsByUserID/' + this.userid + '/0/'  + this.circlePageSize)
        .then(response => {
        this.circleMore = response.data	
        if (response.data.length > 0) {  
          if (response.data.length < this.shopPageSize) {
            this.circleAllLoaded = true;
          }
        }
        else {
          this.circleAllLoaded = true;
        } 	
        })
        .catch(e => {
          config.logerror(e)    
          Toast('网络连接有问题，请稍后重试一次');  
        });
          this.$refs.loadmore.onTopLoaded();
        }, 1000);		
      },
      circleLoadBottom() {  
          setTimeout(() => {            
            axios.get(this.host + 'api/MoreCircleCommentsByUserID/' + this.userid + '/' + this.circleMore[this.circleMore.length - 1].UserCircleCommentID  + '/' + this.circlePageSize)
              .then(response => {    
                if (response.data.length > 0) {                                  
                  this.circleMore = this.circleMore.concat(response.data);
                  this.circlePageNo++;
                  if (response.data.length < this.circlePageSize) {
                    this.circleAllLoaded = true;
                  }
                }
                else {
                  this.circleAllLoaded = true;
                }
              })
              .catch(e => {
                this.errors.push(e)
              })
            this.$refs.loadmore.onBottomLoaded();
          }, 1500);
        }
    },
    circleHandleBottomChange(status) {
      this.circleBottomStatus = status;
    },
    created() {           
        this.host = config.apihost 
        this.filehost = config.filehost      

        var storage = window.localStorage; 
        this.userid = storage.getItem("userid") 

        if (!this.userid)
        {
            Toast('请先登录');    
            this.$router.push({ path: 'login' }); 
        } 

        axios.get(this.host + 'api/RefreshCircleCommentsByUserID/' + this.userid + '/0/'  + this.circlePageSize)
        .then(response => {
        this.circleMore = response.data	
        if (response.data.length > 0) {  
          if (response.data.length < this.shopPageSize) {
            this.circleAllLoaded = true;
          }
        }
        else {
          this.circleAllLoaded = true;
        } 	
        })
        .catch(e => {
          config.logerror(e)    
          Toast('网络连接有问题，请稍后重试一次');  
        });

      },
      mounted() {             
      }
  }
</script>
