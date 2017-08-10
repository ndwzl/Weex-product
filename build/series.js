/*** Created by zhouhepeng on 2017/5/4.*/
import Series from '../src/views/series.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);
Series.el = '#root'
export default new Vue(Series);
