const apihost = 'http://utahhome.net/webapiv2/'
const filehost = 'https://s3-us-west-1.amazonaws.com/elasticbeanstalk-us-west-1-2151497764861';
const webhost = 'http://utahhome.net/webv2/www/index.html#/';
const keyresult = "JDFC0S@12xb6(1*6b%$w9wkO"

//const apihost = 'http://localhost:20777/';

const wechathost = 'https://api.weixin.qq.com/';
const appid = 'wxb56a85d47db036971';
const app_secret = '395dd24ad1e10c8f54f643a416736b791';
const cVersion = '1.01';
const appName = 'id12612056961';
var model = '';
var platform = '';
var version = '';
var manufacturer = '';
var uuid = '';

import Vue from 'vue'
import axios from 'axios';
import CryptoJS from 'crypto-js'

export default {
  apihost,
  webhost,
  filehost,
  wechathost,
  appid,
  app_secret,
  cVersion,
  keyresult,
  appName,
  model,
  platform,
  version,
  manufacturer,
  uuid,
  logerror: function(message) {      
    var storage = window.localStorage;   
    var userid = storage.getItem("userid")  
    var error = "info:" + new Date() + " " + message   
    axios.post(this.apihost + 'api/ExceptionLogs/', {
    Model:this.model,
    Platform:this.platform,
    Version:this.version,
    Manufacturer:this.manufacturer,
    Uuid:this.uuid,
    Message: error,
    Userid: userid   
    })
    .then(response => {      
       
    })
    .catch(e => {   
   
    })
  },
  encode(text){  
    var token =  this.keyresult.substring(0,16)
      
    var key = CryptoJS.enc.Utf8.parse(token);
    var iv = CryptoJS.enc.Utf8.parse(token);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var passphase = encrypted.toString();   
    return passphase
  }  
}





