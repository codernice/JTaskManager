using JTaskManager.Common;
using JTaskManager.Core.Model;
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
    public class TasksController : Controller
    {
        static ITasksService tasksService = new TasksService();

        /// <summary>
        /// 获取任务分页
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public JsonResult GetTasksPage(TasksFilter filter)
        {
            var res = tasksService.GetPageTasks(filter);
            return Json(res.data);
        }

        /// <summary>
        /// 添加任务
        /// </summary>
        /// <param name="task"></param>
        /// <returns></returns>
        public JsonResult SaveTask(Tasks task)
        {
            var result = tasksService.SaveTask(task);
            return Json(result);
        }

        /// <summary>
        /// 启动暂停
        /// </summary>
        /// <param name="task"></param>
        /// <returns></returns>
        public JsonResult ChangeStatus(Tasks task)
        {
            var result = tasksService.ChangeStatus(task);
            return Json(result);
        }

        /// <summary>
        /// 删除任务
        /// </summary>
        /// <param name="task"></param>
        /// <returns></returns>
        public JsonResult RemoveTask(Tasks task)
        {
            var result = tasksService.DeleteAsync(task.TaskID.ToString());
            return Json(result.Result);
        }

        /// <summary>
        /// 获取可用任务列表
        /// </summary>
        /// <returns></returns>
        public JsonResult GetTaskList()
        {
            var result = tasksService.GetListAsync(q => q.IsDelete == 0 , q => q.CreatedTime, DbOrderEnum.Asc);
            return Json(result.Result.data);
        }
    }
}