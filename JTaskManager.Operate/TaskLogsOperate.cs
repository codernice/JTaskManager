using JTaskManager.Common;
using JTaskManager.Core;
using JTaskManager.Core.Model;
using JTaskManager.Service.Implements;
using JTaskManager.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JTaskManager.Operate
{
    public static class TaskLogsOperate
    {
        static ITaskLogsService taskLogs = new TaskLogsService();

        private static Task<ApiResult<string>> WriteTaskLogs(string taskID, string msg, TaskLogsType type, string remarks = null)
        {
            TaskLogs logs = new TaskLogs
            {
                TaskID = new Guid(taskID),
                Description = msg,
                Remark = remarks,
                CreateTime = DateTime.Now,
                Type = type,
            };
            var result = taskLogs.AddAsync(logs);
            return result;
        }

        public static Task<ApiResult<string>> WriteTaskLogsInfo(string taskID, string msg, string remarks = null)
        {
            return WriteTaskLogs(taskID, msg, TaskLogsType.info, remarks);
        }
        public static Task<ApiResult<string>> WriteTaskLogsError(string taskID, string msg, string remarks = null)
        {
            return WriteTaskLogs(taskID, msg, TaskLogsType.error, remarks);
        }
        public static Task<ApiResult<string>> WriteTaskLogsDebug(string taskID, string msg, string remarks = null)
        {
            return WriteTaskLogs(taskID, msg, TaskLogsType.debug, remarks);
        }
    }
}
