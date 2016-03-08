(function () {
  angular.module('mttapp.controllers')
    .controller('OrderSummaryCtrl', OrderSummaryCtrl);

  function OrderSummaryCtrl($scope, $rootScope, $ionicModal, $timeout, $state, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, CommonFactory, CartService, CommonService, urls) {

    $scope.allCartProducts = CartService.getAllCartProducts();
    $scope.shippingAddress = CartService.getShippingAddress();
    $scope.deliveryTypeCharge = CartService.getDeliveryTypeCharge();
    $scope.totalCartDiscountPrice = CartService.getTotalCartDiscountPrice() || CartService.getTotalCartOriginalPrice();
    $scope.cardNumber = CartService.getCardNumber();
    $scope.paymentMode = CartService.getPaymentMode();

    var prodCount = 0;
    var addedProdCount = 0;

    $scope.changeState = function (toState) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go(toState);
      CommonService.setNativeAnimation();
    };

  }

})();
