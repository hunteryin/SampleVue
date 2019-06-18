<template>
  <div>        
    <HeaderHomeSearch></HeaderHomeSearch>    
    
    <div class="page-navbar">
      <!--<div class="page-title">Navbar</div>-->
      <mt-navbar  v-model="selected" fixed>      
        <mt-tab-item id="1">推荐</mt-tab-item>
        <mt-tab-item id="2">川菜</mt-tab-item>
        <mt-tab-item id="3">粤菜</mt-tab-item>
        <mt-tab-item id="4">其他</mt-tab-item>      
      </mt-navbar>

      <mt-tab-container v-model="selected" swipeable> 
        <mt-tab-container-item  id="1"> 
          <div  v-if="selected === '1'">
              <keep-alive>   
                <advertisetemplate tabname="/"></advertisetemplate>
              </keep-alive>  
            </div>   
            <div v-else> 
             <keep-alive>  
             </keep-alive>  
            </div>
        </mt-tab-container-item>
    
       <mt-tab-container-item id="2">             
           <div  v-if="selected === '2'">
              <keep-alive>   
                <shoptemplate type="川菜" tabname="/"></shoptemplate> 
              </keep-alive>  
            </div>   
            <div v-else> 
             <keep-alive>  
             </keep-alive>  
            </div>
        </mt-tab-container-item>       

      
        <mt-tab-container-item id="3"> 
            <div v-if="selected === '3'">   
              <keep-alive>                       
                <shoptemplate type="粤菜" tabname="/"></shoptemplate>                  
                <div class="Restaurant-Box-Space "></div>
              </keep-alive>    
            </div>
            <div v-else> 
             <keep-alive>  
             </keep-alive>  
            </div>
        </mt-tab-container-item>      

        <mt-tab-container-item id="4">    
          <div v-if="selected === '4'">   
              <keep-alive>                       
                <shoptemplate type="其他" tabname="/"></shoptemplate>                  
                <div class="Restaurant-Box-Space "></div>
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
  import VueRouter from 'vue-router';
  import config from '../Config.js'
  import HeaderHomeSearch from './HeaderHomeSearch'
  import { Lazyload } from 'mint-ui';
  import { Toast } from 'mint-ui'

  export default {
    data() {
      return {
        isLogin: 0,
        host: '',
        selected: '1',
        shops: [],
        errors: [],
        autoFill: false,// do not use auto fill
        isFirstLoad: true,      
       

        //记录滚动条位置
        scorlllist: [],
        selectedOld: 1
      }
    },
    components: {
      HeaderHomeSearch
    },
    methods: {   
 
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
    beforeRouteEnter(to, from, next) {
      next(vm => {  
        if (vm.$route.query.scrollHeight != null)
        {
          var h = vm.$route.query.scrollHeight;
          vm.scorlllist[vm.selected] = h;
          window.scrollTo(0, h);
          //window.location.href = "#/Circle";
        }
      })
    },
    mounted() {
     
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
    ready() {
      this.isFirstLoad = false;
    }    
  }
</script>
