<template>
<div>
    <v-touch ref="touchwrapper" @panmove="move" @doubletap="zoom"   @pinchmove="scaling($event)" @pinchend="pinchdone" @pinchstart="pinchup">        
          <div id="pinchzoom" > 
            <mt-header id="header"  title="UTAH家园" fixed> 
            <mt-button slot="left" v-on:click="GoBack">
                <img style="width:40px;height:40px;margin-bottom:200px" src="../assets/goback.png" />
            </mt-button>  
            </mt-header>              
            <div id="imgwrapper"  ref="tapper" style="margin-top:100px">                            
                <img id="rect"  :src="imgurl" style="height:100%;width:100%;" v-on:click="GoBack"/>  
            </div>  
            <div :style="{'height':divheight}">   
            </div>      
             </div>
    </v-touch>  
</div>   
</template>

<script> 
  import VueTouch from 'vue-touch';
  

  export default {
    data() {        
      return {
        imgurl: '',
        index: '',
        id: '',
        count: 0,
        scale: 100,
        activeFingers: 0  ,
        last_x: 0,
        last_y: 0,
        left_sum: 0,
        divheight: '800px',
        tempscale: 100,
        oldwith: ''       
    }
    },
    components: {      
      
    },
    methods: {    
        move: function(e) 
        {                     
         var rect = document.getElementById('rect');           
         //alert(rect.clientWidth)         
         var maxright = rect.clientWidth - document.body.clientWidth > 0?(rect.clientWidth - document.body.clientWidth):0 
         var maxtop = this.$refs.tapper.getBoundingClientRect().bottom - document.documentElement.clientHeight > 0?(this.$refs.tapper.getBoundingClientRect().bottom  - document.documentElement.clientHeight):0                    
                 
         this.last_x = this.last_x + e.deltaX/3  
         this.last_x = e.deltaX < 0? Math.max(maxright * -1,this.last_x):this.last_x > 0?0:this.last_x  
         this.last_y = this.last_y + e.deltaY/2  
         this.last_y = e.deltaY < 0? Math.max(maxtop * -1,this.last_y):this.last_y > 0?0:this.last_y 
        
         rect.style.transform = "translate(" + this.last_x + "px," + this.last_y + "px)"                 
        },   
        scaling: function(e) { 
            var rect = document.getElementById('rect');                    
            var rect = document.getElementById('rect');
            var wrapper = document.getElementById('pinchzoom');
            var header = document.getElementById('header'); 
            var imgwrapper = document.getElementById('imgwrapper');                    
            this.scale =  Math.max(100, Math.min(this.tempscale * e.scale,120))           
            rect.style.height = this.scale + "%";  
            rect.style.width = this.scale + "%"; 
            wrapper.style.height = this.scale + "%";   
            wrapper.style.width = this.scale + "%";   
            header.style.width = this.scale + "%";   
            imgwrapper.style.width = this.scale + "%";  
        },
        pinchup: function(e) { 
            this.oldwith = rect.clientWidth    
        },
        pinchdone: function(e) { 
            this.tempscale = this.scale
            //var distance = (rect.clientWidth  -  this.oldwith) * -1
            //alert(distance/2)
            //rect.style.transform = "translate(" + distance/2 + "px,0px)"  
        },       
        GoBack:function()
        {       
            this.$router.push({ path: 'CircleDetail', query: { index: this.index, id: this.id }})  
        }, 
        zoom: function (e) {  
           var rect = document.getElementById('rect');
           var header = document.getElementById('header'); 
           var wrapper = document.getElementById('pinchzoom');          
           this.count = this.count + 1          
           if (this.count% 2 == 0)  
           {
            rect.style.height = '100%'
            rect.style.width = '100%'
            header.style.width = '100%'
            rect.style.width = "100%"
            rect.style.transform = "translate(0px,0px)"    
           }else{
            rect.style.height = '150%'
            rect.style.width = '150%'
            wrapper.style.height = '150%';    
            //rect.style.transform = "scale(1.5)"
            header.style.width = '150%'
           
           }
            //this.event = e.type
        }
    }, 
    mounted(){
        var temph = document.documentElement.clientHeight - this.$refs.tapper.getBoundingClientRect().bottom > 0?document.documentElement.clientHeight - this.$refs.tapper.getBoundingClientRect().bottom:0      
        this.divheight = temph + "px"
    },
    created() {  

        this.imgurl = this.$route.query.source  
        this.id = this.$route.query.id

        if (this.$route.query.index == 1)
        {
            this.index = 6
        }else
        {
            this.index = this.$route.query.index - 1
        }
    }
  }       
</script>