'use strict';

define(function (require, exports, module) {
    var cf = {
        data: function data() {
            return {
                list: [],
                statusList: [],
                filter: {
                    TaskName: '',
                    TaskStatus: ''
                }
            };
        },
        mixins: [Vue.PagerMixin],
        created: function created() {
            this.getStatusList();
            this.getData();
        },
        methods: {
            getStatusList: function getStatusList() {
                var vm = this;
                Vue.Enum("TaskStatus", function (data) {
                    if (data != null) {
                        vm.statusList = data;
                    }
                });
            },
            getData: function getData() {
                var vm = this;
                this.filter.page = this.pageIndex;
                this.filter.limit = this.pageSize;

                Vue.Search("/Tasks/GetTasksPage", this.filter, function (data) {
                    vm.list = data.Items;
                    vm.totalRecords = data.TotalItems;
                });
            },
            add: function add() {
                var vm = this;
                var obj = {
                    TaskID: '',
                    TaskName: '',
                    TaskParam: '',
                    CronRemark: '',
                    AssemblyName: '',
                    ClassName: '',
                    CronExpressionString: '',
                    Status: 1
                };
                Vue.Dialog('app/tasks/editTaskDialog', {
                    data: function data() {
                        return obj;
                    },
                    methods: {
                        callback: function callback() {
                            vm.getData();
                        }
                    }
                });
            },
            edit: function edit(it) {
                var vm = this;
                Vue.Dialog('app/tasks/editTaskDialog', {
                    data: function data() {
                        return it;
                    },
                    methods: {
                        callback: function callback() {
                            vm.getData();
                        }
                    }
                });
            },
            del: function del(it) {
                var vm = this;
                Vue.Delete("/Tasks/RemoveTask", { TaskID: it.TaskID }, function () {
                    vm.getData();
                }, "确认删除该任务：" + it.TaskName + "？");
            },
            stop: function stop(it) {
                var vm = this;
                Vue.Operate("/Tasks/ChangeStatus", { TaskID: it.TaskID, Status: 0 }, function () {
                    vm.getData();
                });
            },
            run: function run(it) {
                var vm = this;
                Vue.Operate("/Tasks/ChangeStatus", { TaskID: it.TaskID, Status: 1 }, function () {
                    vm.getData();
                });
            }
        }
    };

    cf.template = '<section class="content"><div class="container-fluid"><div class="row"><div class="col-12"><div class="card"><div class="card-header"><h3 class="card-title"><a href="javascript:void(0);" class="btn btn-primary" @click="add()">新增</a></h3><div class="card-tools"><div class="input-group input-group-sm"><label>任务名称</label><input type="text" name="table_search" class="form-control float-right" placeholder="任务名称" v-model="filter.TaskName"><label>状态</label><select class="form-control float-right" v-model="filter.TaskStatus"><option value="">--全部--</option><option v-for="it in statusList" v-bind:value="it.Value">{{it.Key}}</option></select><div class="input-group-append"><button type="button" class="btn btn-default" v-on:click="getData"><i class="fas fa-search"></i></button></div></div></div></div><div class="card-body table-responsive p-0"><table class="table table-hover"><thead><tr><th>任务名称</th><th>状态</th><th>说明</th><th>本次运行时间</th><th>本次结束时间</th><th>下次开始时间</th><th>创建时间</th><th>操作</th></tr></thead><tbody><tr v-for="it in list"><td>{{it.TaskName}}</td><td>{{it.StatusName}}</td><td>{{it.CronRemark}}</td><td>{{it.RecentRunTime | date}}</td><td>{{it.RecentFinishTime | date}}</td><td>{{it.NextFireTime | date}}</td><td>{{it.CreatedTime | date}}</td><td><a href="javascript:void(0);" v-if="it.TaskName != \'动态读取任务列表\'" class="btn btn-sm btn-primary" @click="edit(it)">编辑</a> <a href="javascript:void(0);" v-if="it.TaskName != \'动态读取任务列表\'" class="btn btn-sm btn-danger" @click="del(it)">删除</a> <a href="javascript:void(0);" v-if="it.TaskName != \'动态读取任务列表\' && it.Status == 1" class="btn btn-sm btn-secondary" @click="stop(it)">暂停</a> <a href="javascript:void(0);" v-if="it.TaskName != \'动态读取任务列表\' && it.Status == 0" class="btn btn-sm btn-success" @click="run(it)">启动</a></td></tr></tbody></table></div><pager :page-index="pageIndex" :page-size="pageSize" :total-records="totalRecords" @page_changed="pageChanged"></pager></div></div></div></div></section>';
    module.exports = cf;
});