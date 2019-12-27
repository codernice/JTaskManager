'use strict';

define(function (require, exports, module) {
    var cf = {
        data: function data() {
            return {
                statusList: []
            };
        },
        mounted: function mounted() {
            var _this = this;

            var vm = this;
            vm.$nextTick(function () {
                _this.show();
            });
        },
        created: function created() {
            this.getStatusList();
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
            show: function show() {
                var vm = this;
                $('#editTaskDialog').modal('show');
                $('#editTaskDialog').on('hidden.bs.modal', function () {
                    vm.unbindKeyboard('ctrl + enter', vm.ok);
                    vm.$destroyWithEl();
                });
                this.bindKeyboard('ctrl + enter', this.ok);
            },
            close: function close() {
                $('#editTaskDialog').modal('hide');
            },
            ok: function ok() {
                var vm = this;
                if (!vail()) return;
                var param = {
                    TaskID: vm.TaskID,
                    TaskName: vm.TaskName,
                    TaskParam: vm.TaskParam,
                    CronExpressionString: vm.CronExpressionString,
                    AssemblyName: vm.AssemblyName,
                    ClassName: vm.ClassName,
                    Status: vm.Status,
                    CronRemark: vm.CronRemark,
                    Remark: vm.Remark
                };
                Vue.Operate("/Tasks/SaveTask", param, function () {
                    vm.callback && vm.callback();
                    vm.close();
                });
            }
        }
    };

    cf.template = '<div class="modal fade" id="editTaskDialog" role="dialog" tabindex="-1"><div class="modal-dialog" style="max-width: 1000px"><div class="modal-content"><div class="modal-header"><h4>编辑</h4><button type="button" class="close" v-on:click="close"><span aria-hidden="true">×</span></button></div><div class="modal-body vail"><div class="form-horizontal"><div class="form-group row"><label class="col-sm-2 col-form-label require">任务名称</label><div class="col-sm-8"><input type="text" class="form-control" placeholder="任务名称" v-model="TaskName" vail="require"></div></div><div class="form-group row"><label class="col-sm-2 col-form-label">参数</label><div class="col-sm-8"><input type="text" class="form-control" placeholder="参数" v-model="TaskParam"></div></div><div class="form-group row"><label class="col-sm-2 col-form-label">说明</label><div class="col-sm-8"><input type="text" class="form-control" placeholder="说明" v-model="CronRemark"></div></div><div class="form-group row"><label class="col-sm-2 col-form-label require">程序集名称</label><div class="col-sm-8"><input type="text" class="form-control" placeholder="程序集名称" v-model="AssemblyName" vail="require"></div></div><div class="form-group row"><label class="col-sm-2 col-form-label require">类名(包含命名空间)</label><div class="col-sm-8"><input type="text" class="form-control" placeholder="类名(包含命名空间)" v-model="ClassName" vail="require"></div></div><div class="form-group row"><label class="col-sm-2 col-form-label require">Cron表达式</label><div class="col-sm-8"><input type="text" class="form-control" placeholder="Cron表达式" v-model="CronExpressionString" vail="require"></div></div><div class="form-group row"><label class="col-sm-2 col-form-label require">任务状态</label><div class="col-sm-8"><select class="form-control" v-model="Status" vail="require"><option v-for="it in statusList" v-bind:value="it.Value">{{it.Key}}</option></select></div></div></div></div><div class="modal-footer"><button type="button" class="btn btn-default" v-on:click="close">关闭</button> <button type="button" class="btn btn-primary" v-on:click="ok">确定(ctrl + enter)</button></div></div></div></div>';
    module.exports = cf;
});