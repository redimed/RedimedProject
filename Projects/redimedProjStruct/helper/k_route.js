var inflect = require('inflect');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

function detectRouteMethod(func, ignore) {
    var methods = ['get', 'post', 'upload', 'put', 'delete'];
    if (!ignore)
        ignore = [];
    for (var i = methods.length - 1; i >= 0; --i) {
        if (func.indexOf(methods[i]) === 0 && ignore.indexOf(methods[i]) == -1) {
            return methods[i];
        }
    }
    return '';
}

function getRouteName(func, method) {
    if (method != 'both')
        var name = func.substring(method.length, func.length);
    else
        var name = func;
    return inflect.underscore(name);
}

module.exports = {
    setRoute: function (app, controller, path) {
        if (!path)
            path = '/api/erm/test/';
        
        var last_char = path.slice(-1);
        if(last_char != '/') {
            last_char += '/';
        }
        
        for (var func in controller) {
            var rest = detectRouteMethod(func);
            if (rest == 'get') {
                var m_name = getRouteName(func, rest);
                app.get(path + m_name, controller[func]);
            } else if (rest == 'post') {
                var m_name = getRouteName(func, rest);
                app.post(path + m_name, controller[func]);
            } else if (rest == 'upload') {
                var m_name = getRouteName(func, rest);
                app.post(path + m_name, multipartMiddleware, controller[func]);
            }
        }
    }
};


