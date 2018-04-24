import brand from '../src/views/brand.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);

brand.el = '#root';
export default new Vue(brand);
