angular.module('mttapp.factories')
  .factory('CartFactory', CartFactory);

function CartFactory($ionicPopup, $ionicLoading, $q, $http,$log, CommonService, CartService) {

  function getAllCartProductsFact() {
    var deferred = $q.defer();

    var allCartProductsClass = Parse.Object.extend("ya_user_product_cart");
    var cartProductsQuery = new Parse.Query(allCartProductsClass);
    cartProductsQuery.equalTo('user_id', CommonService.getUserObjInLocalStorage().user_id);
    cartProductsQuery.equalTo('is_deleted_from_cart', false);
    cartProductsQuery.find({
      success: function (results) {
        CartService.setAllCartProducts(angular.fromJson(angular.toJson(results)));
        CommonService.hideLoader();
        deferred.resolve(angular.fromJson(angular.toJson(results)));
      },
      error: function (error) {
        $log.log("Error: " + error.code + " " + error.message);
        CommonService.hideLoader();
        deferred.reject(error);
      }
    });
    return deferred.promise;
  }

  return {
    getAllCartProductsFact: getAllCartProductsFact
  }
}
