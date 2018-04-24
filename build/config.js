/**
 * Created by zhouhepeng on 2017/5/25.
 */
import Config from '../src/views/config.vue'
import mixins from '../src/mixins'
import weexShare from '../src/components/weexShare.js'

Vue.use(weexShare)
Vue.mixin(mixins);
Config.el = '#root'
export default new Vue(Config);