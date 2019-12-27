'use strict';

define(function (require, exports, module) {
    require('app/vue/vue-extend');

    window.eventHub = new Vue();

    var mixin = {
        beforeRouteEnter: function beforeRouteEnter(to, from, next) {
            next(function (vm) {
                eventHub.$emit('child_created', vm);
            });
        }
    };
    Vue.mixin({
        data: function data() {
            return {};
        },
        methods: {
            bindKeyboard: function bindKeyboard(key, handler, isExclude) {
                if (this.eAdmin && typeof isExclude == 'undefined') {
                    return;
                }

                var vm = this;
                require.async('keyboardJs/keyboard.min', function (KeyboardJS) {
                    vm.KeyboardJS = KeyboardJS;
                    KeyboardJS.bind(key, handler);
                });
            },
            unbindKeyboard: function unbindKeyboard(key, handler) {
                this.KeyboardJS && this.KeyboardJS.unbind(key, handler);
            }
        },
        mounted: function mounted() {}
    });

    Vue.prototype.$destroyWithEl = function () {
        this.$destroy();
        $(this.$el).remove();
    };

    var App = {
        data: function data() {
            return {
                pageTitle: '工作台',
                menus: [{ "URL": "/workbench", "PageTitle": "工作台" }, { "URL": "/tasks", "PageTitle": "任务管理" }, { "URL": "/logs", "PageTitle": "日志分析" }]
            };
        },
        created: function created() {
            var vm = this;
            eventHub.$on('child_created', function (childVm) {
                var path = vm.$route.path;

                if (vm.$route.query) {
                    var q = vm.$route.query;
                    var str = [];
                    for (var k in q) {
                        str.push(k + '=' + q[k]);
                    }
                    str = str.join('&');
                    path = path.replace(str, '').replace('?', '');
                }
                var d = vm.menus.filter(function (it) {
                    return it.URL == path;
                });

                vm.pageTitle = d.length ? d[0].PageTitle : childVm.pageTitle || '';
            });
        }
    };

    var router = new VueRouter({
        routes: [{
            path: '/workbench',
            component: function component(resolve) {
                require.async('app/workbench/index', function (config) {
                    config = $.extend(config, mixin);
                    resolve(config);
                });
            }
        }, {
            path: '/tasks',
            component: function component(resolve) {
                require.async('app/tasks/index', function (config) {
                    config = $.extend(config, mixin);
                    resolve(config);
                });
            }
        }, {
            path: '/logs',
            component: function component(resolve) {
                require.async('app/logs/index', function (config) {
                    config = $.extend(config, mixin);
                    resolve(config);
                });
            }
        }]
    });

    require('./components/pager');

    App.router = router;
    new Vue(App).$mount('#app');

    if (location.hash == '#/') {
        router.push('/workbench');
    }

    var cf = {};

    module.exports = cf;
});