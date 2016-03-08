(function () {
  angular.module('mttapp.controllers')
    .controller('EditCartCtrl', EditCartCtrl);

  function EditCartCtrl($scope, $rootScope, $log, $ionicModal, $ionicNavBarDelegate, $timeout, $state, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, CommonService, CommonFactory, CartService) {

    $ionicNavBarDelegate.showBackButton(false);
    $scope.goToCartPage = function () {
      $state.go('app.cart');
      CommonService.setNativeAnimation('right');
    };

    $scope.deleteCartItem = function (product) {
      CommonService.showLoader();
      var ya_user_cart = Parse.Object.extend("ya_user_product_cart");
      var query = new Parse.Query(ya_user_cart);
      query.equalTo("objectId", product.objectId);

      product.is_deleted_from_cart = true;

      query.first({
        success: function (result) {
          result.save('is_deleted_from_cart', true);
          $rootScope.$broadcast('cartCount', -1);
          CommonService.hideLoader();
        },
        error: function (error) {
          $log.log("Error: " + error.code + " " + error.message);
          CommonService.hideLoader();
        }
      });
    };

    $scope.increaseDecreaseQuantity = function (product, val) {
      CommonService.showLoader();
      var ya_user_cart = Parse.Object.extend("ya_user_product_cart");
      var query = new Parse.Query(ya_user_cart);
      query.equalTo("objectId", product.objectId);

      if ((product.quantity + val) > 0) {
        product.quantity += val;
        query.first({
          success: function (result) {
            result.save('quantity', product.quantity);
            CommonService.hideLoader();
          },
          error: function (error) {
            $log.log("Error: " + error.code + " " + error.message);
            CommonService.hideLoader();
          }
        });
      }

    };

    function getAllCartProducts() {
      CommonService.showLoader();
      var allCartProductsClass = Parse.Object.extend("ya_user_product_cart");
      var cartProductsQuery = new Parse.Query(allCartProductsClass);
      cartProductsQuery.equalTo('user_id', CommonService.getUserObjInLocalStorage().user_id);
      cartProductsQuery.equalTo('is_deleted_from_cart', false);
      cartProductsQuery.greaterThan('quantity', 0);

      cartProductsQuery.find({
        success: function (results) {
          $scope.allCartProducts = angular.fromJson(angular.toJson(results));
          CartService.setAllCartProducts($scope.allCartProducts);
          CommonService.hideLoader();
        },
        error: function (error) {
          $log.log("Error: " + error.code + " " + error.message);
          CommonService.hideLoader();
        }
      });
    }

    getAllCartProducts();


  }

})();
