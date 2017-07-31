// import Vue from 'vue'
import Vuex from 'vuex'

// Vuex is auto installed on the web
if (WXEnvironment.platform !== 'Web') {
  Vue.use(Vuex)
}

const store = new Vuex.Store({
  state: {
    selectid: 0,

    tabbar: 1,

      //认证头
    attestation:1, // 1：认证 2：修改资料

    hotTab: {
        top: 0,
        DATA:[
          {id: 20},
          {id: 21},
          {id: 22}
        ]
    },

    newTab: {
        top: 0,
        DATA:[
          
        ]
    }
    
  }
})

export default store
