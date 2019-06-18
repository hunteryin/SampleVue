<template>
  <div>
    <mt-header title="" fixed>
      <mt-button slot="left" v-on:click="GoBack">
        <img style="width:25px;height:25px;" src="../assets/delete.png" />
      </mt-button>
      <mt-button slot="left"  v-on:click="GoBack">
        取消
      </mt-button>
      <mt-button slot="right" v-show="!isPreview" size="large" type="primary" v-on:click="submitInfo" :disabled='isdisabled'>发布</mt-button>
    </mt-header>

    
    <div class="Box-Below-Header-Withspace">       
        <!--<textarea id="tValue" style="overflow-y:hidden; height:20px;" onpropertychange="this.style.height=this.scrollHeight + 'px'" oninput="this.style.height=this.scrollHeight + 'px'"></textarea>-->
      <div class="Circle_Pu-img">
          <div class="Circle_img_Item" v-for="(value,index) in imgArr">
            <a @click='previewImage(value.src)'>
              <img class="Circle_img_Pic":src="value.src" alt="img"/>           
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
          <div class="Circle_Title">请选择圈子</div>
            <div id="CircleCategoryID" class="Circle_Category">
                <div v-if="select===1">
                  <div class="Circle_Option1_S">二手</div>
                </div>
                <div v-else>
                  <div class="Circle_Option1" v-on:click="select=1;">二手</div>
                </div>
                <div v-if="select===2">
                  <div class="Circle_Option2_S">租房找房</div>
                </div>
                <div v-else>
                  <div class="Circle_Option2" v-on:click="select=2;">租房找房</div>
                </div>
                <div v-if="select===3">
                  <div class="Circle_Option3_S">招聘求职</div>
                </div>
                <div v-else>
                  <div class="Circle_Option3" v-on:click="select=3;">招聘求职</div>
                </div>       
            </div>
          </div>   
        <br />          
      <br />     
        <div class="Circle_Content">
          <div class="Circle-Box-Hr"></div>
          <mt-field  placeholder="标题" :attr="{ maxlength: 20 }"  v-model="title"></mt-field>
          <div class="Circle-Box-Hr"></div>
          <mt-field  placeholder="请对发布的物品进行简单描述. 如果发帖后没有看到最新的帖子，请手动下拉刷新" v-on:propertychange="autoHeight" v-on:input="autoHeight" type="textarea" rows="6" v-model="message" :attr="{ maxlength: 1000 }" ></mt-field>       
        </div>             
        <br />   
    </div>
 
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
        previewImg: '',
        userid: '',
        message: '',
        title: '',
        imgArr: [],
        isdisabled: false,
        host: '', 
        select:0,
        circlesSlot: [{
          flex: 1,
          values: ['二手', '租房找房', '招聘求职'],
          className: 'slot1'
        }],

        selectedCircle: ''
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
       GoBack: function (event) {
         MessageBox.confirm('确定取消发布?', '提示')
           .then(action => {
             window.history.back();
           }).catch(err => {
             console.log(err);
           });
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
      submitInfo: function () {  
        this.isdisabled = true
        var router = new VueRouter();  
        if (this.title.length == 0)
        {
          MessageBox('警告', '发布标题不能为空')
           this.isdisabled = false    
           return
        }
        else if (this.message.length > 1000) {
          MessageBox('警告', '字数不能超过1000！')
           this.isdisabled = false    
          return;
        }else if(this.message.length === 0 && this.imgArr.length === 0){
          MessageBox('警告', '发布消息不能为空')
           this.isdisabled = false    
          return;
        } else if (this.select == 0) {
          MessageBox('警告', '您必须选择一个圈子')
           this.isdisabled = false    
          return;
        }
        else {
          let url = this.host + 'api/FileUpload/uploadFile'

          let i=0,len = this.imgArr.length,urlArr=[];
          for(i;i<len;i++){
            var a = this.imgArr[i].src;
            urlArr.push(encodeURIComponent(this.imgArr[i].src.substring(22)));
          }

          let memberId = localStorage.getItem('memberId');

          switch (this.select)
          {
            case 1:
              this.selectedCircle = '二手';
              break;
            case 2:
              this.selectedCircle = '租房找房';
              break;
            case 3:
              this.selectedCircle = '招聘求职';
              break;
          }

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
         this.postPic(urlArr, passphase)
        })
         .catch(e => {   
            Indicator.close();        
            Toast('网络连接有问题，，请稍后重试一次'); 
            config.logerror(e)  
            this.isdisabled = false           
        })   
        }
      
      },
     postPic(urlArr, passphase){    
          axios.post(this.host + 'api/FileUpload/PostCommentsWithPic', {
          token: passphase,
          CommentPic:
          {
            Title:this.title,
            UserID:this.userid,
            CircleShortName: this.selectedCircle,
            Comment:this.message,
            CircleImagePath1: urlArr[0],
            CircleImagePath2: urlArr[1],
            CircleImagePath3: urlArr[2],
            CircleImagePath4: urlArr[3],
            CircleImagePath5: urlArr[4],
            CircleImagePath6: urlArr[5]
          }
          })
            .then(response => {      
            if (response.data == "1")   
            {
              Indicator.close()            
              var router = new VueRouter();
              router.push({ path: 'Circle', query: { Reload: 'true', SelectedCircle: this.select }, params: { } });    
              Toast('上传成功');                      
            }else
            {
             Indicator.close()
             Toast('上传失败，请重试一次');  
             this.isdisabled = false      
            }             
          })
          .catch(e => {          
            Indicator.close()
            Toast('网络连接有问题，请稍后重试一次');   
            config.logerror(e)
            this.isdisabled = false
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
        //alert("大于400万像素")       
        //ratio = Math.sqrt(ratio);  
        ratio = 5
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



      var ndata
    
      if (canvas.width * canvas.height >= 4000000)
      {       
        ndata = canvas.toDataURL('image/jpeg', 0.08);  
      }else{       
        ndata = canvas.toDataURL('image/jpeg', 0.1);  
      }
      
    
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
      this.isdisabled = false
      var storage = window.localStorage; 
      this.userid = storage.getItem("userid") 
  }
  }
</script>




