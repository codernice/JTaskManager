using JTaskManager.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JTaskManager.Service.DtoModel
{
    public class TasksFilter : PageParm
    {
        public string TaskName { get; set; }
        public TaskStatus? TaskStatus { get; set; }
    }
}
