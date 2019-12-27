using SqlSugar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JTaskManager.Core.Model
{
    public class TaskLogs
    {
        [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
        public int Id { get; set; }

        /// <summary>
        /// 任务ID
        /// </summary>
        public Guid TaskID { get; set; }

        [SugarColumn(IsIgnore = true)]
        public string TaskName { get; set; }

        [SugarColumn(IsNullable = true)]
        public string Remark { get; set; }
        [SugarColumn(Length = 2000)]
        public string Description { get; set; }
        public DateTime CreateTime { get; set; }
        public TaskLogsType Type { get; set; }

        [SugarColumn(IsIgnore = true)]
        public string TypeName
        {
            get 
            {
                return Enum.GetName(typeof(TaskLogsType), Type);    
            }
        }
    }
}
