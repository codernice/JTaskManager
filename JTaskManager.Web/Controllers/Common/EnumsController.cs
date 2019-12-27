using JTaskManager.Service.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JTaskManager.Web.Controllers.Common
{
    public class EnumsController : Controller
    {
        /// <summary>
        /// 获取枚举列表
        /// </summary>
        /// <param name="enumString"></param>
        /// <returns></returns>
        public JsonResult GetEnumList(string enumString)
        {
            var res = EnumExtensions.GetEnumList(enumString);
            return Json(res);
        }
    }
}