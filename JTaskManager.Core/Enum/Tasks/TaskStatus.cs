using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JTaskManager.Core
{
    /// <summary>
    /// 任务状态枚举
    /// </summary>
    public enum TaskStatus
    {
        /// <summary>
        /// 运行状态
        /// </summary>
        RUN = 1,

        /// <summary>
        /// 停止状态
        /// </summary>
        STOP = 0
    }
}
