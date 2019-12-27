using JTaskManager.Common;
using JTaskManager.Core.Model;
using JTaskManager.Service.DtoModel;
using JTaskManager.Service.Interfaces;
using JTaskManager.Service.Extensions;
using SqlSugar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JTaskManager.Service.Implements
{
    public class TasksService : BaseService<Tasks>, ITasksService
    {
        /// <summary>
        /// 获取任务分页
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public ApiResult<Page<Tasks>> GetPageTasks(TasksFilter filter)
        {
            var res = new ApiResult<Page<Tasks>>() { statusCode = (int)ApiEnum.Error };
            try
            {
                var query = Db.Queryable<Tasks>();
                if (!string.IsNullOrEmpty(filter.TaskName))
                {
                    query = query.Where(q => q.TaskName.Contains(filter.TaskName));
                }
                if (filter.TaskStatus.HasValue)
                {
                    query = query.Where(q => q.Status.Equals(filter.TaskStatus));
                }
                query = query.OrderBy(b => b.CreatedTime, OrderByType.Asc);
                res.data = query.ToPage(filter.page, filter.limit);
                res.statusCode = (int)ApiEnum.Status;
            }
            catch (System.Exception ex)
            {
                res.message = ex.Message;
            }
            return res;
        }

        /// <summary>
        /// 保存任务（添加或修改）
        /// </summary>
        /// <param name="task"></param>
        /// <returns></returns>
        public ApiResult<string> SaveTask(Tasks task)
        {
            var result = new ApiResult<string>();
            var currentTime = DateTime.Now;
            if (task.TaskID.ToString() == "00000000-0000-0000-0000-000000000000")
            {
                task.CreatedTime = currentTime;
                task.ModifyTime = currentTime;
                task.IsDelete = 0;
                var add = AddAsync(task);
                return add.Result;
            }
            else
            {
                Task<ApiResult<Tasks>> model = GetModelAsync(q => q.TaskID == task.TaskID);
                if (model.Result.success == false)
                {
                    result.success = false;
                    result.message = model.Result.message;
                    return result;
                }
                Tasks tasks = model.Result.data;
                tasks.ModifyTime = currentTime;
                tasks.TaskName = task.TaskName;
                tasks.TaskParam = task.TaskParam;
                tasks.AssemblyName = task.AssemblyName;
                tasks.ClassName = task.ClassName;
                tasks.CronExpressionString = task.CronExpressionString;
                tasks.Status = task.Status;
                tasks.CronRemark = task.CronRemark;
                tasks.Remark = task.Remark;
                var update = UpdateAsync(tasks);
                return update.Result;
            }
        }

        /// <summary>
        /// 启动暂停
        /// </summary>
        /// <param name="task"></param>
        /// <returns></returns>
        public ApiResult<string> ChangeStatus(Tasks task)
        {
            var result = new ApiResult<string>();
            var currentTime = DateTime.Now;
            if (task.TaskID == null)
            {
                result.success = false;
                result.message = "任务ID不存在";
                return result;
            }
            Task<ApiResult<Tasks>> model = GetModelAsync(q => q.TaskID == task.TaskID);
            if (model.Result.success == false)
            {
                result.success = false;
                result.message = model.Result.message;
                return result;
            }
            Tasks tasks = model.Result.data;
            tasks.Status = task.Status;
            var update = UpdateAsync(tasks);
            return update.Result;
        }
    }
}
