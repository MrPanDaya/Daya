(function () {
    window.LocalStorage = {
        setBool: function (key, bool) {
            var str = JSON.stringify(bool)
            cc.sys.localStorage.setItem(key, str)
        },
        getBool: function (key, defaultValue) {
            var str = cc.sys.localStorage.getItem(key)
            if (str) {
                return JSON.parse(str)
            }
            return defaultValue === undefined ? false : defaultValue
        },

        setNumber: function (key, number) {
            var str = JSON.stringify(number)
            cc.sys.localStorage.setItem(key, str)
        },

        getNumber: function (key, defaultValue) {
            var str = cc.sys.localStorage.getItem(key)
            if (str) {
                return JSON.parse(str)
            }
            return defaultValue === undefined ? 0 : parseInt(defaultValue)
        },

        setString: function (key, string) {
            cc.sys.localStorage.setItem(key, string)
        },

        getString: function (key, defaultValue) {
            var str = cc.sys.localStorage.getItem(key)
            if (str) {
                return str
            }
            return defaultValue === undefined ? "" : defaultValue
        },

        setArray: function (key, array) {
            var str = JSON.stringify(array)
            cc.sys.localStorage.setItem(key, str)
        },

        getArray: function (key, defaultValue) {
            var str = cc.sys.localStorage.getItem(key)
            if (str) {
                return JSON.parse(str)
            }
            return defaultValue === undefined ? [] : defaultValue
        },

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

        getObject: function (key, defaultValue) {
            var str = cc.sys.localStorage.getItem(key)
            if (str) {
                return JSON.parse(str)
            }
            return defaultValue === undefined ? {} : defaultValue
        },

        remove: function (key) {
            cc.sys.localStorage.removeItem(key)
        },
    }
})();

