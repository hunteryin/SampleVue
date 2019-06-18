<template>
  <div>
    <mt-header title="" fixed>
      <mt-button slot="left" v-on:click="GoBack">
        <img style="width:25px;height:25px;" src="../assets/delete.png" />
      </mt-button>
      <mt-button slot="left"  v-on:click="GoBack">
        取消
      </mt-button>
      <mt-button slot="right" class="item-content open-panel" v-on:click="close()">
           删除帖子
      </mt-button>
    </mt-header>

    
    <div class="Box-Below-Header-Withspace">       
        <!--<textarea id="tValue" style="overflow-y:hidden; height:20px;" onpropertychange="this.style.height=this.scrollHeight + 'px'" oninput="this.style.height=this.scrollHeight + 'px'"></textarea>-->
      <div class="Circle_Pu-img">
     
          <div class="Circle_img_Item" v-for="(value,index) in imgArr">              
            <a @click='previewImage(value.src)'>
              <img v-bind:id="picid"  class="Circle_img_Pic" v-lazy="value.src" alt="img" />           
            </a>
              <img v-show="!isPreview" class="Circle_img_Cancel" @click='delete_img(index)' src="../assets/delete.png">
          </div>
        <div class="Circle_img_Item" v-show="imgArr.length < 6">
          <a id="pic0a" href="javascript:;" class="Circle_Pu-Add-img">
            <img class="Circle_img_Add"src="../assets/add.png" />
            <input type="file" v-on:change="addImg" multiple/>
          </a>
        </div>
      </div>

      <div v-show="isPreview" id="mask" class="panel-mask">
        <div class="panel-mask-preview" id="panel-mask-preview">
          <div v-show="isPreview" @click="closePreview">
            <img class="panel-mask-preview-cancel" src="../assets/delete.png">
            <img class="panel-mask-preview-image" :src="previewImg">      
          </div>
        </div>
      </div>

      <div class="Circle_Content">
          <div class="Circle_Title">圈子</div>
            <div id="CircleCategoryID" class="Circle_Category">
               {{circleItem.CircleShortName}}
            </div>
          </div>   
        <br />          
      <br />     
        <div class="Circle_Content">
          <div class="Circle-Box-Hr"></div>
          <span  class="MyCircle_EditTitleText_Title" >标题:</span>
          <input type="text" class="MyCircle_EditTitleText_Box" style="vertical-align:middle;width:300px" maxlength=20 v-model="circleItem.Title"></input>
          <div class="Circle-Box-Hr"></div>
          <mt-field  v-on:propertychange="autoHeight" v-on:input="autoHeight" type="textarea" rows="8" v-model="circleItem.Comment" :attr="{ maxlength: 1000 }"></mt-field>       
        </div>             
        <br />   
    </div>
     <mt-button size="large" type="primary" v-on:click="Save">保存修改</mt-button>
  </div>
</template>


<script>
  import axios from 'axios'
  import { Toast } from 'mint-ui'
  import VueRouter from 'vue-router';
  import config from '../Config.js'
  import { MessageBox } from 'mint-ui';
  import { Indicator } from 'mint-ui'
  import CryptoJS from 'crypto-js'

  export default{
    data: function () {
      return {
        isPreview: '',
        picid: 'pic0',
        previewImg: '',
        filehost: '',
        userid: '',
        imgArr: [],
        host: '', 
        select:0,
        circlesSlot: [{
          flex: 1,
          values: ['二手', '租房找房', '招聘求职'],
          className: 'slot1'
        }],
        selectedCircle: '',
        circleItem: {
          UserCircleCommentID: '',
          Score: '',
          Comment: '',
          CreatedDate: '',
          CreatedBy: '',
          UserImagePath: '',
          CircleID: '',
          UserName: '',
          CircleShortName: '',
          CircleImagePath1: '',
          CircleImagePath2: '',
          CircleImagePath3: '',
          CircleImagePath4: '',
          CircleImagePath5: '',
          CircleImagePath6: '',
          Title: '',
          Enabled: ''
        }
      }
    },
    created: function () {
      this.$store.commit('changeIndexConf', {
        isFooter: false,
        isCircle: false,
        isBack: true,
        isShare: false,
        title: '发布圈子'
      })
    },
    components: {},
    methods: {
      // onCircleChange(picker, values) {
      //  this.selectedCircle = values[0];
      //},
      autoHeight: function (event)
      {
        document.getElementsByTagName("textarea")[0].style.height = document.getElementsByTagName("textarea")[0].scrollHeight + "px";
      },
      close: function(event) {
          MessageBox.confirm('确定删除?', '提示')
          .then(action => {
              axios.get(this.host + 'api/GetTokens/' +  this.userid)
              .then(response => {                 
                var result = "2507" + response.data.token
                var token =  result.substring(0,16)
                  
                var key = CryptoJS.enc.Utf8.parse(token);
                var iv = CryptoJS.enc.Utf8.parse(token);
                var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(response.data.token), key,
                {
                    keySize: 128 / 8,
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });                 
                   var self = this                
                   var passphase = encrypted.toString();             
                   axios.put(this.host + 'api/UserCircleComments/DeleteUserCircleComment', { 
                    token: passphase,
                    userid: self.userid,
                    commentid: self.circleItem.UserCircleCommentID
                    })                   
                   .then(function (response) {
                    Toast('删除成功！');
                    self.$router.go(-1) 
                    })
                    .catch(e => {
                      config.logerror(e)    
                      Toast('网络连接有问题，请稍后重试一次');  
                      return;
                    }); 
                    })
                .catch(e => {           
                    Toast('网络连接有问题，，请稍后重试一次'); 
                    config.logerror(e)             
                }) 

           }).catch(err => {
            //console.log(err);
           });


      },
       GoBack: function (event) {
          window.history.back();
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
            document.getElementById("panel-mask-preview").style.width = "70%";
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
      Save: function () {  
        var router = new VueRouter();  
        if (this.circleItem.Title.length == 0)
        {
          MessageBox('警告', '发布标题不能为空')
        }
        else if (this.circleItem.Comment.length > 500) {
          MessageBox('警告', '字数不能超过500！')
          return;
        }else if(this.circleItem.Comment.length === 0){
          MessageBox('警告', '发布消息不能为空')
          return;
        } 
        else {
          let i=0,len = this.imgArr.length,urlArr=[];
          for(i;i<len;i++){           
            if (this.imgArr[i].src.includes("http"))
            {
                urlArr.push(encodeURIComponent(this.imgArr[i].src));
            }
            else
            {
                urlArr.push(encodeURIComponent(this.imgArr[i].src.substring(22)));
            }
          }

          let memberId = localStorage.getItem('memberId');

          Indicator.open({
              text:'拼命上传中',
              spinnerType: 'fading-circle'
           })

          axios.get(this.host + 'api/GetTokens/' +  this.userid)
            .then(response => {                 
              var result = "2507" + response.data.token
              var token =  result.substring(0,16)
                
              var key = CryptoJS.enc.Utf8.parse(token);
              var iv = CryptoJS.enc.Utf8.parse(token);
              var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(response.data.token), key,
              {
                  keySize: 128 / 8,
                  iv: iv,
                  mode: CryptoJS.mode.CBC,
                  padding: CryptoJS.pad.Pkcs7
              });
            var passphase = encrypted.toString(); 
            this.saveedit(urlArr, passphase)
            })
            .catch(e => {  
                Indicator.close()         
                Toast('网络连接有问题，，请稍后重试一次'); 
                config.logerror(e)             
            })   
         }
      },
     saveedit(urlArr, passphase)
     {
        axios.post(this.host + 'api/FileUpload/UpdateCommentsWithPic', {
        token: passphase,
        CommentPic:
        {
          UserCircleCommentID:this.circleItem.UserCircleCommentID,
          Title:this.circleItem.Title,
          UserID:this.userid,
          CircleShortName: this.circleItem.CircleShortName,
          Comment:this.circleItem.Comment,
          CircleImagePath1: urlArr[0],
          CircleImagePath2: urlArr[1],
          CircleImagePath3: urlArr[2],
          CircleImagePath4: urlArr[3],
          CircleImagePath5: urlArr[4],
          CircleImagePath6: urlArr[5]
        }
        })
          .then(response => {
          Indicator.close()
          Toast('上传成功'); 
          //this.$router.push({ path: 'Circle', query: { Reload: 'true', SelectedCircle: this.select }, params: { } });              
          this.$router.go(-1)
        })
        .catch(e => {
          Indicator.close()
          Toast('网络连接有问题，请稍后重试一次');   
          config.logerror(e)
        });  
     },
     delete_img(item){
               this.imgArr.splice(item,1);
      },
     addImg: function (event) {    
        let self = this        
        if (event.target.files.length + self.imgArr.length > 6)
        {
          MessageBox('警告', '一次最多只能上传6张图片！')
          return
        }

        let i=0
        for(i;i<event.target.files.length;i++){
          var file = event.target.files[i]
          if (!/image\/\w+/.test(file.type)) {
            Toast('文件必须为图片！')
            return false
          }
        //var reader = new FileReader();  
        // 将图片2将转成 base64 格式  
        //reader.readAsDataURL(file);  
        // 读取成功后的回调  
        //reader.onload = function (e) {  
        //self.imgArr.push({src: this.result})          
        //}
        self.imgPreview (file)          
         } 
      }, 
      imgPreview (file) {          
      let self = this;  
      let Orientation;  
      //去获取拍照时的信息，解决拍出来的照片旋转问题  
      
      //EXIF.getData(file, function(){  
      //    Orientation = Exif.getTag(this, 'Orientation');  
      //})  

      this.getEXIFOrientation(file, orientation => {
          Orientation = orientation
      })

      // 看支持不支持FileReader  
      if (!file || !window.FileReader) return;  
  
      if (/^image/.test(file.type)) {  
          // 创建一个reader  
          var reader = new FileReader();  
          // 将图片2将转成 base64 格式  
          reader.readAsDataURL(file);  
          // 读取成功后的回调  
          reader.onload = function (e) {  
            let result = this.result;  
            let img = new Image();  
            img.src = this.result;
            
           // 判断图片是否大于100K,是就直接上传,反之压缩图片  
            if (this.result.length <= (100 * 1024)) {  
                self.imgArr.push({src: this.result})
            }else {  
                img.onload = function () {
                let data = self.compress(img,Orientation);  
                self.imgArr.push({src: data}) 
                } 
              }
            }  
          }  
         
      },
       rotateImg (img, direction,canvas) {  
        //最小与最大旋转方向，图片旋转4次后回到原方向      
        const min_step = 0;      
        const max_step = 3;        
        if (img == null)return;      
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错      
        let height = img.height;      
        let width = img.width;        
        let step = 2;      
        if (step == null) {      
            step = min_step;      
        }      
        if (direction == 'right') {      
            step++;      
            //旋转到原位置，即超过最大值      
            step > max_step && (step = min_step);           
        } 
        else if (direction == '2') { 
            step = 2;      
        }
        else {      
            step--;      
            step < min_step && (step = max_step);      
        }       
        //旋转角度以弧度值为参数      
        let degree = step * 90 * Math.PI / 180;     
        let ctx = canvas.getContext('2d');      
        switch (step) {      
          case 0:      
              canvas.width = width;      
              canvas.height = height;      
              ctx.drawImage(img, 0, 0);      
              break;      
          case 1:      
              canvas.width = height;      
              canvas.height = width;      
              ctx.rotate(degree);      
              ctx.drawImage(img, 0, -height);      
              break;      
          case 2:      
              canvas.width = width;      
              canvas.height = height;      
              ctx.rotate(degree);      
              ctx.drawImage(img, -width, -height);      
              break;      
          case 3:      
              canvas.width = height;      
              canvas.height = width;      
              ctx.rotate(degree);      
              ctx.drawImage(img, -width, 0);      
              break;  
        }      
    },  
    compress(img,Orientation) {     
      let canvas = document.createElement("canvas");  
      let ctx = canvas.getContext('2d');  
        //瓦片canvas  
      let tCanvas = document.createElement("canvas");  
      let tctx = tCanvas.getContext("2d");  
      let initSize = img.src.length;  
      let width = img.width;  
      let height = img.height;  
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下  
      let ratio;  
      if ((ratio = width * height / 4000000) > 1) {  
        console.log("大于400万像素")       
        //ratio = Math.sqrt(ratio);  
        ratio = 1.2
        width /= ratio;  
        height /= ratio;  
      } else {  
        ratio = 1;  
      }  
      canvas.width = width;  
      canvas.height = height;  
  //        铺底色  
      ctx.fillStyle = "#fff";  
      ctx.fillRect(0, 0, canvas.width, canvas.height);  
      //如果图片像素大于100万则使用瓦片绘制  
      let count;  
      if ((count = width * height / 1000000) > 1) {  
        console.log("超过100W像素");  
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片  
  //            计算每块瓦片的宽和高  
        let nw = ~~(width / count);  
        let nh = ~~(height / count);  
        tCanvas.width = nw;  
        tCanvas.height = nh;  
        for (let i = 0; i < count; i++) {  
          for (let j = 0; j < count; j++) {  
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);  
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);  
          }  
        }  
      } else {  
        ctx.drawImage(img, 0, 0, width, height);  
      } 

      //修复ios上传图片的时候 被旋转的问题  
      //Toast('rotate前：' + Date.now());  
      if(Orientation != "" && Orientation != 1){  
        switch(Orientation){  
          case 6://需要顺时针（向左）90度旋转               
              this.rotateImg(img,'left',canvas);  
              break;  
          case 8://需要逆时针（向右）90度旋转             
              this.rotateImg(img,'right',canvas);  
              break;  
          case 3://需要180度旋转             
              this.rotateImg(img,'2',canvas); 
              this.rotateImg(img,'2',canvas); 
              break;  
        }  
      }
      //Toast('rotatehou：' + Date.now());    
      //进行最小压缩  
      //console.log('压缩前：' + Date.now());  
      let ndata = canvas.toDataURL('image/jpeg', 0.1);  
      //console.log('压缩前：' + initSize);  
      //console.log('压缩后：' + ndata.length);  
      //console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");  
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;  
      //console.log('压缩后：' + Date.now());  
      return ndata;  
    }, 
      getEXIFOrientation (file, callback) {
      var reader = new FileReader()
      reader.onload = e => {
        var view = new DataView(e.target.result)
        if (view.getUint16(0, false) !== 0xFFD8) {
          return callback(-2)
        }
        var length = view.byteLength
        var offset = 2
        while (offset < length) {
          var marker = view.getUint16(offset, false)
          offset += 2
          if (marker === 0xFFE1) {
            if (view.getUint32(offset += 2, false) !== 0x45786966) {
              return callback(-1)
            }
            var little = view.getUint16(offset += 6, false) === 0x4949
            offset += view.getUint32(offset + 4, little)
            var tags = view.getUint16(offset, little)
            offset += 2
            for (var i = 0; i < tags; i++) {
              if (view.getUint16(offset + (i * 12), little) === 0x0112) {
                return callback(view.getUint16(offset + (i * 12) + 8, little))
              }
            }
          } else if ((marker & 0xFF00) !== 0xFF00) {
            break
          } else {
            offset += view.getUint16(offset, false)
          }
        }
        return callback(-1)
      }
      reader.readAsArrayBuffer(file.slice(0, 65536))
    }
  },
  created() {
      this.host = config.apihost
      this.filehost = config.filehost    
      var storage = window.localStorage; 
      this.userid = storage.getItem("userid") 
      if (!this.userid)
      {
          Toast('请先登录');    
          this.$router.push({ path: 'login' }); 
      }
      axios.get(this.host + 'api/getCircleCommentByID/' + this.$route.query.circleItem.UserCircleCommentID)
      .then(response => {                    
      this.circleItem = response.data	
      if (this.circleItem.CircleImagePath1)        
      {               
        this.imgArr.push({src: this.filehost + this.circleItem.CircleImagePath1}) 
      }

      if (this.circleItem.CircleImagePath2)        
      {
        this.imgArr.push({src: this.filehost + this.circleItem.CircleImagePath2}) 
      }
      if (this.circleItem.CircleImagePath3)        
      {
        this.imgArr.push({src: this.filehost + this.circleItem.CircleImagePath3}) 
      }
      if (this.circleItem.CircleImagePath4)        
      {
        this.imgArr.push({src: this.filehost + this.circleItem.CircleImagePath4}) 
      }
      if (this.circleItem.CircleImagePath5)        
      {
        this.imgArr.push({src: this.filehost + this.circleItem.CircleImagePath5}) 
      }
      if (this.circleItem.CircleImagePath6)        
      {
        this.imgArr.push({src: this.filehost + this.circleItem.CircleImagePath6}) 
      }
      })
      .catch(e => {      
        Toast('网络连接有问题，请稍后重试一次');   
        config.logerror(e)
      });   
      
  }
  }
</script>




