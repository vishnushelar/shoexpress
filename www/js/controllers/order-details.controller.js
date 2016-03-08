(function () {
  angular.module('mttapp.controllers')
    .controller('OrderDetailsCtrl', OrderDetailsCtrl);

  function OrderDetailsCtrl($scope, $log,$ionicModal, $timeout, $state, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, CommonFactory, CommonService, CartService, urls) {

    $scope.slectedOrder = CartService.getSelectedOrderDetails();


    function getOrderAddress(orderId) {
      CommonService.showLoader();
      var ya_user_order_address = Parse.Object.extend("ya_user_orders_address");
      var orderAddressQuery = new Parse.Query(ya_user_order_address);

      orderAddressQuery.equalTo('user_id', CommonService.getUserObjInLocalStorage().user_id);
      orderAddressQuery.equalTo('order_id', orderId);
      orderAddressQuery.equalTo("app_id", urls.appId);

      orderAddressQuery.find({
        success: function (response) {
          $scope.shippingAddress = angular.fromJson(angular.toJson(response))[0];
          $log.log('Success', 'Shipping address added successfully.');
          CommonService.hideLoader();
        },
        error: function (error) {
          $log.log('Error', 'Error while creating the order. Error is ' + error.message);
          CommonService.hideLoader();
        }
      })
    }

    getOrderAddress($scope.slectedOrder.order_id);

  }

})();
