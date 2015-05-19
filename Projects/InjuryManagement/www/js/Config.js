angular.module('app.config', [])

    .constant('HOST_CONFIG', {
        'host':'testapp.redimed.com.au',
        //'host':'192.168.1.105',
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

    .constant("ACC_TYPE", [
        {"code":"PRIVATE", "name": "Private"},
        {"code":"PUBLIC", "name": "Public"},
        {"code":"WORKCOVER", "name":"Work Cover"}
    ])

    .factory('ConfigService', function (SEX_LIST, SYS_TITLE, ACC_TYPE) {
        var configService = {};

        configService.sex_option = function () {
            return SEX_LIST;
        };

        configService.title_option = function(){
            return SYS_TITLE;
        };

        configService.ac_type_option =function(){
            return ACC_TYPE;
        }

        return configService;
    })
