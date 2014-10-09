/**
 * Created by meditech on 8/26/2014.
 */
app.factory('CustomerService', function($q, $timeout) {
    var preDatas=[];
    return {
        all: function() {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve(preDatas);
            }, 1000);
            return deferred.promise;
        },
        allSync : function() {
            return preDatas;
        },
        get: function(detailId) {
            // Simple index lookup
            for(var i=0, l=preDatas.length; i < l; i++) {
                if(preDatas[i].id == detailId) {
                    return preDatas[i];
                }
            }
        }
    }
})