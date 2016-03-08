(function () {
  angular.module('mttapp.controllers')
    .controller('CartCtrl', CartCtrl);

  function CartCtrl($scope, $rootScope, $log, $ionicModal, $ionicNavBarDelegate, $timeout, $state, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, CommonService, CommonFactory, CartService) {

    $scope.totalCartOriginalPrice = 0;
    $scope.totalCartDiscountPrice = 0;

    $ionicNavBarDelegate.showBackButton(true);

    $scope.online = navigator.onLine;

    $scope.goToHome = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.home');
      CommonService.setNativeAnimation();
    };

    $scope.goToPreviousPage = function () {
      $ionicHistory.goBack([-2]);
      CommonService.setNativeAnimation('down');
    };

    $scope.editCart = function () {
      $state.go('app.edit-cart');
      CommonService.setNativeAnimation();
    };

    $scope.continueShopping = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $ionicHistory.clearHistory();
      $state.go('app.home');
      CommonService.setNativeAnimation('down');
    };

    $scope.goToShippingInformationPage = function () {
      $state.go('app.shipping-information');
      CommonService.setNativeAnimation();
    };

    $scope.showItemAdded = CartService.getShowItemAddedAtCart();
    CartService.setShowItemAddedAtCart(false);

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
          console.log('getAllCartProducts : ', CartService.getAllCartProducts());
          CommonService.hideLoader();

          if ($scope.allCartProducts.length > 0) {
            $rootScope.$broadcast('cartCount', 0, $scope.allCartProducts.length);
            $scope.currency_logo = '&#8377;';

            angular.forEach($scope.allCartProducts, function (val, key) {
              if (!val.is_deleted_from_cart) {
                $scope.totalCartOriginalPrice += val.original_price * val.quantity;
                $scope.totalCartDiscountPrice += val.discounted_price * val.quantity;
              }
            });

            CartService.setTotalCartOriginalPrice($scope.totalCartOriginalPrice);
            CartService.setTotalCartDiscountPrice($scope.totalCartDiscountPrice);
          }
        },
        error: function (error) {
          $log.log("Error: " + error.code + " " + error.message);
          CommonService.hideLoader();
        }
      });
    }

    if ($scope.online) {
      getAllCartProducts();
    }

  }

})();
