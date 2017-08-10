/**
 * Created by zhouhepeng on 2017/6/1.
 */
import addSeries from '../src/views/addSeries.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);

addSeries.el = '#root';
export default new Vue(addSeries);
