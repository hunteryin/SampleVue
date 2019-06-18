<template>
  <div>
    <headerhome></headerhome>  
      <div class="page-swipe Event-ad">      
        <mt-swipe :auto="4000" style="height:200px;width:100%">
          <mt-swipe-item >
            <img style="height:200px;width:100%;background-color: #dddddd;" v-lazy= "filehost + '/pictures/toutiao/ad1.jpg'">         
          </mt-swipe-item>        
        </mt-swipe>
      </div>
   
  <div style="margin-top:270px">
      <mt-loadmore class="loadmore" :topDistnace="0.5" :distanceIndex="1" :top-method="circleLoadTop" @top-status-change="circleHandleTopChange"  :auto-fill="autoFill" ref="loadmore">        		
        <div v-for="eve in events">
          <!-- <router-link :to="{ path: '/EventDetail', query: { id: eve.EventID}}"> -->
            <div class="Event-box" v-on:click="showEventDetail(eve.EventID)">
              <div>                           
                <div class="Event-box-title">{{eve.EventName}}</div>
                <div class="Event-box-Date">{{eve.EventDate}}</div>
              </div>
              <div>
                <div class="Event-box-Summary">{{eve.Summary}}</div>
                <div v-if="eve.datediff">
                  <div class="Event-box-DateLeft">据今天还剩 {{eve.datediff}}</div>
                </div>
                <div v-else>
                  <div class="Event-box-DateLeft">今天</div>
                </div>
              </div>
            </div>
         <!-- </router-link> -->
          <div class="Event-Box-Space"></div>
        </div> 
       </mt-loadmore>  
    </div>
  </div>
</template>


<script>
  import axios from 'axios';
  import config from '../Config.js'
  import headerhome from './HeaderHome'
  import { Toast } from 'mint-ui'

  export default {
    data() {
      return {
        circleTopStatus:'',
        events: [],
        host: '',
        filehost: ''
      }
    },
    components: {
      headerhome
    },
    methods: {
      showEventDetail(detailid, evedate) { 
        this.$router.push({ path: "/EventDetail", query: {id: detailid, scrollHeight: document.body.scrollTop} });
      },        
      circleHandleTopChange(status) {
        this.circleTopStatus = status;
      },     
      p: function (s)
      {
        //创建补0函数     
          return s < 10 ? '0' + s : s;
      },
      circleLoadTop()
      {
           setTimeout(() => {   
              this.getEvents()
              this.$refs.loadmore.onTopLoaded(); 
           },1500)
      },
       getEvents: function () {      
        axios.get(this.host + 'api/events')
          .then(response => {
            this.events = response.data
          })
          .catch(e => {
            Toast('网络连接有问题，请稍后重试一次');   
            config.logerror(e)
          })
       }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {  
        if (vm.$route.query.scrollHeight != null)
        {
          var h = vm.$route.query.scrollHeight;
          //vm.scorlllist[vm.selected] = h;
          window.scrollTo(0, h);
          //window.location.href = "#/Circle";
        }
      })
    },
    created() {   
      this.host = config.apihost;
      this.filehost = config.filehost
      this.getEvents()
    }
  }
</script>