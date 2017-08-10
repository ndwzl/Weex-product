/**
 * Created by zhouhepeng on 2017/6/2.
 */
import modelConfig from '../src/views/modelConfig.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);
modelConfig.el = '#root'
export default new Vue(modelConfig);