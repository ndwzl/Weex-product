/**
 * Created by zhouhepeng on 2017/6/2.
 */
import modelConfig from '../src/views/modelConfig.vue'
import mixins from '../src/mixins'
import weexShare from '../src/components/weexShare.js'

Vue.use(weexShare)
Vue.mixin(mixins);
modelConfig.el = '#root'
export default new Vue(modelConfig);