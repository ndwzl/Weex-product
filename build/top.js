import top from '../src/views/top.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);

top.el = '#root';
export default new Vue(top);
