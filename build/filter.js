import filter from '../src/views/filter.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);

filter.el = '#root';
export default new Vue(filter);