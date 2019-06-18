import Vue from 'vue'
import Router from 'vue-router'
import Restaurant from '@/components/Restaurant'
import Event from '@/components/Event'
import Living from '@/components/Living'
import Circle from '@/components/Circle'
import CircleDetail from '@/components/CircleDetail'
import CircleComment from '@/components/CircleComment'
import EventDetail from '@/components/EventDetail'
import Myinfo from '@/components/Myinfo'
import Search from '@/components/Search'
import AdvertiseDetail from '@/components/AdvertiseDetail'
import ShopDetail from '@/components/ShopDetail'
import Settings from '@/components/Settings'
import MyCircle from '@/components/MyCircle'
import MyCircleEdit from '@/components/MyCircleEdit'
import Register from '@/components/Register'
import Login from '@/components/Login'
import HeaderHome from '@/components/HeaderHome'
import LifeAdvertiseDetail from '@/components/LifeAdvertiseDetail'
import Findpwd from '@/components/Findpwd'
import ShowImage from '@/components/ShowImage'
import Userterm from '@/components/Userterm'
import Report from '@/components/Report'


Vue.use(Router)

export default new Router({
  routes: [
      {
          path: '/',
          name: 'Restaurant',
          component: Restaurant,
          meta: {
              keepAlive: true,
              isShowBottomBar: true,
              exclude: HeaderHome
          }
      },
      {
          path: '/Event',
          name: 'Event',
          component: Event,
          meta: {
              keepAlive: true,
              isShowBottomBar: true
          }
      },
      {
          path: '/EventDetail',
          name: 'EventDetail',
          component: EventDetail,
          meta: {
              keepAlive: false,
              isShowBottomBar: false
          }
      },
      {
          path: '/Living',
          name: 'Living',
          component: Living,
          meta: {
              keepAlive: true,
              isShowBottomBar: true
          }
      },
      {
          path: '/Circle',
          name: 'Circle',
          component: Circle,
          meta: {
              keepAlive: true,
              isShowBottomBar: true
          }
      },
      {
          path: '/CircleDetail',
          name: 'CircleDetail',
          component: CircleDetail,
          meta: {
              keepAlive: false,
              isShowBottomBar: false
          }
      },
	  {
		  path: '/CircleComment',
		  name: 'CircleComment',
          component: CircleComment,
           meta: {
               keepAlive: false,
               isShowBottomBar: false
          }
	  },
      {
          path: '/Myinfo',
          name: 'Myinfo',
          component: Myinfo,
          meta: {
              keepAlive: false,
              isShowBottomBar: true
          }
      },
      {
          path: '/Search',
          name: 'Search',
          component: Search,
          meta: {
              keepAlive: true,
              isShowBottomBar: true
          }
      },
      {
          path: '/AdvertiseDetail',
          name: 'AdvertiseDetail',
          component: AdvertiseDetail,
          meta: {
              keepAlive: false,
              isShowBottomBar: false
          }
      },
      {
          path: '/ShopDetail',
          name: 'ShopDetail',
          component: ShopDetail,
          meta: {
              keepAlive: false,
              isShowBottomBar: false
          }
      },
      {
          path: '/Settings',
          name: 'Settings',
          component: Settings,
          meta: {
              keepAlive: false,
              isShowBottomBar: true
          }
      },
      {
          path: '/MyCircle',
          name: 'MyCircle',
          component: MyCircle,
          meta: {
              keepAlive: false,
              isShowBottomBar: true
          }
      },
      {
          path: '/MyCircleEdit',
          name: 'MyCircleEdit',
          component: MyCircleEdit,
          meta: {
              keepAlive: false,
              isShowBottomBar: false
          }
      },
      {
          path: '/Register',
          name: 'Register',
          component: Register,
          meta: {
              keepAlive: false,
              isShowBottomBar: false
          }
      },
      {
        path: '/Findpwd',
        name: 'Findpwd',
        component: Findpwd,
        meta: {
            keepAlive: false,              
            isShowBottomBar: false
      }
      },
      {
          path: '/Login',
          name: 'Login',
          component: Login,
          meta: {
              keepAlive: false,
              isShowBottomBar: false
          }
      },
      {
          path: '/HeaderHome',
          name: 'HeaderHome',
          component: HeaderHome,
          meta: {
              keepAlive: false,              
              isShowBottomBar: false
          }
      },
      {
          path: '/LifeAdvertiseDetail',
          name: 'LifeAdvertiseDetail',
          component: LifeAdvertiseDetail,
          meta: {
              keepAlive: false,              
              isShowBottomBar: false
          }
      },
      {
          path: '/ShowImage',
          name: 'ShowImage',
          component: ShowImage,
          meta: {
              keepAlive: false,              
              isShowBottomBar: false
          }
      },

      {
          path: '/Userterm',
          name: 'Userterm',
          component: Userterm,
          meta: {
              keepAlive: true,              
              isShowBottomBar: false
          }
      },    
      {
          path: '/Report',
          name: 'Report',
          component: Report,
          meta: {
              keepAlive: false,              
              isShowBottomBar: false
          }
      },   

          
    ]
  })
