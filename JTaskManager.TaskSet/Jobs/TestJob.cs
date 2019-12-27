using JTaskManager.Common;
using JTaskManager.Operate;
using JTaskManager.Service.Implements;
using JTaskManager.Service.Interfaces;
using Quartz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JTaskManager.TaskSet
{
    [DisallowConcurrentExecution]
    public class TestJob : IJob
    {
        /// <summary>
        /// IJob 接口
        /// </summary>
        /// <param name="context"></param>
        public void Execute(IJobExecutionContext context)
        {
            var taskID = ((Quartz.Impl.Triggers.AbstractTrigger)context.Trigger).Name;
            try
            {
                Logger.Default.Info("测试任务");
                TaskLogsOperate.WriteTaskLogsInfo(taskID, "测试任务");
            }
            catch (Exception ex)
            {
                Logger.Default.Error(context.Trigger.Description, ex);
                TaskLogsOperate.WriteTaskLogsError(taskID, "测试任务");
            }
        }
    }
}
