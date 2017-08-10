/**
 * Created by zhouhepeng on 2017/5/25.
 */
import contrast from '../src/views/contrast.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);
contrast.el = '#root'
export default new Vue(contrast);