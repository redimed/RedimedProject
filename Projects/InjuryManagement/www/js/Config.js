angular.module('app.config', [])

    .constant('HOST_CONFIG', {
        'host':'testapp.redimed.com.au',
        //'host':'192.168.133.10',
        'port':'3000'
    })

    .constant("SYS_TITLE", [
        {"code":"Mr", "name":"Mr"},
        {"code":"Mrs", "name": "Mrs"},
        {"code":"Ms", "name":"Ms"},
        {"code":"Miss", "name":"Miss"},
        {"code":"Dr", "name":"Dr"},
        {"code":"Master", "name":"Master"}
    ])

    .constant('SEX_LIST', [
        {'code': 'Male', 'name': 'Male'},
        {'code': 'Female', 'name': 'Female'}
    ])

    .factory('ConfigService', function (Restangular, SEX_LIST, SYS_TITLE) {
        var configService = {};
        var configApi = Restangular.all("api/erm");

        configService.sex_option = function () {
            return SEX_LIST;
        };

        configService.title_option = function(){
            return SYS_TITLE;
        }

        return configService;
    })
