import seriesPage from '../src/views/seriesPage.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);

seriesPage.el = '#root';
export default new Vue(seriesPage);
