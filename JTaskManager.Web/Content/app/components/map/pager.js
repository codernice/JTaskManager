'use strict';

define(function (require, exports, module) {
    var cf = {
        props: {
            cls: {
                type: String,
                default: ''
            },
            PageIndex: {
                type: Number,
                twoWay: true
            },
            PageSize: Number,
            TotalRecords: Number
        },
        data: function data() {
            return {
                ToIndex: ''
            };
        },
        computed: {
            PageCount: function PageCount() {
                if (this.PageSize) {
                    var total = parseInt(this.TotalRecords, 10);
                    if (isNaN(total) || !total) {
                        return 1;
                    }
                    return Math.ceil(total / this.PageSize);
                }
                return 1;
            }
        },
        methods: {
            prev: function prev() {
                if (this.PageIndex - 1 > 0) {
                    this.$emit('page_changed', 'prev');
                }
            },
            next: function next() {
                if (this.PageIndex + 1 <= this.PageCount) {
                    this.$emit('page_changed', 'next');
                }
            },
            first: function first() {
                this.$emit('page_changed', 'first');
            },
            last: function last() {
                this.$emit('page_changed', 'last', this.PageCount);
            },
            go: function go() {
                var to = parseInt(this.ToIndex, 10);
                if (isNaN(to)) {
                    return;
                }

                if (to >= 1 && to <= this.PageCount) {
                    this.$emit('page_changed', 'go', to);
                }
            },
            fresh: function fresh() {
                this.$emit('page_changed', 'fresh');
            }
        }
    };

    Vue.PagerMixin = function () {
        return {
            data: function data() {
                return {
                    pageIndex: 1,
                    pageSize: 20,
                    totalRecords: 0
                };
            },
            methods: {
                goToPage: function goToPage() {},
                getData: function getData() {},
                refresh: function refresh() {
                    if (this.pageIndex != 1) {
                        this.pageIndex = 1;
                    } else {
                        this.getData();
                    }
                },
                pageChanged: function pageChanged(action, pageIndex) {
                    switch (action) {
                        case 'first':
                            this.pageIndex = 1;
                            break;
                        case 'prev':
                            this.pageIndex--;
                            break;
                        case 'next':
                            this.pageIndex++;
                            break;
                        case 'last':
                        case 'go':
                            this.pageIndex = pageIndex;
                            break;
                        case 'fresh':
                            this.getData();
                            break;
                    }
                }
            },
            watch: {
                pageIndex: function pageIndex() {
                    this.getData();
                }
            }
        };
    }();

    Vue.PagerMixinFn = function () {
        return {
            data: function data() {
                return {
                    pageIndex: 1,
                    pageSize: 10,
                    totalRecords: 0
                };
            },
            methods: {
                goToPage: function goToPage() {},
                getData: function getData() {},
                refresh: function refresh() {
                    if (this.pageIndex != 1) {
                        this.pageIndex = 1;
                    } else {
                        this.getData();
                    }
                },
                pageChanged: function pageChanged(action, pageIndex) {
                    switch (action) {
                        case 'first':
                            this.pageIndex = 1;
                            break;
                        case 'prev':
                            this.pageIndex--;
                            break;
                        case 'next':
                            this.pageIndex++;
                            break;
                        case 'last':
                        case 'go':
                            this.pageIndex = pageIndex;
                            break;
                        case 'fresh':
                            this.getData();
                            break;
                    }
                }
            },
            watch: {
                pageIndex: function pageIndex() {
                    this.getData();
                }
            }
        };
    };

    cf.template = '<div class="card-footer clearfix"><ul class="pagination pagination-sm m-0 float-right"><li><a style="cursor:default">共{{TotalRecords}}条</a></li><li class="first"><a aria-label="Previous" :disabled="PageIndex == 1" v-on:click="first" title="首页">首页</a></li><li class="prev"><a aria-label="Previous" :disabled="PageIndex == 1" v-on:click="prev" title="上一页">上一页</a></li><li class="txt-pageindex"><a style="cursor:default">{{PageIndex}}<span>/{{PageCount}}</span></a></li><li class="next-normal"><a aria-label="Next" :disabled="PageIndex == PageCount" v-on:click="next" title="下一页">下一页</a></li><li class="last"><a aria-label="Next" :disabled="PageIndex == PageCount" v-on:click="last" title="末页">末页</a></li><li class="pager-ipt"><input type="text" placeholder="页码" style="width: 80px" class="form-control" v-model="ToIndex" v-on:keyup.enter="go"></li><li class="pager-go"><button class="btn btn-default" v-on:click="go">GO</button></li><li class="fresh"><button class="btn btn-default" v-on:click="fresh">刷新</button></li></ul></div>';
    Vue.appendStyle('input,button{margin-left:10px;vertical-align:top}.pagination>li>a,.pagination>li>span{position:relative;float:left;padding:6px 12px;margin-left:-1px;line-height:1.42857143;color:#337ab7;text-decoration:none;background-color:#fff;border:1px solid #ddd;cursor:pointer}', 'components_vue_pager.vue');
    module.exports = cf;
    Vue.component('pager', module.exports);
});