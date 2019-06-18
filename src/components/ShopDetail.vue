<template>
  <div>
    <headershare :topath="topath" :title="title"  :description="description" :thumb='thumb' :wechaturl='wechaturl'></headershare>

    <div class="ShopDetail_Top_Box Box-Below-Header">
      <img class="ShopDetail-Pic" :src="filehost + shop.HeadPicturePath">
      <div class="ShopDetail_Top_Detail">
        <div class="ShopDetail-Box-ShopName">
          {{shop.ShopNameCN}}        
        </div>
        <div class="ShopDetail-Box-Summary">
          {{shop.Summary}}
        </div>
      </div>
    </div> 
 
   <div v-if="shop.Address">     
    <a class="mint-cell" :href="mapurl + taddress">
      <div v-if="shop.Address.length + shop.City.length + shop.State.length + shop.ZipCode.length >33">
        <mt-cell :title="shop.Address +' '+ shop.City +', ' + shop.State+ ' ' + shop.ZipCode" label="" is-link>
          <img slot="icon" src="../assets/location.png" width="40" height="40" style="float:left">
        </mt-cell>
      </div>
        <div v-else>
          <mt-cell :title="shop.Address +' '+ shop.City +', ' + shop.State+ ' ' + shop.ZipCode" label="" is-link>
            <img slot="icon" src="../assets/location.png" width="40" height="40">
          </mt-cell>
        </div>
    </a>
   </div>
  
  <div v-if="shop.PhoneNumber">  
    <mt-cell :title="shop.PhoneNumber" label="" is-link :to="'tel:' + shop.PhoneNumber">
      <img slot="icon" src="../assets/phone.png" width="40" height="40">
    </mt-cell>
  </div>

    <div class="ShopDetail-Box-Hr" />

    <div class="ShopDetail-Space">    </div>
    <div class="ShopDetail-Detail">商户特色</div>
    <div class="ShopDetail-Box-Hr" />
    <div class="ShopDetail-Html">
      <div v-html="shop.Description"> </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import * as VueGoogleMaps from 'vue2-google-maps'
  import config from '../Config.js'
  import Vue from 'vue'
  import headershare from './Headershare'  
  import { Toast } from 'mint-ui'

  export default {
    data() {        
      return {
       topath: escape("/"),
       title: '',
       thumb: '',
       description: '',
       mapurl: '',
       wechaturl: '',
       webhost: '',
       taddress: '',
       host: '',
       filehost:'',
       html: '',
       shop: {
        ShopID:'',
        ShopNameCN:'',
        ShopNameEN:'',
        Address:'',
        City:'',
        State:'',
        ZipCode:'',
        Area:'',
        Weixin:'',
        PhoneNumber:'',
        HeadPicturePath:'',
        Rating:'',
        Summary:'',
        Description:'',
        ShopType:'',
        ShopCategory:'',
        Createddate:'',
        Createdby:'',
        Modifieddate:'',
        Modifiedby:'',
        PicturePath1:'',
        PicturePath2:'',
        PicturePath3:'',
        PicturePath4:'',
        PicturePath5:''        
          }
      }
    },
    components: {      
      headershare
    },
    methods: {       
    },
   created() { 
      this.topath = this.$route.query.topath?this.$route.query.topath:this.$route.query.tabname      
      Vue.cordova.on('deviceready', () => {
      if(navigator.geolocation) {
            var self = this;
            navigator.geolocation.getCurrentPosition(function(position){                
              self.mapurl = "http://maps.apple.com/?saddr=" + position.coords.latitude + "," + position.coords.longitude  + "&daddr="
              //self.mapurl = "https://www.google.com/maps/dir/?api=1&origin=" + position.coords.latitude + "," + position.coords.longitude  + "&destination="
            })       
          }else{
            config.logerror("navigator.geolocation not installed")
          }    
      })
      this.webhost = config.webhost 
      this.host = config.apihost 
      this.filehost = config.filehost

      axios.get(this.host + 'api/GetShopByID/' + this.$route.query.id)
        .then(response => {                       
          this.shop = response.data	  

          if (!this.shop)
          {
            Toast('此信息已过期，请重新刷新');   
            this.$router.push({ path: this.topath, query: { scrollHeight: this.$route.query.scrollHeight } } ) 
            return
          }   
          this.taddress = encodeURI(this.shop.Address +' '+ this.shop.City +', ' + this.shop.State+ ' ' + this.shop.ZipCode)          
          this.wechaturl= this.webhost + "ShopDetail?id=" + this.$route.query.id     
          this.title =  "犹他家园:" + this.shop.ShopNameCN + "名片"   
          this.description = this.shop.Summary.substring(0,25)          
          this.thumb = this.filehost + this.shop.HeadPicturePath
        })
        .catch(e => {  
          config.logerror(e)    
          Toast('网络连接有问题，请稍后重试一次');               
        });        
   }
  } 
</script>