import BrandList from '../src/views/brandList.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);

BrandList.el = '#root';
export default new Vue(BrandList);
