import filterResult from '../src/views/filterResult.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);

filterResult.el = '#root';
export default new Vue(filterResult);
