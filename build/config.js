/**
 * Created by zhouhepeng on 2017/5/25.
 */
import Config from '../src/views/config.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);
Config.el = '#root'
export default new Vue(Config);