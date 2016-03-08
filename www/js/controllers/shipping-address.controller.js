(function () {
  angular.module('mttapp.controllers')
    .controller('ShippingAddressesCtrl', ShippingAddressesCtrl);

  function ShippingAddressesCtrl($scope, $rootScope, $log,$ionicModal, $timeout, $state, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, CommonService, CommonFactory, ShippingPaymentService, AddressService) {

    $log.log('ShippingAddressesCtrl');

    $scope.changeState = function (toState) {
      $state.go(toState);
      CommonService.setNativeAnimation();
    };

    function getAllAddresses() {
      CommonService.showLoader();
      var allAddressesClass = Parse.Object.extend("ya_user_addresses");
      var addressQuery = new Parse.Query(allAddressesClass);
      addressQuery.equalTo('user_id', CommonService.getUserObjInLocalStorage().user_id);
      addressQuery.equalTo("is_deleted", false);

      addressQuery.find({
        success: function (results) {
          $scope.allAddresses = angular.fromJson(angular.toJson(results));
          AddressService.setAllAddressesList(angular.fromJson(angular.toJson(results)));
          CommonService.hideLoader();
        },
        error: function (error) {
          $log.log("Error: " + error.code + " " + error.message);
          CommonService.hideLoader();
        }
      });
    }

    getAllAddresses();

    $scope.addressSelected = function (address) {
      ShippingPaymentService.setSelectedAddress(address);
      $state.go('app.add-shipping');
      CommonService.setNativeAnimation();
    };

    $scope.shippingAddressSelected = function (address) {
      ShippingPaymentService.setSelectedShippingAddress(address);
      $ionicHistory.goBack();
    };

    $rootScope.$on('Address:Change', function (event, data) {
      $log.log('Address list refreshed.');
      getAllAddresses();
    });

  }

})();
