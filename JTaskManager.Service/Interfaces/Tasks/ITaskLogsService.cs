using JTaskManager.Common;
using JTaskManager.Core.Model;
using JTaskManager.Service.DtoModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JTaskManager.Service.Interfaces
{
    public interface ITaskLogsService : IBaseService<TaskLogs>
    {
        /// <summary>
        /// 获取日志分页
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        ApiResult<Page<TaskLogs>> GetPageTaskLogs(TaskLogsFilter filter);
    }
}
