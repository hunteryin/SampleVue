<template>
  <div>
    <mt-header  title="" fixed>
      <mt-button slot="left" v-on:click="GoBack">
        <img style="width:30px;height:30px" src="../assets/delete.png" />
      </mt-button>
      <mt-button slot="left" v-on:click="GoBack">
        取消
      </mt-button>
    </mt-header>

    <div class="Search_Content">

      <div class="page-search">
        <!--<mt-search v-model="value" v-on:search="Search()" ></mt-search>-->
        <div class="mint-search">
          <div class="mint-searchbar">
            <div class="mint-searchbar-inner">
              <i class="mintui mintui-search"></i>
              <input class="mint-searchbar-core" type="search" placeholder="搜索" v-on:search="Search()" ref="inputSearch">
            </div> <div class="mint-searchbar-cancel" v-on:click="Search()">搜索</div>
          </div>
        </div>
      </div>

      <div class="Search_Title">请选择以下分类中的一种</div>
      <div id="SearchCategoryID" class="Search_Category">
        <div v-if="select===1">
          <div class="Search_Option1_S">餐馆</div>
        </div>
        <div v-else>
          <div class="Search_Option1" v-on:click="select=1;">餐馆</div>
        </div>
        <div v-if="select===2">
          <div class="Search_Option2_S">生活</div>
        </div>
        <div v-else>
          <div class="Search_Option2" v-on:click="select=2;">生活</div>
        </div>
        <div v-if="select===3">
          <div class="Search_Option3_S">活动</div>
        </div>
        <div v-else>
          <div class="Search_Option3" v-on:click="select=3;">活动</div>
        </div>
        <div v-if="select===4">
          <div class="Search_Option4_S">圈子</div>
        </div>
        <div v-else>
          <div class="Search_Option4" v-on:click="select=4;">圈子</div>
        </div>
      </div>
      <div style="float:left;width:100%; margin-top:10px;">
        <div v-for="item in searchResult">        
          <router-link :to="{ path: '/' + item.category, query: { id: item.id, topath:'Search' }}">
            <mt-cell :title="item.name" :label="item.summary"><br /><div class="search_cell"></div></mt-cell>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
 import { MessageBox } from 'mint-ui';
  import axios from 'axios';
  import config from '../Config.js'
  import { Toast } from 'mint-ui'

export default {
  name: 'page-search',
  data() {
    return {
      value: '',    
      category: '',
      select:0,
      searchResult: []

    };
  },
  computed: {
    filterResult() {
    
      return this.defaultResult.filter(value => new RegExp(this.value, 'i').test(value));
    }
  },
   created() {
     this.host = config.apihost;
  }, 
   methods: {
    GoBack: function (event) {
      this.$router.push({ path: '/' }); 
     },
    Search:function(event)
    {
      if (this.$refs.inputSearch.value.length <= 1)
      {
        MessageBox("错误", "搜索内容过短！");
      }
      else if (this.select == 0)
      {
        MessageBox("错误", "您必须选择一个分类！");
      }
      else
      {
        switch (this.select) {
          case 1:
            this.category = "餐馆";
            break;
          case 2:
            this.category = "生活";
            break;
          case 3:
            this.category = "活动";
            break;
          case 4:
            this.category = "圈子";
            break;
        }
        axios.get(this.host + 'api/search/' + this.category + '/' + this.$refs.inputSearch.value)
          .then(response => {
            if (response.data.length > 0)
            { this.searchResult = response.data}
            else {
              MessageBox("提示", "没有找到结果，请重新输入关键字。");
            }
          })
          .catch(e => {
            config.logerror(e)    
            Toast('网络连接有问题，请稍后重试一次');    
          });
        window.focus();
        if (document.activeElement) {
          document.activeElement.blur();
        }
      }



    },
    CancelSearch: function (event)
    {
      this.$refs.inputSearch.value = "";
    }
    
  }
};
</script>
