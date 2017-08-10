/**
 * Created by zhouhepeng on 2017/6/2.
 */
import modelDealer from '../src/views/modelDealer.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);
modelDealer.el = '#root'
export default new Vue(modelDealer);