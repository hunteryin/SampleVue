<template>	
    <mt-loadmore :bottom-method="AdvertisesLoadBottom" :topDistance="10" :distanceIndex="2"  :bottomDistance="30" :top-method="AdvertisesLoadTop" @top-status-change="AdvertisesHandleTopChange" @bottom-status-change="AdvertisesHandleBottomChange" :bottom-all-loaded="AdvertisesAllLoaded" :auto-fill="false" ref="loadmore">
      <div v-for="item in AdvertisesMore">
        <div class="life-Box">
          <!--<router-link :to="{ path: '/AdvertiseDetail', query: { id: item.AdvertiseID}}"> -->
            <div class="life-Box-Pic"  v-on:click="showAdvertiseDetail(item.AdvertiseID)" >                      
              <img class="life-Pic" v-lazy="filehost + item.AdvertiseImage1">
            </div>
            <div class="life-Box-Text">{{item.Summary}}</div>
          <!-- </router-link> -->
        </div>
        <div class="life-Box-Space" />
      </div>
      <div v-if="AdvertisesAllLoaded === true">
        <center>(*￣ω￣)没有更多了</center>
      </div>
    </mt-loadmore>          
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
        host: '',
        errors: [],    
        filehost:'',   

        //推荐
        AdvertisesMore: [],
        AdvertisesPageNo: 0,
        AdvertisesAllLoaded: false,
        AdvertisesPageSize: 10,
        AdvertisesbottomStatus: '',
        AdvertisesTopStatus: ''      
        }      
    },
    methods: {
      showAdvertiseDetail(detailid) {               
        this.$router.push({ path: "/AdvertiseDetail", query: { id: detailid, scrollHeight: document.body.scrollTop } });
      }, 
      AdvertisesHandleBottomChange(status) {
        this.AdvertisesTopStatus = status;
      },
      AdvertisesHandleTopChange(status) {
        this.AdvertisesbottomStatus = status;
      },
      AdvertisesLoadTop(id) {   
        this.AdvertisesAllLoaded = false;
        setTimeout(() => {      
          axios.get(this.host + 'api/MoreAdvertises/' + '0' + '/' + this.AdvertisesPageSize)
            .then(response => {
              this.AdvertisesMore = response.data
              if (response.data.length > 0) {             
                  if (response.data.length < this.AdvertisesPageSize) {
                    this.AdvertisesAllLoaded = true;
                  }
                }
                else {
                  this.AdvertisesAllLoaded = true;
                }
            })
            .catch(e => {          
              Toast('网络连接有问题，请稍后重试一次');   
              config.logerror(e)
            });
          this.$refs.loadmore.onTopLoaded(id);    
         },1500)   
      },
      AdvertisesLoadBottom(id) {          
        setTimeout(() => {         
          axios.get(this.host + 'api/MoreAdvertises/' + this.AdvertisesMore[this.AdvertisesMore.length - 1].Rating + '/' + this.AdvertisesPageSize)
            .then(response => {           
              if (response.data.length > 0) {
                this.AdvertisesMore = this.AdvertisesMore.concat(response.data);
                this.AdvertisesPageNo++;
                if (response.data.length < this.AdvertisesPageSize) {
                  this.AdvertisesAllLoaded = true;
                }
              }
              else {
                this.AdvertisesAllLoaded = true;
              }
            })
            .catch(e => {
              Toast('网络连接有问题，请稍后重试一次');   
              config.logerror(e)
            })
          this.$refs.loadmore.onBottomLoaded(id);
        }, 1000);
      }
      },
      created() {              
        this.host = config.apihost 
        this.filehost = config.filehost 
        //var oldtime = (new Date()).getTime()         
        axios.get(this.host + 'api/MoreAdvertises/' + '0' + '/' + this.AdvertisesPageSize)
          .then(response => {
            this.AdvertisesMore = response.data
            if (response.data.length > 0) {             
                if (response.data.length < this.AdvertisesPageSize) {
                  this.AdvertisesAllLoaded = true;
                }
              }
              else {
                this.AdvertisesAllLoaded = true;
              }
               //var newtime = (new Date()).getTime()
               //alert(newtime - oldtime)

          })
          .catch(e => {          
            Toast('网络连接有问题，请稍后重试一次');   
            config.logerror(e)
          });
      },
      mounted() {             
        Vue.cordova.on('deviceready', () => {  
          config.model = device.model;
          config.platform = device.platform;
          config.version = device.version;
          config.manufacturer = device.manufacturer;
          config.uuid = device.uuid;   
        })

      }   
  }
</script>




