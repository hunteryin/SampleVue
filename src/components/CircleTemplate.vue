<template>		
  <mt-loadmore class="loadmore" :bottom-method="circleLoadBottom" :topDistnace="0.5" :distanceIndex="1" :top-method="circleLoadTop" @top-status-change="circleHandleTopChange" @bottom-status-change="circleHandleBottomChange" :bottom-all-loaded="circleAllLoaded" :auto-fill="autoFill" ref="loadmore">        		
      <div  v-for="item in circleMore">
        <!--<router-link :to="{ path: '/CircleDetail', query: {id:item.UserCircleCommentID, scrollHeight:2 }}">-->
          <div class="CircleTemplate-Box" v-on:click="showCircleDetail(item.UserCircleCommentID)">
              <div class="CircleTemplate-Box-Left">               
              <div v-if="item.UserImagePath.startsWith('http://wx')"> 
                <img class="CircleTemplate-header-pic" v-if="item.UserImagePath !== null"  v-lazy="item.UserImagePath">
              </div>
              <div v-else>
                <img class="CircleTemplate-header-pic" src="../assets/head.png">
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
            </div>
            </div>
          <!--</router-link>-->
          <div class="CircleTemplate-Box-Space"></div>
      </div>       
      <div v-if="circleAllLoaded === true"><center>(*￣ω￣)没有更多了</center></div>
  </mt-loadmore> 
</template>

<script>
  import axios from 'axios';
  import VueRouter from 'vue-router';
  import config from '../Config.js'
  import { Toast } from 'mint-ui'


  export default {
    data() {
      return {
        host: '',  
        filehost: '', 
        errors: [],
        getScoreLog: [],
        autoFill: false,// do not use auto fill
        isFirstLoad: true,     
        //川菜
        circleMore: [],
        circlePageNo: 0,
        circleAllLoaded: false,
        circlePageSize: 10,
        circleBottomStatus: '',
        circleWrapperHeight: ''
      }
    },
	props:['type'],
    methods: {   
      circleHandleBottomChange(status) {
        this.circleTopStatus = status;
      },
      circleHandleTopChange(status) {
        this.circlebottomStatus = status;
      },
      circleLoadTop() {          
        this.circleAllLoaded = false;      
        this.host = config.apihost    
         setTimeout(() => {         
          axios.get(this.host + 'api/RefreshCircleComments/' + this.type + '/0/'  + this.circlePageSize)
            .then(response => {
            this.circleMore = response.data	
            if (response.data.length > 0) {                                             
              if (response.data.length < this.circlePageSize) {
                this.circleAllLoaded = true;
              }
            }
            else {
              this.circleAllLoaded = true;
            }	
          })
          .catch(e => {
            Toast('网络连接有问题，请稍后重试一次');   
            config.logerror(e)
          });
          this.$refs.loadmore.onTopLoaded(); 
          },1500)        
      },
      circlefastLoadTop() {          
        this.circleAllLoaded = false;      
        this.host = config.apihost 
          axios.get(this.host + 'api/RefreshCircleComments/' + this.type + '/0/'  + this.circlePageSize)
            .then(response => {
            this.circleMore = response.data	
            if (response.data.length > 0) {                                             
              if (response.data.length < this.circlePageSize) {
                this.circleAllLoaded = true;
              }
            }
            else {
              this.circleAllLoaded = true;
            }	
          })
          .catch(e => {
            Toast('网络连接有问题，请稍后重试一次');   
            config.logerror(e)
          });
          this.$refs.loadmore.onTopLoaded();                 
      },

      circleLoadBottom() {                
            axios.get(this.host + 'api/MoreCircleComments/' + this.type + '/' + this.circleMore[this.circleMore.length - 1].UserCircleCommentID  + '/' + this.circlePageSize)
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
                Toast('网络连接有问题，请稍后重试一次');   
                config.logerror(e)
              })
            this.$refs.loadmore.onBottomLoaded();         
      },
      showCircleDetail(detailid) {
        var router = new VueRouter();
        router.push({ path: 'CircleDetail', query: { id: detailid, scrollHeight: document.body.scrollTop } });
      }
    },
    created() {  
        this.host = config.apihost  
        this.filehost = config.filehost     
          axios.get(this.host + 'api/RefreshCircleComments/' + this.type + '/0/'  + this.circlePageSize)
          .then(response => {
            this.circleMore = response.data		
            if (response.data.length > 0) {                                             
              if (response.data.length < this.circlePageSize) {
                this.circleAllLoaded = true;
              }
            }
            else {
              this.circleAllLoaded = true;
            }
          })
          .catch(e => {
            Toast('网络连接有问题，请稍后重试一次');   
            config.logerror(e)
          });
      },
      mounted() {             
      }
  }
</script>

