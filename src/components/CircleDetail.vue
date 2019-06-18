<template>
<div>  
    <headershare :topath="topath"  :title="title"  :description="description" :thumb='thumb' :wechaturl='wechaturl'></headershare>

    <div class="Box-Below-Header" >  
      <div v-if="circle.CircleImagePath1 !== null" :style="{}">   
        <mt-swipe :auto="3000" :style="{height:'280px', width:sww}" >        
            <mt-swipe-item v-if="circle.CircleImagePath1" :style="{'background-color':'black',width:sww, 'height':'250px'}" >              
                <img class="CircleDetail_Content_Image" v-lazy="filehost + circle.CircleImagePath1" v-on:click="showPic(1, filehost + circle.CircleImagePath1)">             
            </mt-swipe-item>
            <mt-swipe-item v-if="circle.CircleImagePath2" :style="{'background-color':'black',width:sww, 'height':'250px'}" > 
                  <img class="CircleDetail_Content_Image" v-lazy="filehost + circle.CircleImagePath2" v-on:click="showPic(2, filehost + circle.CircleImagePath2)"> 
            </mt-swipe-item>
             <mt-swipe-item v-if="circle.CircleImagePath3" :style="{'background-color':'black',width:sww, 'height':'250px'}" >               
                   <img class="CircleDetail_Content_Image" v-lazy="filehost + circle.CircleImagePath3" v-on:click="showPic(3, filehost + circle.CircleImagePath3)">    
            </mt-swipe-item>
             <mt-swipe-item v-if="circle.CircleImagePath4" :style="{'background-color':'black',width:sww, 'height':'250px'}" > 
                <img class="CircleDetail_Content_Image" v-lazy="filehost + circle.CircleImagePath4" v-on:click="showPic(4, filehost + circle.CircleImagePath4)">    
            </mt-swipe-item>
             <mt-swipe-item v-if="circle.CircleImagePath5" :style="{'background-color':'black',width:sww, 'height':'250px'}" >  
                 <img class="CircleDetail_Content_Image" v-lazy="filehost + circle.CircleImagePath5" v-on:click="showPic(5, filehost + circle.CircleImagePath5)">  
            </mt-swipe-item>
             <mt-swipe-item v-if="circle.CircleImagePath6" :style="{'background-color':'black',width:sww, 'height':'250px'}" > 
                 <img class="CircleDetail_Content_Image" v-lazy="filehost + circle.CircleImagePath6" v-on:click="showPic(6, filehost + circle.CircleImagePath6)"> 
            </mt-swipe-item>              
        </mt-swipe>   
      </div>  
    </div>
    <div v-show="isPreview" id="mask" class="panel-mask">
      <div class="panel-mask-preview" id="panel-mask-preview">
        <div v-show="isPreview" @click="closePreview">        
          <img class="panel-mask-preview-image" :src="previewImg">      
        </div>
      </div>
    </div>

    <div style="height:50px;margin-left:10px">   
        <div v-if="circle.UserImagePath.startsWith('http://wx')"> 
          <img class="CircleDetail-header-pic" v-if="circle.UserImagePath !== null"  v-lazy="circle.UserImagePath">
        </div>
        <div v-else>
          <img class="CircleDetail-header-pic" src="../assets/head.png">
        </div>
        <div class="CircleDetail-name">
          {{circle.UserName}}   
        </div>  
        <div  class="CircleDetail-alert">
          <img style="height:40px;width:40px" src="../assets/alert.png" v-on:click="report()">        
        </div> 
    </div>
      <div class="CircleDetail_Title" >        
         <span class="CircleDetail_Title_Summary">标题：{{circle.Title}}</span>          
      </div>      
      <div class="CircleDetail_Content_Box" >    
        <!--<textarea id="myComment" class="CircleDetail_Content" ref="myComment" v-if="circle.Comment !== null"  v-model="circle.Comment" maxlength="500" readonly></textarea>-->
        <div  class="CircleDetail_Content" id="myComment"  ref="myComment" v-if="circle.Comment !== null" v-html="circle.Comment"> </div>
      </div>

    <br>
</div>   
</template>

<script>
  import axios from 'axios';
  import VueRouter from 'vue-router';
  import config from '../Config.js'
  import Vue from 'vue'
  import headershare from './Headershare'  
  import { Lazyload } from 'mint-ui';
  import { Toast } from 'mint-ui'

  export default {
    data() {        
      return {
       isPreview: '',
       previewImg: '',
       filehost: '',
       topath:'',
       host: '',
       width1:'',
       sww: '',
       title: '',
       thumb: '',
       description: '',
       host: '',
       mapurl: '',
       wechaturl: '',
       webhost:'',
       html: '',
       image1: 
       {
         height: '300px',
         width: ''
       },
       image2: 
       {
         height:'300px',
         width: ''
       },
       image3: 
       {
         height: '300px',
         width: ''
       },
       image4: 
       {
         height: '300px',
         width: ''
       },
       image5: 
       {
         height: '300px',
         width: ''
       },
       image6: 
       {
         height: '300px',
         width: ''
       },
       circle: {
        "UserCircleCommentID":'',
        "Score":'',
        "Comment":'',
        "CreatedDate":'',
        "CreatedBy":'',
        "UserImagePath":'',
        "UserName":'',
        "Title": '',
        "CircleShortName":'',
        "CircleImagePath1":'',
        "CircleImagePath2":'',
        "CircleImagePath3":'',
        "CircleImagePath4":''        
       }  
    }
    },
    components: {      
      headershare
    },
    methods: {    
      report()
      {
        this.$router.push({ path: 'Report', query: { id: this.circle.UserCircleCommentID } })
      }, 
      showPic(selectid, url) {
        this.$router.push({ path: 'ShowImage', query: { source: url, index: selectid, id: this.$route.query.id } })
        //window.location.href = "#/ShowImage?url=" + url + "&index=" + selectid + "&id=" + this.$route.query.id;
      },
      previewImage: function(url){	        
		  this.isPreview = true;
          this.previewImg = url;
          var image = new Image();
          image.src = url;
          if (image.width >= image.height)
          {
            document.getElementById("panel-mask-preview").style.width = "95%";
          }
          else if (image.height * 1.0 / image.width>1.6)
          {
            document.getElementById("panel-mask-preview").style.width = "65%";
          }
          else
          {
            document.getElementById("panel-mask-preview").style.width = "80%";
          }
			},
      closePreview: function(){			
        this.isPreview = false;
        this.previewImg = "";
			},     
    }, 
    mounted(){      
    },
    created() {  
        this.filehost = config.filehost   
        this.topath = this.$route.query.topath?this.$route.query.topath:"Circle"      
        var sw = document.documentElement.clientWidth - 40 
        this.sww = sw            
        this.gobackurl = 'circle'
        this.host = config.apihost 
        this.webhost = config.webhost   
        this.selectindex = this.$route.query.index          
        axios.get(this.host + 'api/getCircleCommentByID/' + this.$route.query.id)
        .then(response => {  
          this.circle = response.data	       
         
          if (!this.circle.UserCircleCommentID)
          {
            Toast('该帖子可能已经被小主移除，请重新刷新');   
            this.$router.push({ path: this.topath, query: { scrollHeight: this.$route.query.scrollHeight } } ) 
            return
          }
          this.circle.Comment = this.circle.Comment.replace(/\r\n|\r|\n/g, "<br/>");         
          this.wechaturl= this.webhost + "CircleDetail?id=" + this.$route.query.id 
         
          this.title =  "犹他家园: " + this.circle.Title   
          this.description = this.circle.Comment.substring(0,25)
          this.description = this.description.replace(/<br\/>/g,"")
         
          if (this.circle.CircleImagePath1)
          {
            this.thumb = this.filehost + this.circle.CircleImagePath1	 
          }
        })
        .catch(e => {   
          Toast('网络连接有问题，请稍后重试一次');   
          config.logerror(e)
        });    
      
    }
  }       
</script>