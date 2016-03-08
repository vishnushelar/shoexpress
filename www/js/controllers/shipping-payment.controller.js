(function () {
  angular.module('mttapp.controllers')
    .controller('ShippingPaymentCtrl', ShippingPaymentCtrl);

  function ShippingPaymentCtrl($scope, $ionicModal, $log,$timeout, $state, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, CommonService, CommonFactory) {

    $scope.changeState = function (toState) {
      $state.go(toState);
      CommonService.setNativeAnimation();
    };

    function getAllAddresses() {
      CommonService.showLoader();
      var allAddressesClass = Parse.Object.extend("ya_user_addresses");
      var addressQuery = new Parse.Query(allAddressesClass);
      addressQuery.equalTo('user_id', CommonService.getUserObjInLocalStorage().user_id);
      addressQuery.find({
        success: function (results) {
          $scope.allAddresses = angular.fromJson(angular.toJson(results));
          CommonService.hideLoader();
        },
        error: function (error) {
          $log.log("Error: " + error.code + " " + error.message);
          CommonService.hideLoader();
        }
      });
    }

    getAllAddresses();

  }

})();
