/**
 * Created by zhouhepeng on 2017/6/1.
 */
import addProduct from '../src/views/addProduct.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);

addProduct.el = '#root';
export default new Vue(addProduct);
