<template>
<div>
  <headershare :topath="topath"  :title="title" :description="description" :thumb='thumb' :wechaturl='wechaturl'></headershare>
  <div class="Box-Below-Header">   
    <mt-cell :title="event.EventName" :label="event.EventDate"><div style="height:70px"></div>
    </mt-cell>
    <div v-if="EventAddress">
      <mt-cell :title="event.EventAddress" label="" is-link>
        <img slot="icon" src="../assets/location.png" width="40" height="40">
      </mt-cell>
    </div>
    <div v-if="EventPhone">
      <mt-cell :title="event.EventPhone" label="" is-link :to="'tel:' + event.EventPhone">
        <img slot="icon" src="../assets/phone.png" width="40" height="40">
      </mt-cell>
    </div>
  </div>

  <!--<div class="event-Space"></div>-->

  <div class="event-Detail">详情</div>
  <div class="event-Box-Hr"></div>
  <div class="event-html"> 
      <div>
        {{event.Summary}}
      </div> 

       <div>
         <div v-html="event.EventDetail">
       </div>
  </div> 
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
       title: '',
       thumb: '',
       description: '',
       host: '',
       wechaturl: '',
       webhost:'',
       html: '',
       event: {
       "EventID":'',
       "EventName":'',
       "EventAddress":'',
       "EventDetail":'',
       "EventPhone":'',
       "EventLink":'',
       "Createddate":'',
       "Createdby":'',
       "Modifieddate":'',
       "Modifiedby":'',
       "EventDate":'',
       "Summary":''
          },      
      }
    },
    components: {      
      headershare
    },
    methods: {     
    },
    created() {   
      
      this.webhost = config.webhost 
      this.host = config.apihost 
      this.topath = this.$route.query.topath?this.$route.query.topath:"Event"  
        
      this.host = config.apihost       
        axios.get(this.host + 'api/GetEventByID/' + this.$route.query.id)
        .then(response => {  
          this.event = response.data    

          if (!this.event)
          {
            Toast('此活动已过期，请重新刷新');   
            this.$router.push({ path: this.topath, query: { scrollHeight: this.$route.query.scrollHeight } } ) 
            return
          }        
          
          this.title =  "犹他家园: " + this.event.EventName   
          this.description = this.event.EventDetail.replace(/(&nbsp;|<([^>]+)>)/ig,"")
          this.description = this.description.substring(0,25)         
          this.wechaturl= this.webhost + "EventDetail?id=" + this.$route.query.id      	
        })
        .catch(e => {
          Toast('网络连接有问题，请稍后重试一次');   
          config.logerror(e)    
        });    
      
   }
  } 
</script>

<style>

</style>