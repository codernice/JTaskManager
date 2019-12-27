'use strict';

define(function (require, exports, module) {
    var cf = {
        data: function data() {
            return {
                list: [],
                tasks: [],
                typelist: [],
                filter: {
                    TaskID: '',
                    TaskName: '',
                    Type: '',
                    BeginDate: '',
                    EndDate: ''
                }
            };
        },
        mixins: [Vue.PagerMixin],
        mounted: function mounted() {
            var vm = this;
            vm.$nextTick(function () {
                var endDate = Vue.filter('toShortDate')(new Date());
                require.async(['plugins/datepicker/bootstrap-datepicker.cmd', 'plugins/datepicker/locales/bootstrap-datepicker.zh-CN'], function () {
                    $('#st').datepicker({
                        language: 'zh-CN',
                        format: 'yyyy-mm-dd',
                        endDate: endDate,
                        autoclose: true,
                        todayHighlight: true
                    }).on('changeDate', function (args) {
                        $('#et').datepicker('setStartDate', args.date);
                        vm.filter.BeginDate = $(args.target).val();
                    });
                    $('#et').datepicker({
                        language: 'zh-CN',
                        format: 'yyyy-mm-dd',
                        endDate: endDate,
                        autoclose: true,
                        todayHighlight: true
                    }).on('changeDate', function (args) {
                        $('#st').datepicker('setEndDate', args.date);
                        vm.filter.EndDate = $(args.target).val();
                    });
                });
            });
        },
        created: function created() {
            $(document).ready(function () {
                $('.js-example-placeholder-single').select2();
            });
            this.getTypeList();
            this.getTasks();
            this.getData();
        },
        methods: {
            getTypeList: function getTypeList() {
                var vm = this;
                Vue.Enum("TaskLogsType", function (data) {
                    if (data != null) {
                        vm.typelist = data;
                    }
                });
            },
            getTasks: function getTasks() {
                var vm = this;
                Vue.Search("/Tasks/GetTaskList", this.filter, function (data) {
                    vm.tasks = data;
                });
            },
            getData: function getData() {
                if ($("#taskID")[0] != null) {
                    this.filter.TaskID = $("#taskID").val();
                }
                var vm = this;
                this.filter.page = this.pageIndex;
                this.filter.limit = this.pageSize;

                Vue.Search("/TaskLogs/GetPageTaskLogs", this.filter, function (data) {
                    vm.list = data.Items;
                    vm.totalRecords = data.TotalItems;
                });
            }
        }
    };

    cf.template = '<section class="content"><div class="container-fluid"><div class="row"><div class="col-12"><div class="card"><div class="card-header"><h3 class="card-title"></h3><div class="card-tools"><div class="input-group input-group-sm"><label>任务名称</label><select class="js-example-placeholder-single js-states form-control" id="taskID" v-model="filter.TaskID" style="width:180px"><option value="">--全部--</option><option v-for="it in tasks" v-bind:value="it.TaskID">{{it.TaskName}}</option></select><label>日志类别</label><select class="form-control float-right" v-model="filter.Type"><option value="">--全部--</option><option v-for="it in typelist" v-bind:value="it.Value">{{it.Key}}</option></select><label>日期从：</label><input id="st" type="text" class="form-control" placeholder="开始日期" v-model="filter.BeginDate" autocomplete="off"><label>到</label><input id="et" type="text" class="form-control" placeholder="结束日期" v-model="filter.EndDate" autocomplete="off"><div class="input-group-append"><button type="button" class="btn btn-default" v-on:click="getData"><i class="fas fa-search"></i></button></div></div></div></div><div class="card-body table-responsive p-0"><table class="table table-hover"><thead><tr><th>任务名称</th><th>日志类别</th><th>日志</th><th>时间</th></tr></thead><tbody><tr v-for="it in list"><td>{{it.TaskName}}</td><td>{{it.TypeName}}</td><td>{{it.Description}}</td><td>{{it.CreateTime | date}}</td></tr></tbody></table></div><pager :page-index="pageIndex" :page-size="pageSize" :total-records="totalRecords" @page_changed="pageChanged"></pager></div></div></div></div></section>';
    module.exports = cf;
});