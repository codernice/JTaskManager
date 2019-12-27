<script>
    require('app/vue/vue-extend');

    window.eventHub = new Vue();

    var mixin = {
        beforeRouteEnter(to, from, next) {
            next(vm => {
                eventHub.$emit('child_created', vm);
            });
        },
    }
    Vue.mixin({
        data: function() {
            return {
                
            };
        },
        methods: {
            bindKeyboard: function(key, handler, isExclude) {
                if(this.eAdmin && typeof isExclude == 'undefined') {
                    return;
                }

                var vm = this;
                require.async('keyboardJs/keyboard.min', function(KeyboardJS) {
                    vm.KeyboardJS = KeyboardJS;
                    KeyboardJS.bind(key, handler);
                });
            },
            unbindKeyboard: function(key, handler) {
                this.KeyboardJS && this.KeyboardJS.unbind(key, handler);
            },
        },
        mounted: function () {
            
        }
    });

    Vue.prototype.$destroyWithEl = function() {
        this.$destroy();
        $(this.$el).remove();
    };

    var App = {
        data: function() {
            return {
                pageTitle: '工作台',
                menus: [
                    {"URL":"/workbench","PageTitle":"工作台"},
                    {"URL":"/tasks","PageTitle":"任务管理"},
                    {"URL":"/logs","PageTitle":"日志分析"},
                ],
            };
        },
        created() {
            let vm = this;
            eventHub.$on('child_created', function(childVm) {
                var path = vm.$route.path;
                // path去掉query参数
                if(vm.$route.query) {
                    var q = vm.$route.query;
                    var str = [];
                    for(var k in q) {
                        str.push(k + '=' + q[k]);
                    }
                    str = str.join('&');
                    path = path.replace(str, '').replace('?', '');
                }
                var d = vm.menus.filter(function(it) {
                    return it.URL == path;
                });

                vm.pageTitle = d.length ? d[0].PageTitle : (childVm.pageTitle || '');
            });
        },
    }

    var router = new VueRouter({
        routes: [
            {
                path: '/workbench',
                component: function (resolve) {
                    require.async('app/workbench/index', function (config) {
                        config = $.extend(config, mixin);
                        resolve(config);
                    });
                }
            },
            {
                path: '/tasks',
                component: function (resolve) {
                    require.async('app/tasks/index', function (config) {
                        config = $.extend(config, mixin);
                        resolve(config);
                    });
                }
            },
            {
                path: '/logs',
                component: function (resolve) {
                    require.async('app/logs/index', function (config) {
                        config = $.extend(config, mixin);
                        resolve(config);
                    });
                }
            }
        ]
    });

    //引入分页组件
    require('./components/pager');

    App.router = router;
    new Vue(App).$mount('#app');

    if(location.hash == '#/') {
        router.push('/workbench');
    }

    module.exports = {};
</script>