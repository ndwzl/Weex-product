/**
 * Created by zhouhepeng on 2017/5/10.
 */
import photoInfo from '../src/views/photoInfo.vue'
import mixins from '../src/mixins'
Vue.mixin(mixins)
photoInfo.el = '#root'
export default new Vue(photoInfo)
