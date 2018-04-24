/**
 * Created by zhouhepeng on 2017/5/10.
 */
import photoInfo from '../src/views/photoInfo.vue'
import mixins from '../src/mixins'
import weexShare from '../src/components/weexShare.js'

Vue.use(weexShare)
Vue.mixin(mixins)
photoInfo.el = '#root'
export default new Vue(photoInfo)
