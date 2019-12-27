using JTaskManager.Service.DtoModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JTaskManager.Service.Extensions
{
    public static class EnumExtensions
    {
        /// <summary>
        /// 获取枚举内容列表
        /// </summary>
        /// <param name="enumName"></param>
        /// <returns></returns>
        public static List<EnumsDto> GetEnumList(string enumName)
        {
            try
            {
                var enums = GetEnumByName(enumName);
                return enums;
            }
            catch
            {
                return null;
            }
        }

        private static List<EnumsDto> GetEnumByName(string enumName)
        {
            var type = Type.GetType("JTaskManager.Core." + enumName + ",JTaskManager.Core");
            return Enum
                .GetNames(type)
                .Select(name => new EnumsDto
                {
                    Key = name,
                    Value = (int)Enum.Parse(type, name)
                })
                .ToList();
        }
    }
}
