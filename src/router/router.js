import Router from 'vue-router'
import Series from "../views/series.vue"
Vue.use(Router)

export default new Router({
    routes: [{
            path: '/series',
            component: Series
        },
    ]
})