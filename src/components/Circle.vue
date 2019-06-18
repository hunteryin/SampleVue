<template>
  <div>
    <mt-header title="犹他家园" fixed>  
    <mt-button v-on:click="goCircleComment" slot="right" >
      <p><span class="icon icon-post"></span> 
      发帖</p>
    </mt-button>
    </mt-header>

    <div class="page-navbar">
      <!--<div class="page-title">Navbar</div>-->
      <mt-navbar class="page-part"  v-model="selected" fixed>
        <mt-tab-item id="1">二手</mt-tab-item>     
        <mt-tab-item id="2">租房找房</mt-tab-item>
        <mt-tab-item id="3">招聘求职</mt-tab-item>
      </mt-navbar>
      <!--<div>
        <mt-cell class="page-part" title="当前选中">{{ selected }}</mt-cell>
      </div>-->
      <mt-tab-container class="tab-container" v-model="selected" swipeable>
        <mt-tab-container-item id="1">
          <div v-if="selected === '1'" >
             <keep-alive>       
              <circletemplate ref="circletemplate" type="二手"></circletemplate>
             </keep-alive>
          </div>
          <div v-else> 
             <keep-alive>  
             </keep-alive>  
          </div> 
        </mt-tab-container-item>      

        <mt-tab-container-item id="2">  
          <div v-if="selected === '2'" >
             <keep-alive>       
              <circletemplate ref="circletemplate"  type="租房找房"></circletemplate>
             </keep-alive>
          </div>
          <div v-else> 
             <keep-alive>  
             </keep-alive>  
          </div>        
        </mt-tab-container-item>

        <mt-tab-container-item id="3">   
          <div v-if="selected === '3'" >
             <keep-alive>       
              <circletemplate ref="circletemplate"  type="招聘求职"></circletemplate>
             </keep-alive>
          </div>
          <div v-else> 
             <keep-alive>  
             </keep-alive>  
          </div>
        </mt-tab-container-item>

      </mt-tab-container>

    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import config from '../Config.js'
  import { Toast } from 'mint-ui'

  export default {
    data() {
      return {       
        selected: '1',
        errors: [],    
        //suggest2: {},
        getScoreLog: [], 

        //记录滚动条位置
        scorlllist: [],
        selectedOld: 1
      }
    },
    methods: {    
    goCircleComment()
    {           
      var storage = window.localStorage; 
      var userid = storage.getItem("userid") 
      if (!userid)
      {        
          Toast('请先登录');    
          this.$router.push({ path: '/Login', query: {tabname: "Circle"}});             
      }else{
          this.$router.push({ path: "/CircleComment"})
      }
    },
    },
    created() {  
      //记住滚动条位置
      this.scorlllist = new Array(5);
      //this.scorlllist[0] = 0;
      this.scorlllist[1] = 0;
      this.scorlllist[2] = 0;
      this.scorlllist[3] = 0;
      this.scorlllist[4] = 0;
    },
  
    activated() {  
        if (this.$route.query.Reload != null) 
        {
            setTimeout(() => {          
            if (this.$route.query.SelectedCircle != null) {
                this.selected = this.$route.query.SelectedCircle;
                this.scorlllist[this.$route.query.SelectedCircle] = 0;
              }       
            }, 100)
      
            setTimeout(() => {          
               this.$refs.circletemplate.circlefastLoadTop();
            }, 200)
        }

    },
    watch: {
      selected: function (val) {
        var sel = parseInt(val);
    
        var myLoadMore = document.body;
        this.scorlllist[this.selectedOld] = myLoadMore.scrollTop;
        this.selectedOld = sel;
        
        setTimeout(() => {
          window.scrollTo(0, this.scorlllist[this.selectedOld]);
        }, 100)
      }
    },
  }
</script>