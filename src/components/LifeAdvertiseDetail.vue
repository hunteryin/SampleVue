<template>
<div>
  <headershare :topath="topath" :title="title"  :description="description" :thumb='thumb' :wechaturl='wechaturl'></headershare>

  <div class="Advertise-Detail-BigBox Box-Below-Header">
    <mt-swipe :auto="2000" style="height:200px;width:100%">
      <mt-swipe-item v-if="advertise.AdvertiseImage1"><img style="height:200px;width:100%" v-lazy="filehost + advertise.AdvertiseImage1"></mt-swipe-item>
      <mt-swipe-item v-if="advertise.AdvertiseImage2"><img style="height:200px;width:100%" v-lazy="filehost + advertise.AdvertiseImage2"></mt-swipe-item>
      <mt-swipe-item v-if="advertise.AdvertiseImage3"><img style="height:200px;width:100%" v-lazy="filehost + advertise.AdvertiseImage3"></mt-swipe-item>
    </mt-swipe>

    <div class="Advertise-Detail">简介</div>
    <div class="Advertise-Box-Hr" />

    <div>
      <div class="Advertise-Text">{{advertise.Summary}}</div>
    </div>

    <div class="Advertise-Space"></div>
    <div v-if="advertise.Address">
      <a class="mint-cell" :href="mapurl + taddress">
        <mt-cell :title="advertise.Address" label="" is-link>
          <img slot="icon" src="../assets/location.png" width="40" height="40">
        </mt-cell>
      </a>
    </div>

    <div v-if="advertise.PhoneNumber">
      <mt-cell :title="advertise.PhoneNumber" label="" is-link :to="'tel:' + advertise.PhoneNumber">
        <img slot="icon" src="../assets/phone.png" width="40" height="40">
      </mt-cell>
    </div>

    <div class="Advertise-Space"></div>

    <div class="Advertise-Detail">详情</div>
    <div class="Advertise-Box-Hr" />

    <div class="Advertise-Html">
      <div v-html="advertise.Detail"> </div>
    </div>
  </div>
  </div>
</template>

<script>  
  import * as VueGoogleMaps from 'vue2-google-maps'
  import VueRouter from 'vue-router';
  import config from '../Config.js'
  import axios from 'axios';
  import Vue from 'vue'
  import headershare from './Headershare'  
  import { Toast } from 'mint-ui'

  export default {
    data() {        
      return {
       host: '',
       title: '',
       thumb: '',
       description: '',
       host: '',
       mapurl: '',
       wechaturl: '',
       taddress: '',
       webhost:'',
       filehost:'',
       message: 'hi #linky',
       events: [],
       shopID: '',
       advertise: {
          AdvertiseID:'',
          ShopName:'',
          Summary:'',
          Detail:'',
          ADCategory:'',
          ADArea:'',
          AdvertiseImage1:'',
          AdvertiseImage2:'',
          AdvertiseImage3:'',
          AdvertiseImage4:'',
          AdvertiseImage5:'',
          AdvertiseImage6:'',
          Createddate:'',
          Createdby:'',
          Modifieddate:'',
          Modifiedby:'',
          EffectiveEndDate:'',
          Enabled:'',
          Rating:''           
          }
      }
    },
    components: {      
      headershare
    },
    methods: {     
    },
    created() {  
      this.host = config.apihost
      this.webhost = config.webhost 
      this.filehost = config.filehost
      this.topath = this.$route.query.topath?this.$route.query.topath:"Living" 

      Vue.cordova.on('deviceready', () => {
      if(navigator.geolocation) {
            var self = this;
            navigator.geolocation.getCurrentPosition(function(position){                
              self.mapurl = "http://maps.apple.com/?saddr=" + position.coords.latitude + "," + position.coords.longitude  + "&daddr="
              //self.mapurl = "https://www.google.com/maps/dir/?api=1&origin=" + position.coords.latitude + "," + position.coords.longitude  + "&destination="
            })       
          }else{            
              config.logerror(e) 
          }    
      })
     
      axios.get(this.host + 'api/GetLifeAdvertiseByID/' + this.$route.query.id)
      .then(response => {                                  
        this.advertise = response.data	

        if (!this.advertise)
        {
          Toast('此推荐已过期，请重新刷新');   
          this.$router.push({ path: this.topath, query: { scrollHeight: this.$route.query.scrollHeight } } ) 
          return
        }   

        this.taddress = encodeURI(this.advertise.Address)
        this.wechaturl= this.webhost + "LifeAdvertiseDetail?id=" + this.$route.query.id 
        this.title =  "UTAH家园: " + this.advertise.ShopName  	     
        this.description = this.advertise.Summary
        this.thumb = this.filehost + this.advertise.AdvertiseImage1     

      })
      .catch(e => {
         Toast('网络连接有问题，，请稍后重试一次'); 
         config.logerror(e) 
      });   
   }
  } 
</script>
