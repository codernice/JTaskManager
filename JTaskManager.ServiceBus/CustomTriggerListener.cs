using JTaskManager.Common;
using JTaskManager.Operate;
using Quartz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JTaskManager.ServiceBus
{
    public class CustomTriggerListener : ITriggerListener
    {
        public string Name
        {
            get
            {
                return "All_TriggerListener";
            }
        }

        /// <summary>
        /// Job执行时调用
        /// </summary>
        /// <param name="trigger">触发器</param>
        /// <param name="context">上下文</param>
        public void TriggerFired(ITrigger trigger, IJobExecutionContext context)
        {
        }

        /// <summary>
        ///  //Trigger触发后，job执行时调用本方法。true即否决，job后面不执行。
        /// </summary>
        /// <param name="trigger"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public bool VetoJobExecution(ITrigger trigger, IJobExecutionContext context)
        {
            //TaskHelper.UpdateRecentRunTime(trigger.JobKey.Name, TimeZoneInfo.ConvertTimeFromUtc(context.FireTimeUtc.Value.DateTime, TimeZoneInfo.Local));
            var taskID = ((Quartz.Impl.Triggers.AbstractTrigger)trigger).Name;
            try
            {
                DateTimeOffset? fireTimeUtc = ((Quartz.Impl.JobExecutionContextImpl)context).FireTimeUtc;
                DateTimeOffset? nextFireTimeUtc = ((Quartz.Impl.JobExecutionContextImpl)context).NextFireTimeUtc;
                if (!fireTimeUtc.HasValue || !nextFireTimeUtc.HasValue) return false;
                var fireTime = fireTimeUtc.Value.LocalDateTime;
                var nextFireTime = nextFireTimeUtc.Value.LocalDateTime;
                TasksOperate.UpdateTime(taskID, fireTime, nextFireTime);
                TaskLogsOperate.WriteTaskLogsInfo(taskID, string.Format("任务【{0}】准备执行", trigger.Description));
            }
            catch (Exception ex)
            {
                Logger.Default.Error(string.Format("任务【{0}】触发后更新时间异常：{1}", trigger.Description, ex.Message));
            }
            return false;
        }

        /// <summary>
        /// Job完成时调用
        /// </summary>
        /// <param name="trigger">触发器</param>
        /// <param name="context">上下文</param>
        /// <param name="triggerInstructionCode"></param>
        public void TriggerComplete(ITrigger trigger, IJobExecutionContext context, SchedulerInstruction triggerInstructionCode)
        {
            //TaskHelper.UpdateNextFireTime(trigger.JobKey.Name, TimeZoneInfo.ConvertTimeFromUtc(context.NextFireTimeUtc.Value.DateTime, TimeZoneInfo.Local));
            var taskID = ((Quartz.Impl.Triggers.AbstractTrigger)trigger).Name;
            try
            {
                TasksOperate.UpdateTime(taskID, null, null, true);
                TaskLogsOperate.WriteTaskLogsInfo(taskID, string.Format("任务【{0}】执行完毕", trigger.Description));
            }
            catch (Exception ex)
            {
                Logger.Default.Error(string.Format("任务【{0}】完成时更新时间异常：{1}", trigger.Description, ex.Message));
            }
        }

        /// <summary>
        /// 错过触发时调用
        /// </summary>
        /// <param name="trigger">触发器</param>
        public void TriggerMisfired(ITrigger trigger)
        {
            var taskID = ((Quartz.Impl.Triggers.AbstractTrigger)trigger).Name;
            try
            {
                TaskLogsOperate.WriteTaskLogsError(taskID, string.Format("任务【{0}】错过触发", trigger.Description));
            }
            catch
            {
                Logger.Default.Error(string.Format("任务【{0}】错过触发", trigger.Description));
            }
        }
    }
}
