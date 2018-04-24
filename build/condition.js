import condition from '../src/views/condition.vue'
import mixins from '../src/mixins'
// import weexShare from '../src/components/weexShare.js'

// Vue.use(weexShare)
Vue.mixin(mixins);
condition.el = '#root'
export default new Vue(condition);