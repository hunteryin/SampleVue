<template>	 
  <mt-loadmore class="loadmore" :bottom-method="shopLoadBottom" :topDistance="10" :distanceIndex="2" :bottomDistance="30" :top-method="shopLoadTop" @top-status-change="shopHandleTopChange" @bottom-status-change="shopHandleBottomChange" :bottom-all-loaded="shopAllLoaded" :auto-fill="autoFill" ref="loadmore">        		    
    <div v-for="shop of shopMore">		
     <!-- <router-link :to="{ path: '/ShopDetail', query: { id: shop.ShopID}}"> -->
        <div class="Shop-Box" v-on:click="showShopDetail(shop.ShopID)">     
          <div class="Shop-Box-Left">
              <img style="width:80px;height:80px;background-color: #ddd;" v-lazy="filehost + shop.HeadPicturePath">
          </div>
          <div class="Shop-Box-Right">
              <div class="Shop-Box-ShopName">
              {{shop.ShopNameCN}}
              </div>
              <div v-if="shop.Address">
                <div class="Shop-Box-Desc">
                {{shop.Summary}}
                </div>
                <div class="Shop-Hr" />
                <div class="Shop-Box-Address">
                  {{shop.Address + " " + shop.City}}
                </div>
              </div>             
              <div v-else>
                <div class="Shop-Hr" />
                <div class="Shop-Box-Address">
                  {{shop.Summary}}
                </div>
              </div>
          </div>
        </div>
      <!-- </router-link> -->
      <div class="shop-Box-Space "></div>  
      </div>    
      <div v-if="shopAllLoaded === true"><center>(*￣ω￣)没有更多了</center></div>              
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
        autoFill: false,// do not use auto fill       
        //川菜
        shopMore: [],       
        shopPageNo: 0,
        shopAllLoaded: false,
        shopPageSize: 10,
        shopBottomStatus: '',         
      }
    },
	  props:['type', 'tabname'],
    methods: {
      showShopDetail(detailid) { 
        this.$router.push({ path: "/ShopDetail", query: {tabname:this.tabname, id: detailid, scrollHeight: document.body.scrollTop } });
      },  
      shopHandleBottomChange(status) {
        this.shopTopStatus = status;
      },
      shopHandleTopChange(status) {
        this.shopbottomStatus = status;
      },
      shopLoadTop(id) { 
        this.shopAllLoaded = false;
        setTimeout(() => {           
          axios.get(this.host + 'api/MoreRestaurants/' + this.type + '/0/'  + this.shopPageSize)
          .then(response => {
            this.shopMore = response.data	                     
            if (response.data.length > 0) {  
                if (response.data.length < this.shopPageSize) {
                  this.shopAllLoaded = true;
                }              }
              else {
                this.shopAllLoaded = true;
              } 		                   
          })
          .catch(e => {
            config.logerror(e)    
            Toast('网络连接有问题，请稍后重试一次');         
          });
          this.$refs.loadmore.onTopLoaded(id); 
        },1500)       
      },
      shopLoadBottom(id) {         
            axios.get(this.host + 'api/MoreRestaurants/' + this.type + '/' + this.shopMore[this.shopMore.length - 1].ShopID  + '/' + this.shopPageSize)
              .then(response => {
                if (response.data.length > 0) {
                  this.shopMore = this.shopMore.concat(response.data);
                  this.shopPageNo++;
                  if (response.data.length < this.shopPageSize) {
                    this.shopAllLoaded = true;
                  }
                }
                else {
                  this.shopAllLoaded = true;
                } 				
              })
              .catch(e => {
                 config.logerror(e)    
              })
            this.$refs.loadmore.onBottomLoaded(id);        
        }
    },
    shopHandleBottomChange(status) {
      this.shopBottomStatus = status;
    },
    created() {      
        //var oldtime = (new Date()).getTime()
        this.host = config.apihost  
        this.filehost = config.filehost  

        axios.get(this.host + 'api/MoreRestaurants/' + this.type + '/0/'  + this.shopPageSize)
        .then(response => {
          this.shopMore = response.data	                     
          if (response.data.length > 0) {  
              if (response.data.length < this.shopPageSize) {
                this.shopAllLoaded = true;
              }
            }
            else {
              this.shopAllLoaded = true;
            } 		                   
               //var newtime = (new Date()).getTime()
               //alert(newtime - oldtime)
        })
        .catch(e => {
          config.logerror(e)    
          Toast('网络连接有问题，请稍后重试一次');         
        });
      },
    mounted() { 
   	  
    },
  }
</script>







