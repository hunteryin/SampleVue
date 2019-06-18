<template>
  <div>        
    <headerhome></headerhome>    
    
    <div class="page-navbar">
      <!--<div class="page-title">Navbar</div>-->
      <mt-navbar class="page-part"  v-model="selected" fixed>      
        <mt-tab-item id="1">推荐</mt-tab-item>
        <mt-tab-item id="2">生活服务</mt-tab-item> 
        <mt-tab-item id="3">保险医疗</mt-tab-item>   
        <mt-tab-item id="4">少儿教育</mt-tab-item>  
        <mt-tab-item id="5">地产金融</mt-tab-item>      
      </mt-navbar>

      <mt-tab-container v-model="selected" swipeable>
        <mt-tab-container-item  id="1"> 
          <div v-if="selected === '1'">  
            <keep-alive>               
              <lifeadvertisetemplate tabname="Living"></lifeadvertisetemplate>
              <div class="life-Box-Space "></div>
            </keep-alive>  
          </div>
          <div v-else> 
             <keep-alive>  
             </keep-alive>  
          </div>
        </mt-tab-container-item>

        <mt-tab-container-item id="2">    
          <div v-if="selected === '2'"> 
            <keep-alive>                   
             <shoptemplate type="生活服务" tabname="Living"></shoptemplate>
             <div class="life-Box-Space "></div>
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
              <shoptemplate type="保险医疗" tabname="Living"></shoptemplate>
              <div class="life-Box-Space "></div>
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
              <shoptemplate type="少儿教育" tabname="Living"></shoptemplate>
              <div class="life-Box-Space "></div>
             </keep-alive>     
          </div>
          <div v-else> 
             <keep-alive>  
             </keep-alive>  
          </div>
        </mt-tab-container-item>

       <mt-tab-container-item id="5">    
          <div v-if="selected === '5'"> 
            <keep-alive>                     
             <shoptemplate type="地产金融" tabname="Living"></shoptemplate>
             <div class="life-Box-Space "></div>
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
  import headerhome from './HeaderHome'
  import { Toast } from 'mint-ui'

  export default {
    data() {
      return {
        isLogin: 0,
        host: '',
        selected: '1',
        shops: [],
        errors: [],

        //记录滚动条位置
        scorlllist: [],
        selectedOld: 1
      }
    },
    components: {
      headerhome
    },
    methods: {
      
      },
     
      created() {   
        this.host = config.apihost
        axios.get(this.host + 'api/MoreLifeAdvertises/' + '0' + '/' + this.lifeAdvertisesPageSize)
          .then(response => {
            this.lifeAdvertisesMore = response.data
          })
          .catch(e => {
            this.errors.push(e)
          });
        //记住滚动条位置
        this.scorlllist = new Array(6);
        //this.scorlllist[0] = 0;
        this.scorlllist[1] = 0;
        this.scorlllist[2] = 0;
        this.scorlllist[3] = 0;
        this.scorlllist[4] = 0;
        this.scorlllist[5] = 0;
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
      
      }    
  }
</script>
