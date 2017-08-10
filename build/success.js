/**
 * Created by zhouhepeng on 2017/5/10.
 */
import success from '../src/views/success.vue'
import mixins from '../src/mixins'
Vue.mixin(mixins)
success.el = '#root'
export default new Vue(success)
