<template>
  <div id="app">
    <div v-show="!isMandatoryUpdate">
      <div class="content">
        <!--add by sky keep route alive-->
        <keep-alive>
          <router-view  @update-tab="handleBackLinkUpdate" v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view @update-tab="handleBackLinkUpdate" v-if="!$route.meta.keepAlive"></router-view>
        <br />
        <br />
      </div>

      <div v-if="$route.meta.isShowBottomBar">
        <mt-tabbar v-model="selected" fixed>
          <mt-tab-item id="shop">
            <div v-if="selected=='shop'">
              <div class="Nav-Box-Icon"><span class="icon icon-home"></span> </div>
              餐馆
            </div>
            <div v-else class="Nav-Box">
              <div class="Nav-Box-Icon"><span class="icon icon-home"></span> </div>
              <div>餐馆</div>
            </div>
          </mt-tab-item>
          <mt-tab-item id="live">
            <div v-if="selected=='live'">
              <div class="Nav-Box-Icon"><span class="icon icon-live"></span></div>
              生活
            </div>
            <div v-else class="Nav-Box">
              <div class="Nav-Box-Icon"><span class="icon icon-live"></span></div>
              生活
            </div>
          </mt-tab-item>
          <mt-tab-item id="event">
            <div v-if="selected=='event'">
              <div class="Nav-Box-Icon"> <span class="icon icon-event"></span></div>
              盐村活动
            </div>
            <div v-else class="Nav-Box">
              <div class="Nav-Box-Icon"> <span class="icon icon-event"></span></div>
              盐村活动
            </div>
          </mt-tab-item>
          <mt-tab-item id="circle">
            <div v-if="selected=='circle'">
              <div class="Nav-Box-Icon">
                <span class="icon icon-circle"></span>
              </div>
              盐村圈子
            </div>
            <div v-else class="Nav-Box">
              <div class="Nav-Box-Icon">
                <span class="icon icon-circle"></span>
              </div>
              盐村圈子
            </div>
          </mt-tab-item>
          <mt-tab-item id="myinfo">
            <div v-if="selected=='myinfo'">
              <div class="Nav-Box-Icon">
                <span class="icon icon-my"></span>
              </div>
              我的
            </div>
            <div v-else class="Nav-Box">
              <div class="Nav-Box-Icon">
                <span class="icon icon-my"></span>
              </div>
              我的
            </div>
          </mt-tab-item>
        </mt-tabbar>
      </div>
    </div>
    <div v-show="isMandatoryUpdate">
      <div class="panel-mask">
        <div class="panel-mask-preview" id="panel-mask-preview">
          <div class="panel-mask-update">
            <div class="update-title">
              提示
            </div>
            <!--<div class="update-hr"></div>-->
            <div class="update-message">
              系统发现新版本，您必须更新才能继续使用！
              <br />
              <br />
               <div style="text-align:center;font-weight:bold">本次更新内容：</div>
              <br />
              {{updateMessage}}
            </div>

            <div id="update-button" class="update-button">
              <div class="update_now2" v-on:click="UpdateNow">更新</div>
              <!--<mt-button type="primary" v-on:click="UpdateNow">更新</mt-button>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isNeedUpdate">
      <div class="panel-mask">
        <div class="panel-mask-preview" id="panel-mask-preview">
          <div id="panel-mask-update2" class="panel-mask-update">
            <div class="update-title">
              提示
            </div>
            <div class="update-message">
              系统发现新版本，您是否更新？
              <br />
              <br />
              <div style="text-align:center;font-weight:bold">本次更新内容：</div>
              <br />
              {{updateMessage}}
            </div>

            <div id="update-button2" class="update-button">
              <div class="update_later" v-on:click="UpdateLater">稍后再说</div>
              <div class="update_now" v-on:click="UpdateNow">更新</div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import config from './Config.js'
  import { MessageBox } from 'mint-ui';
  import { Toast } from 'mint-ui'

  export default {
    name: 'app',
    data() {
      return {
        selected: 'shop',
        isMandatoryUpdate: false,
        isNeedUpdate: false,
        updateMessage: ''
      }
    },
    created() {
      //版本检测
       axios.get(config.apihost + 'api/GetHome/' + config.cVersion + '/')
        .then(response => {
          response.data
          if (response.data != null) {
            this.updateMessage = response.data.Description;
            if (response.data.Mandatory) {              
              this.isMandatoryUpdate = true;              
            }
            else {             
              this.isMandatoryUpdate = false;
              this.isNeedUpdate = true;     
            }
          }
          else {
            this.isMandatoryUpdate = false;
          }
        })
        .catch(err => {
          console.log(err);
        });        

    },
    methods: {
      UpdateNow: function (event) {
        cordova.plugins.market.open(config.appName,
        {
          success: function() {
          // Your stuff here
          },
          error: function() {
            Toast('请打开Apple Store手动更新')
          }
        });
      },
      UpdateLater: function (event) {
        this.isNeedUpdate = false;
        this.isMandatoryUpdate = false;
      },
      handleBackLinkUpdate: function (value) {
        this.selected='myinfo'
      }        
    },
    watch: {
      selected: function (val) {
        if (val == "shop") {
          window.location.href = "#/";
        }
        else if (val == "live") {
          window.location.href = "#/Living";
        }
        else if (val == "event") {
          window.location.href = "#/Event";
        }
        else if (val == "circle") {
          window.location.href = "#/Circle";
        }
        else if (val == "myinfo") {
          window.location.href = "#/Myinfo";
        }
      }
    }
  }
</script>

