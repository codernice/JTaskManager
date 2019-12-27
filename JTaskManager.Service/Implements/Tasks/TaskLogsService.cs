using JTaskManager.Common;
using JTaskManager.Core.Model;
using JTaskManager.Service.DtoModel;
using JTaskManager.Service.Extensions;
using JTaskManager.Service.Interfaces;
using SqlSugar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JTaskManager.Service.Implements
{
    public class TaskLogsService : BaseService<TaskLogs>, ITaskLogsService
    {
        /// <summary>
        /// 获取日志分页
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public ApiResult<Page<TaskLogs>> GetPageTaskLogs(TaskLogsFilter filter)
        {
            var res = new ApiResult<Page<TaskLogs>>() { statusCode = (int)ApiEnum.Error };
            try
            {
                var query = Db.Queryable<TaskLogs, Tasks>((a, b) => new
                            JoinQueryInfos(JoinType.Inner, a.TaskID == b.TaskID))
                .WhereIF(!string.IsNullOrEmpty(filter.TaskID), (a, b) => a.TaskID.ToString() == filter.TaskID)
                .WhereIF(!string.IsNullOrEmpty(filter.TaskName), (a, b) => b.TaskName == filter.TaskName)
                .WhereIF(filter.Type.HasValue, (a, b) => a.Type == filter.Type)
                .WhereIF(filter.BeginDate.HasValue, (a, b) => a.CreateTime >= filter.BeginDate.Value)
                .WhereIF(filter.EndDate.HasValue, (a, b) => a.CreateTime < filter.EndDate.Value.AddDays(1))
                .OrderBy((a, b) => a.CreateTime, OrderByType.Desc)
                .Select((a, b) => new TaskLogs
                {
                    Id = a.Id,
                    TaskID = a.TaskID,
                    TaskName = b.TaskName,
                    Description = a.Description,
                    Remark = a.Remark,
                    Type = a.Type,
                    CreateTime = a.CreateTime,
                });
                res.data = query.ToPage(filter.page, filter.limit);
                res.statusCode = (int)ApiEnum.Status;
            }
            catch (System.Exception ex)
            {
                res.message = ex.Message;
            }
            return res;
        }
    }
}