/**
 * Created by zhouhepeng on 2017/6/2.
 */
import footerPrice from '../src/views/footerPrice.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);
footerPrice.el = '#root'
export default new Vue(footerPrice);