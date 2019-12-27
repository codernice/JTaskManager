using JTaskManager.Common;
using JTaskManager.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JTaskManager.Service.DtoModel
{
    public class TaskLogsFilter : PageParm
    {
        public string TaskID { get; set; }
        public string TaskName { get; set; }
        public TaskLogsType? Type { get; set; }
        public DateTime? BeginDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
