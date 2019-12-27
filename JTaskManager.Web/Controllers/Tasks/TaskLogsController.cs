using JTaskManager.Service.DtoModel;
using JTaskManager.Service.Implements;
using JTaskManager.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JTaskManager.Web.Controllers
{
    public class TaskLogsController : Controller
    {
        static ITaskLogsService taskLogsService = new TaskLogsService();

        /// <summary>
        /// 获取日志分页
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public JsonResult GetPageTaskLogs(TaskLogsFilter filter)
        {
            var res = taskLogsService.GetPageTaskLogs(filter);
            return Json(res.data);
        }
    }
}