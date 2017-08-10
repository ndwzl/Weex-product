/**
 * Created by zhouhepeng on 2017/5/10.
 */
import modelPhoto from '../src/views/modelPhoto.vue'
import mixins from '../src/mixins'
Vue.mixin(mixins)
modelPhoto.el = '#root'
export default new Vue(modelPhoto)
