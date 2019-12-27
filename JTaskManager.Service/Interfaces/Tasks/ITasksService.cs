using JTaskManager.Common;
using JTaskManager.Core.Model;
using JTaskManager.Service.DtoModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace JTaskManager.Service.Interfaces
{
    public interface ITasksService : IBaseService<Tasks>
    {
        /// <summary>
        /// 获取任务分页
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        ApiResult<Page<Tasks>> GetPageTasks(TasksFilter filter);

        /// <summary>
        /// 保存任务（添加或修改）
        /// </summary>
        /// <param name="task"></param>
        /// <returns></returns>
        ApiResult<string> SaveTask(Tasks task);

        /// <summary>
        /// 启动暂停
        /// </summary>
        /// <param name="task"></param>
        /// <returns></returns>
        ApiResult<string> ChangeStatus(Tasks task);
    }
}
