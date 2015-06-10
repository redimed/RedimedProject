
angular.module('app.config', [])

    .constant('HOST_CONFIG', {
    	//'host':'testapp.redimed.com.au',
        'host':'192.168.1.107',
        'port':'3000'
    })
    .factory('ConfigService', function ( Restangular) {
        var configService = {};
        var configApi = Restangular.all("api");
        return configService;
    })
