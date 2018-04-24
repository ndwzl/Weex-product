import hotCharts from '../src/views/hotCharts.vue'
import mixins from '../src/mixins'
// import weexShare from '../src/components/weexShare.js'

// Vue.use(weexShare)
Vue.mixin(mixins);
hotCharts.el = '#root'
export default new Vue(hotCharts);
