using System;
using System.Collections.Generic;
using System.Text;

namespace JTaskManager.Common
{
    public enum DbOrderEnum
    {
        /// <summary>
        /// 打折
        /// </summary>
        [Text("排序Asc")]
        Asc = 1,

        /// <summary>
        /// 满减
        /// </summary>
        [Text("排序Desc")]
        Desc = 2
    }
}
