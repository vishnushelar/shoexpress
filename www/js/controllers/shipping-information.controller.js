(function () {
  angular.module('mttapp.controllers')
    .controller('ShippingInformationCtrl', ShippingInformationCtrl);

  function ShippingInformationCtrl($scope, $rootScope,$log, $ionicModal, $timeout, $state, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, $cordovaInAppBrowser, CommonFactory, ScrollService, CartService, CommonService, ShippingPaymentService) {

    $scope.deliveryMethod = 1;
    $scope.deliveryCharge = 0;
    $scope.shippingAddress = {};

    $scope.totalCartDiscountPrice = CartService.getTotalCartDiscountPrice() || CartService.getTotalCartOriginalPrice();

    function getDefaultAddress() {
      CommonService.showLoader();
      var defaultAddressClass = Parse.Object.extend("ya_user_addresses");
      var defaultAddressQuery = new Parse.Query(defaultAddressClass);
      defaultAddressQuery.equalTo('user_id', CommonService.getUserObjInLocalStorage().user_id);
      defaultAddressQuery.equalTo('is_deleted', false);
      defaultAddressQuery.equalTo('is_default', true);
      defaultAddressQuery.limit(1);

      defaultAddressQuery.find({
        success: function (results) {
          $scope.defaultAddress = angular.fromJson(angular.toJson(results));
          if ($scope.defaultAddress.length > 0) {
            $scope.shippingAddress = $scope.defaultAddress[0];
            if ($scope.shippingAddress) {
              $scope.shippingAddress.address = $scope.shippingAddress.address_first_line + " " + $scope.shippingAddress.address_second_line;
            }
          }
          CommonService.hideLoader();
        },
        error: function (error) {
          $log.log("Error: " + error.code + " " + error.message);
          CommonService.hideLoader();
        }
      });
    }

    if (!ShippingPaymentService.getSelectedShippingAddress()) {
      getDefaultAddress();
    } else {
      $scope.shippingAddress = ShippingPaymentService.getSelectedShippingAddress();
      $scope.shippingAddress.address = $scope.shippingAddress.address_first_line + " " + $scope.shippingAddress.address_second_line;
    }

    function paymentGatewayDone() {
      $log.log("PG Done");
    }

    $scope.goToConfirmationPage = function () {
      $log.log($scope.shippingAddress);
      if ($scope.shippingAddress && $scope.shippingAddress.first_name && $scope.shippingAddress.last_name && $scope.shippingAddress.phone_no && $scope.shippingAddress.address && $scope.shippingAddress.zip && $scope.shippingAddress.city) {
        CartService.setShippingAddress($scope.shippingAddress);
        $state.go('app.review-order');
        CommonService.setNativeAnimation();
      } else {
        CommonService.showAlert('Warning!', 'Please fill all the fields.');
      }
    };

    try {
      $timeout(function () {
        var sv = $ionicScrollDelegate.$getByHandle('shipping_info_scroll_delegate').getScrollView();
        ScrollService.handleScroll(sv);
      });
    } catch (e) {
      $log.log('Error in scrolling : HomeCtrl')
    }

    CartService.setDeliveryTypeCharge({type: 'Free', charge: 0});

    $scope.deliveryTypeSelected = function (val, charge, type) {
      $scope.deliveryCharge = charge;
      $scope.deliveryMethod = val;
      CartService.setDeliveryTypeCharge({type: type, charge: charge});
    };

  }

})();
