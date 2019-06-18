<template>		  
    <mt-loadmore :bottom-method="lifeAdvertisesLoadBottom" :topDistance="10" :distanceIndex="2" :bottomDistance="30" :top-method="lifeAdvertisesLoadTop" @top-status-change="lifeAdvertisesHandleTopChange" @bottom-status-change="lifeAdvertisesHandleBottomChange" :bottom-all-loaded="lifeAdvertisesAllLoaded" :auto-fill="false" ref="loadmore">
      <div v-for="item in lifeAdvertisesMore">
        <div class="life-Box">
          <!-- <router-link :to="{ path: '/LifeAdvertiseDetail', query: { id: item.LifeAdvertiseID}}"> -->
            <div class="life-Box-Pic"  v-on:click="showAdvertiseDetail(item.LifeAdvertiseID)" >
              <img class="life-Pic" :src="filehost + item.AdvertiseImage1">
            </div>
            <div class="life-Box-Text">{{item.Summary}}</div>
         <!-- </router-link> -->
        </div>
        <div class="life-Box-Space" />
      </div>
      <div v-if="lifeAdvertisesAllLoaded === true">
        <center>(*￣ω￣)没有更多了</center>
      </div>
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
        errors: [],  
        filehost:'',      

        //推荐
        lifeAdvertisesMore: [],
        lifeAdvertisesPageNo: 0,
        lifeAdvertisesAllLoaded: false,
        lifeAdvertisesPageSize: 10,
        lifeAdvertisesbottomStatus: '',
        lifeAdvertisesTopStatus: ''      
        }      
    },
    props:['tabname'],
    methods: {
      showAdvertiseDetail(detailid) {               
        this.$router.push({ path: "/LifeAdvertiseDetail", query: { id: detailid, scrollHeight: document.body.scrollTop } });
      }, 
      lifeAdvertisesHandleBottomChange(status) {
        this.lifeAdvertisesTopStatus = status;
      },
      lifeAdvertisesHandleTopChange(status) {
        this.lifeAdvertisesbottomStatus = status;
      },
      lifeAdvertisesLoadTop(id) {   
        this.lifeAdvertisesAllLoaded = false;
        setTimeout(() => {    
         axios.get(this.host + 'api/MoreLifeAdvertises/' + '0' + '/' + this.lifeAdvertisesPageSize)
          .then(response => {
            this.lifeAdvertisesMore = response.data
            if (response.data.length > 0) {              
                if (response.data.length < this.lifeAdvertisesPageSize) {
                  this.lifeAdvertisesAllLoaded = true;
                }
              }
              else {
                this.lifeAdvertisesAllLoaded = true;
              }
          })
          .catch(e => {
              Toast('网络连接有问题，，请稍后重试一次'); 
              config.logerror(e) 
          });
          this.$refs.loadmore.onTopLoaded(id); 
         },1500)         
      },
      lifeAdvertisesLoadBottom(id) {   
          axios.get(this.host + 'api/MoreLifeAdvertises/' + this.lifeAdvertisesMore[this.lifeAdvertisesMore.length - 1].Rating + '/' + this.lifeAdvertisesPageSize)
            .then(response => {           
              if (response.data.length > 0) {
                this.lifeAdvertisesMore = this.lifeAdvertisesMore.concat(response.data);
                this.lifeAdvertisesPageNo++;
                if (response.data.length < this.lifeAdvertisesPageSize) {
                  this.lifeAdvertisesAllLoaded = true;
                }
              }
              else {
                this.lifeAdvertisesAllLoaded = true;
              }
            })
            .catch(e => {
              Toast('网络连接有问题，，请稍后重试一次'); 
              config.logerror(e) 
            })
          this.$refs.loadmore.onBottomLoaded(id);
      }
      },
     
      created() {      
        this.host = config.apihost
        this.filehost = config.filehost
        axios.get(this.host + 'api/MoreLifeAdvertises/' + '0' + '/' + this.lifeAdvertisesPageSize)
          .then(response => {
            this.lifeAdvertisesMore = response.data
            if (response.data.length > 0) {              
                if (response.data.length < this.lifeAdvertisesPageSize) {
                  this.lifeAdvertisesAllLoaded = true;
                }
              }
              else {
                this.lifeAdvertisesAllLoaded = true;
              }
          })
          .catch(e => {
              Toast('网络连接有问题，，请稍后重试一次'); 
              config.logerror(e) 
          });
      },
      mounted() {    
      }   
  }
</script>




