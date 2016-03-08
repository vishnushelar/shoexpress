(function () {
  angular.module('mttapp.controllers')
    .controller('AddEditShippingCtrl', AddEditShippingCtrl);

  function AddEditShippingCtrl($scope, $rootScope,$log, $ionicModal, $timeout, $state, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, CommonService, CommonFactory, urls, ShippingPaymentService, AddressService) {

    $scope.address = {};

    $scope.allAddresses = AddressService.getAllAddressesList();

    $scope.changeState = function (toState) {
      $state.go(toState);
      CommonService.setNativeAnimation();
    };

    if (ShippingPaymentService.getSelectedAddress()) {
      $scope.address = ShippingPaymentService.getSelectedAddress();
      ShippingPaymentService.setSelectedAddress(null);
      $scope.editAddress = true;
    } else {
      $scope.editAddress = false;
    }

    function changeTheDefaultAddress(is_default) {
      CommonService.showLoader();
      if ($scope.allAddresses.length == 0) {
        $rootScope.$broadcast('Address:Change');
        $state.go('app.shipping-addresses');
        CommonService.setNativeAnimation();
      } else {
        angular.forEach($scope.allAddresses, function (val, key) {
          if (val.is_default) {
            var ya_user_address = Parse.Object.extend("ya_user_addresses");
            var updateAddress = new Parse.Query(ya_user_address);
            updateAddress.equalTo("objectId", val.objectId);

            updateAddress.first({
              success: function (result) {
                result.save('is_default', false);
                CommonService.hideLoader();
                $rootScope.$broadcast('Address:Change');
                $state.go('app.shipping-addresses');
                CommonService.setNativeAnimation();
              }
            });
          }
          if (!val.is_default && (($scope.allAddresses.length - 1) == key)) {
            CommonService.hideLoader();
            $rootScope.$broadcast('Address:Change');
            $state.go('app.shipping-addresses');
            CommonService.setNativeAnimation();
          }
        });
      }

    }

    $scope.addNewAddress = function () {
      if ($scope.address.first_name && $scope.address.last_name && $scope.address.address_first_line && $scope.address.city && $scope.address.country && $scope.address.zip && $scope.address.phone_no) {
        CommonService.showLoader();
        var ya_user_address = Parse.Object.extend("ya_user_addresses");
        var newAddress = new ya_user_address();

        newAddress.set("address_id", (CommonService.generateUID()).toString());
        newAddress.set("first_name", $scope.address.first_name);
        newAddress.set("last_name", $scope.address.last_name);
        //newAddress.set("email", $scope.address.email);
        newAddress.set("phone_no", $scope.address.phone_no);
        newAddress.set("address_first_line", $scope.address.address_first_line);
        newAddress.set("address_second_line", $scope.address.address_second_line);
        newAddress.set("city", $scope.address.city);
        newAddress.set("zip", $scope.address.zip);
        newAddress.set("country", $scope.address.country);
        newAddress.set("is_default", ($scope.address.is_default || false));
        newAddress.set("is_deleted", false);
        newAddress.set("app_id", urls.appId);
        newAddress.set("user_id", CommonService.getUserObjInLocalStorage().user_id);

        newAddress.save(null, {
          success: function (response) {
            $log.log('Success', 'New address created with objectId : ' + response.id);

            changeTheDefaultAddress($scope.address.is_default);
            CommonService.hideLoader();
          },
          error: function (response, error) {
            CommonService.showAlert('Error', 'Error while creating the address.');
            CommonService.hideLoader();
          }
        });
      } else {
        CommonService.showAlert('Error', 'Please fill all the fields and try again.');
      }
    };

    $scope.updateAddress = function () {
      if ($scope.address.first_name && $scope.address.last_name && $scope.address.phone_no && $scope.address.address_first_line && $scope.address.city) {
        CommonService.showLoader();
        var ya_user_address = Parse.Object.extend("ya_user_addresses");
        var updateAddress = new Parse.Query(ya_user_address);
        updateAddress.equalTo("objectId", $scope.address.objectId);

        updateAddress.first({
          success: function (result) {
            result.save('first_name', $scope.address.first_name);
            result.save('last_name', $scope.address.last_name);
            result.save('phone_no', $scope.address.phone_no);
            result.save('address_first_line', $scope.address.address_first_line);
            result.save('address_second_line', $scope.address.address_second_line);
            result.save('city', $scope.address.city);
            result.save('zip', $scope.address.zip);
            result.save('country', $scope.address.country);
            result.save('is_default', ($scope.address.is_default || false));
            result.save('is_deleted', false);
            result.save('app_id', urls.appId);
            result.save('user_id', CommonService.getUserObjInLocalStorage().user_id);

            changeTheDefaultAddress($scope.address.is_default);
            CommonService.hideLoader();
          }
        });
      } else {
        CommonService.showAlert('Error', 'Please fill all the fields and try again.');
      }
    };

    $scope.removeAddress = function () {
      CommonService.showLoader();
      var ya_user_address = Parse.Object.extend("ya_user_addresses");
      var updateAddress = new Parse.Query(ya_user_address);
      updateAddress.equalTo("objectId", $scope.address.objectId);

      updateAddress.first({
        success: function (result) {
          result.save('is_deleted', true);
          CommonService.hideLoader();
          $rootScope.$broadcast('Address:Change');
          $timeout(function () {
            $state.go('app.shipping-addresses');
            CommonService.setNativeAnimation();
          })
        }
      });
    };

  }

})
();
