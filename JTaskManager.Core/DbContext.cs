using JTaskManager.Core.Model;
using SqlSugar;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;

namespace JTaskManager.Core
{
    public class DbContext
    {
        public DbContext()
        {
            var connectionString = ConfigurationManager.AppSettings.Get("TaskManagerConnection");
            Db = new SqlSugarClient(new ConnectionConfig()
            {
                ConnectionString = connectionString,
                DbType = DbType.SqlServer,
                InitKeyType = InitKeyType.Attribute,//从特性读取主键和自增列信息
                IsAutoCloseConnection = true,//开启自动释放模式和EF原理一样我就不多解释了

            });
            //调式代码 用来打印SQL 
            //Db.Aop.OnLogExecuting = (sql, pars) =>
            //{
            //    Console.WriteLine(sql + "\r\n" +
            //        Db.Utilities.SerializeObject(pars.ToDictionary(it => it.ParameterName, it => it.Value)));
            //    Console.WriteLine();
            //};

            //Db.CodeFirst.SetStringDefaultLength(200/*设置varchar默认长度为200*/).InitTables(typeof(Tasks));         //执行完数据库就有这个表了
            //Db.CodeFirst.SetStringDefaultLength(200/*设置varchar默认长度为200*/).InitTables(typeof(TaskLogs));
        }

        //注意：不能写成静态的
        public SqlSugarClient Db;                                                           //用来处理事务多表查询和复杂的操作

        //单表简单操作
    }
}
