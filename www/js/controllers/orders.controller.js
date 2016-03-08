(function () {
  angular.module('mttapp.controllers')
    .controller('OrdersCtrl', OrdersCtrl);

  function OrdersCtrl($scope, $ionicModal,$log, $timeout, $state, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, CommonFactory, CommonService, CartService) {

    $scope.viewOrderDetails = function (orderDetails) {
      CartService.setSelectedOrderDetails(orderDetails);
      $state.go('app.order-details');
      CommonService.setNativeAnimation();
    };

    $scope.startShopping = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.home');
      CommonService.setNativeAnimation();
    };

    function getAllOrders() {
      CommonService.showLoader();
      var ordersClass = Parse.Object.extend("ya_user_orders");
      var allOrdersQuery = new Parse.Query(ordersClass);
      allOrdersQuery.equalTo('user_id', CommonService.getUserObjInLocalStorage().user_id);
      allOrdersQuery.equalTo('is_deleted', false);
      allOrdersQuery.equalTo('is_success', true);

      allOrdersQuery.find({
        success: function (results) {
          $scope.allOrders = angular.fromJson(angular.toJson(results));
          loadIndividualOrderDetails($scope.allOrders);
          CommonService.hideLoader();
        },
        error: function (error) {
          $log.log("Error while loading the orders.");
          CommonService.hideLoader();
        }
      });
    }

    getAllOrders();

    function loadIndividualOrderDetails(allOrders) {
      angular.forEach(allOrders, function (val, key) {
        CommonService.showLoader();
        var ordersClass = Parse.Object.extend("ya_user_orders_details");
        var allOrdersQuery = new Parse.Query(ordersClass);
        allOrdersQuery.equalTo('user_id', CommonService.getUserObjInLocalStorage().user_id);
        allOrdersQuery.equalTo('order_id', val.order_id);

        allOrdersQuery.find({
          success: function (results) {
            CommonService.hideLoader();
            $scope.allOrders[key].details = angular.fromJson(angular.toJson(results));
          },
          error: function (error) {
            $log.log("Error while loading the order details.");
            CommonService.hideLoader();
          }
        });
      })
    }

  }

})();
