angular.module('mttapp.factories', [])
  .factory('CommonFactory', CommonFactory);

function CommonFactory($resource, $q) {

  var dataResource = $resource('data/MTT_22_12_2015.json', null);

  function getAllData() {
    var deferred = $q.defer();
    dataResource
      .get('', function (data) {
        deferred.resolve(data);
      }, function (error) {
        deferred.reject(error);
      });
    return deferred.promise;
  }

  return {
    getAllData: getAllData
  }
}
