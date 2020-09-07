/*
* 描述：封装的本地数据存储的接口
* */
(function () {
    window.LocalStorage = {
        /*
        * 描述：存储布尔型数据
        * 参数：key 存储的键值
        * 参数：bool 存储的数据
        * */
        setBool: function (key, bool) {
            var str = JSON.stringify(bool)
            cc.sys.localStorage.setItem(key, str)
        },
        /*
        * 描述：获取本地存储的布尔型数据
        * 参数：key 存储的键值
        * 参数：defaultValue 默认数据
        * */
        getBool: function (key, defaultValue) {
            var str = cc.sys.localStorage.getItem(key)
            if (str) {
                return JSON.parse(str)
            }
            return defaultValue === undefined ? false : defaultValue
        },

        /*
        * 描述：存储数值型数据
        * 参数：key 存储的键值
        * 参数：number 存储的数据
        * */
        setNumber: function (key, number) {
            var str = JSON.stringify(number)
            cc.sys.localStorage.setItem(key, str)
        },

        /*
        * 描述：获取本地存储的数值型数据
        * 参数：key 存储的键值
        * 参数：defaultValue 默认数据
        * */
        getNumber: function (key, defaultValue) {
            var str = cc.sys.localStorage.getItem(key)
            if (str) {
                return JSON.parse(str)
            }
            return defaultValue === undefined ? 0 : parseInt(defaultValue)
        },

        /*
        * 描述：存储字符型数据
        * 参数：key 存储的键值
        * 参数：string 存储的数据
        * */
        setString: function (key, string) {
            cc.sys.localStorage.setItem(key, string)
        },

        /*
        * 描述：获取本地存储的字符型数据
        * 参数：key 存储的键值
        * 参数：defaultValue 默认数据
        * */
        getString: function (key, defaultValue) {
            var str = cc.sys.localStorage.getItem(key)
            if (str) {
                return str
            }
            return defaultValue === undefined ? "" : defaultValue
        },

        /*
        * 描述：存储数组型数据
        * 参数：key 存储的键值
        * 参数：array 存储的数据
        * */
        setArray: function (key, array) {
            var str = JSON.stringify(array)
            cc.sys.localStorage.setItem(key, str)
        },

        /*
        * 描述：获取本地存储的数组型数据
        * 参数：key 存储的键值
        * 参数：defaultValue 默认数据
        * */
        getArray: function (key, defaultValue) {
            var str = cc.sys.localStorage.getItem(key)
            if (str) {
                return JSON.parse(str)
            }
            return defaultValue === undefined ? [] : defaultValue
        },

        /*
        * 描述：存储结构体类型数据
        * 参数：key 存储的键值
        * 参数：object 存储的数据
        * */
        setObject: function (key, object) {
            var cache = [];
            var str = JSON.stringify(object, function (key, value) {
                if (typeof value === 'object' && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        return;
                    }
                    cache.push(value);
                }
                return value;
            });
            cache = null; // Enable garbage collection

            cc.sys.localStorage.setItem(key, str)
        },

        /*
        * 描述：获取本地存储的结构体类型数据
        * 参数：key 存储的键值
        * 参数：defaultValue 默认数据
        * */
        getObject: function (key, defaultValue) {
            var str = cc.sys.localStorage.getItem(key)
            if (str) {
                return JSON.parse(str)
            }
            return defaultValue === undefined ? {} : defaultValue
        },

        /*
        * 描述：删除本地存储数据
        * 参数：key 存储的键值
        * */
        remove: function (key) {
            cc.sys.localStorage.removeItem(key)
        },
    }
})();

