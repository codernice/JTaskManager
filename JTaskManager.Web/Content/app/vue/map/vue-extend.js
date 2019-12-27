'use strict';

define(function (require, exports, module) {

    function cloneObj(obj, targetObj) {
        for (var k in obj) {
            if (Object.prototype.toString.call(obj[k]) == '[object Object]') {
                targetObj[k] = {};
                cloneObj(obj[k], targetObj[k]);
            } else {
                if (Object.prototype.toString.call(obj[k]) == '[object Array]') {
                    targetObj[k] = [];
                    obj[k].forEach(function (it, idx) {
                        targetObj[k][idx] = {};
                        cloneObj(it, targetObj[k][idx]);
                    });
                } else {
                    targetObj[k] = obj[k];
                }
            }
        }
    }

    Vue.Dialog = function (moduleName, mixin) {
        var appendTo = mixin ? mixin.appendTo || '' : '';
        if (mixin) {
            delete mixin.appendTo;
        }

        require.async(moduleName, function (config) {
            var cf = {};
            cloneObj(config, cf);

            if (!cf.mixins) {
                cf.mixins = [];
            }
            mixin && cf.mixins.push(mixin);

            var dialog = new Vue(cf);
            dialog.$mount();
            var el = null;
            if (typeof appendTo == 'string') {
                if (appendTo.indexOf('#') == 0) {
                    el = document.getElementById(appendTo.substring(1));
                } else if (appendTo.indexOf('.') == 0) {
                    var els = document.getElementsByClassName(appendTo.substring(1));
                    if (els.length) {
                        el = els[0];
                    }
                }
            } else {
                el = appendTo;
            }

            if (!el || el.nodeType != 1) {
                el = document.body;
            }

            el.appendChild(dialog.$el);
        });
    };

    Vue.appendStyle = function (css, id) {
        if (!css || !id) {
            return;
        }

        var doc = document,
            el = doc.getElementById(id);
        if (!el) {
            var head = doc.getElementsByTagName('head')[0],
                style = doc.createElement('style');
            style.id = id;
            style.innerHTML = css;
            head.appendChild(style);
        }
    };

    Vue.filter('date', function (value, fmt, isUtc) {
        if (!value) {
            return '';
        }

        fmt = fmt || 'yyyy-MM-dd hh:mm:ss';

        var date;

        if (value.toString().indexOf('/Date(') > -1) {
            date = new Date(parseInt(value.substr(6), 10));
        } else if (value.toString().indexOf('T') > -1) {
            date = new Date(value);
        } else if (typeof value === 'number') {
            date = new Date(value);
        } else {
            date = new Date(value);
        }

        var year = date.getFullYear();
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds() };

        if (isUtc === true) {
            o = {
                "M+": date.getUTCMonth() + 1,
                "d+": date.getUTCDate(),
                "h+": date.getUTCHours(),
                "m+": date.getUTCMinutes(),
                "s+": date.getUTCSeconds(),
                "q+": Math.floor((date.getUTCMonth() + 3) / 3),
                "S": date.getUTCMilliseconds() };
            year = date.getUTCFullYear();
        }

        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (year + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }return fmt;
    });

    Vue.filter('toShortDate', function (value, fmt) {
        if (!value) {
            return value;
        }
        if (Object.prototype.toString.call(value) == '[object Date]') {
            return Vue.filter('date')(value, fmt || 'yyyy-MM-dd');
        } else if (value.toString().indexOf('/Date(') > -1) {
            value = value.substring(6);
        } else if (value.toString().indexOf('T') > -1) {
            var v = new Date(value.replace('T', ' '));
            if (v.toString() == 'Invalid Date') {
                value = new Date(value);
            } else {
                value = v;
            }
        }
        return Vue.filter('date')(value, fmt || 'yyyy-MM-dd');
    });

    Vue.Search = function (url, param, callback) {
        $.ajax({
            type: "POST",
            url: url,
            data: param,
            dataType: "json",
            success: function success(data) {
                callback(data);
            },
            error: function error(XMLHttpRequest, textStatus, errorThrown) {
                alert("未知异常");
            }
        });
    };

    Vue.Enum = function (enumName, callback) {
        $.ajax({
            type: "POST",
            url: "/Enums/GetEnumList",
            data: { enumString: enumName },
            dataType: "json",
            success: function success(data) {
                callback(data);
            },
            error: function error(XMLHttpRequest, textStatus, errorThrown) {
                alert("未知异常，枚举：" + enumName);
            }
        });
    };

    Vue.Delete = function (url, param, callback, msg) {
        if (msg == null) {
            msg = "确认删除该记录？";
        }
        var cf = confirm(msg);
        if (!cf) {
            return;
        }
        $.ajax({
            type: "POST",
            url: url,
            data: param,
            dataType: "json",
            success: function success(data) {
                if (data.success == true) {
                    toastr.success('删除成功');
                    callback();
                } else {
                    toastr.error('删除失败：' + data.message);
                }
            },
            error: function error(XMLHttpRequest, textStatus, errorThrown) {
                toastr.error('删除失败：未知异常');
            }
        });
    };

    Vue.Operate = function (url, param, callback) {
        $.ajax({
            type: "POST",
            url: url,
            data: param,
            dataType: "json",
            success: function success(data) {
                if (data.success == true) {
                    toastr.success('操作成功');
                    callback();
                } else {
                    toastr.error('操作失败：' + data.message);
                }
            },
            error: function error(XMLHttpRequest, textStatus, errorThrown) {
                toastr.error('操作失败：未知异常');
            }
        });
    };

    var cf = {};

    module.exports = cf;
});