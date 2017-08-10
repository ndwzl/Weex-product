/**
 * Created by zhouhepeng on 2017/6/2.
 */
import personalInfo from '../src/views/personalInfo.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);
personalInfo.el = '#root'
export default new Vue(personalInfo);