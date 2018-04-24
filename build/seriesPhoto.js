/**
 * Created by zhouhepeng on 2017/5/10.
 */
import seriesPhoto from '../src/views/seriesPhoto.vue'
import mixins from '../src/mixins'
import weexShare from '../src/components/weexShare.js'

Vue.use(weexShare)
Vue.mixin(mixins)
seriesPhoto.el = '#root'
export default new Vue(seriesPhoto)
