using JTaskManager.Common;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace JTaskManager.Service.Interfaces
{
    /// <summary>
    /// 定义基本服务
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IBaseService<T> where T : class
    {
        #region 添加操作
        /// <summary>
        /// 添加一条数据
        /// </summary>
        /// <param name="parm">cms_advlist</param>
        /// <returns></returns>
        Task<ApiResult<string>> AddAsync(T parm, bool Async = false);

        /// <summary>
        /// 批量添加数据
        /// </summary>
        /// <param name="parm">List<T></param>
        /// <returns></returns>
        Task<ApiResult<string>> AddListAsync(List<T> parm, bool Async = false);

        #endregion

        #region 查询操作
        /// <summary>
        /// 获得列表
        /// </summary>
        /// <param name="where">Expression<Func<T, bool>></param>
        /// <param name="order">Expression<Func<T, object>></param>
        /// <param name="orderEnum">DbOrderEnum</param>
        /// <returns></returns>
        Task<ApiResult<List<T>>> GetListAsync(Expression<Func<T, bool>> where,
            Expression<Func<T, object>> order, DbOrderEnum orderEnum, bool Async = false);

        /// <summary>
        /// 获得列表
        /// </summary>
        /// <returns></returns>
        Task<ApiResult<List<T>>> GetListAsync(bool Async = false);

        /// <summary>
		/// 获得列表——分页
		/// </summary>
		/// <param name="parm">PageParm</param>
		/// <returns></returns>
		Task<ApiResult<Page<T>>> GetPagesAsync(PageParm parm, bool Async = false);

        /// <summary>
        /// 分页
        /// </summary>
        /// <param name="parm">分页参数</param>
        /// <param name="where">条件</param>
        /// <param name="order">排序值</param>
        /// <param name="orderEnum">排序方式OrderByType</param>
        /// <returns></returns>
        Task<ApiResult<Page<T>>> GetPagesAsync(PageParm parm, Expression<Func<T, bool>> where,
            Expression<Func<T, object>> order, DbOrderEnum orderEnum, bool Async = false);

        /// <summary>
        /// 获得一条数据
        /// </summary>
        /// <param name="parm">string</param>
        /// <returns></returns>
        Task<ApiResult<T>> GetModelAsync(string parm, bool Async = false);

        /// <summary>
        /// 获得一条数据
        /// </summary>
        /// <param name="where">Expression<Func<T, bool>></param>
        /// <returns></returns>
        Task<ApiResult<T>> GetModelAsync(Expression<Func<T, bool>> where, bool Async = false);
        #endregion

        #region 修改操作
        /// <summary>
        /// 修改一条数据
        /// </summary>
        /// <param name="parm">T</param>
        /// <returns></returns>
        Task<ApiResult<string>> UpdateAsync(T parm, bool Async = false);

        /// <summary>
        /// 修改一条数据
        /// </summary>
        /// <param name="parm">T</param>
        /// <returns></returns>
        Task<ApiResult<string>> UpdateAsync(List<T> parm, bool Async = false);

        /// <summary>
        /// 修改一条数据，可用作假删除
        /// </summary>
        /// <param name="columns">修改的列=Expression<Func<T,T>></param>
        /// <param name="where">Expression<Func<T,bool>></param>
        /// <returns></returns>
        Task<ApiResult<string>> UpdateAsync(Expression<Func<T, T>> columns,
            Expression<Func<T, bool>> where, bool Async = false);
        #endregion

        #region 删除操作
        /// <summary>
        /// 删除一条或多条数据
        /// </summary>
        /// <param name="parm">string</param>
        /// <returns></returns>
        Task<ApiResult<string>> DeleteAsync(string parm, bool Async = false);

        /// <summary>
        /// 删除一条或多条数据
        /// </summary>
        /// <param name="where">Expression<Func<T, bool>></param>
        /// <returns></returns>
        Task<ApiResult<string>> DeleteAsync(Expression<Func<T, bool>> where, bool Async = false);

        #endregion

        #region 查询Count
        Task<ApiResult<ResultCount>> CountAsync(Expression<Func<T, bool>> where, bool Async = false);
        #endregion

        #region 是否存在
        Task<ApiResult<ResultAny>> IsExistAsync(Expression<Func<T, bool>> where, bool Async = false);
        #endregion
    }

}
