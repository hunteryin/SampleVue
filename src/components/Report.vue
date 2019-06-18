<template>
<div>
    <mt-header id="header"  title="举报" fixed> 
        <mt-button slot="left" v-on:click="GoBack">
            <img style="width:40px;height:40px;margin-bottom:200px" src="../assets/goback.png" />
        </mt-button> 
        <mt-button slot="right" size="large" type="primary" v-on:click="submit" :disabled='isdisabled'>提交</mt-button> 
     </mt-header> 
     <div class="Box-Below-Header" > 
        <mt-field  placeholder="请填写举报内容" type="textarea" rows="5" v-model="message" :attr="{ maxlength: 200 }" ></mt-field>       
     </div>
</div>   
</template>

<script> 
  import axios from 'axios';
  import VueRouter from 'vue-router';
  import config from '../Config.js'
  import { Toast } from 'mint-ui'  

  export default {
    data() {        
      return {
      host: '',
      message: '',
      isdisabled: false,
    }
    },
    components: {      
      
    },
    methods: {  
        GoBack()
        {
            this.$router.go(-1)
        },
        submit()
        {
           if (!this.message)
           {
                Toast('内容不能为空');        
                return
           }
            this.isdisabled = true
            var storage = window.localStorage; 
            this.userid = storage.getItem("userid") 
            axios.post(this.host + 'api/UserCircleCommentReports', { 
                UserCircleCommentID:this.$route.query.id,
                Comment: this.message,
                UserID:this.userid           
            })
            .then(response => {                
            if (response.data.UserCircleCommentReportID)   
            {
              //Indicator.close()  
              this.$router.go(-1)  
              Toast('上传成功');                      
            }else
            {
             //Indicator.close()
             Toast('上传失败，请重试一次');  
             this.isdisabled = false      
            }             
          })
          .catch(e => {          
            //Indicator.close()
            Toast('上传失败，请重试一次');  
            config.logerror(e)
            this.isdisabled = false
          }); 

        }      
    }, 
    mounted(){

    },
    created() {  
      this.host = config.apihost
    }
  }       
</script>