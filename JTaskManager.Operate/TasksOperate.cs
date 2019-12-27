using JTaskManager.Common;
using JTaskManager.Core.Model;
using JTaskManager.Service.DtoModel;
using JTaskManager.Service.Implements;
using JTaskManager.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace JTaskManager.Operate
{
    public static class TasksOperate
    {
        static ITasksService tasksService = new TasksService();

        /// <summary>
        /// 更新运行时间
        /// </summary>
        /// <param name="taskID"></param>
        /// <param name="nextFireTime"></param>
        public static void UpdateTime(string taskID, DateTime? runTime = null, DateTime? nextFireTime = null, bool isFinish = false)
        {
            var currentTime = DateTime.Now;
            Task<ApiResult<Tasks>> result = tasksService.GetModelAsync(q => q.TaskID == new Guid(taskID));
            if (result == null) return;
            Tasks tasks = result.Result.data;
            tasks.ModifyTime = currentTime;
            if (!isFinish)
            {
                tasks.RecentRunTime = runTime;
                tasks.NextFireTime = nextFireTime;
            }
            else
            {
                tasks.RecentFinishTime = currentTime;
            }
            tasksService.UpdateAsync(tasks);
        }

        /// <summary>
        /// 获取全部任务
        /// </summary>
        /// <returns></returns>
        public static List<Tasks> GetAllTaskList()
        {
            var result = tasksService.GetListAsync(q => q.IsDelete == 0 && q.Status ==  Core.TaskStatus.RUN, q => q.CreatedTime, DbOrderEnum.Asc);
            if (result.Result == null) return new List<Tasks>();
            return result.Result.data;
        }
    }
}
