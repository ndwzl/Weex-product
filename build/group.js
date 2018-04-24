import group from '../src/views/group.vue'
import mixins from '../src/mixins'
// import weexShare from '../src/components/weexShare.js'

// Vue.use(weexShare)
Vue.mixin(mixins);
group.el = '#root'
export default new Vue(group);
