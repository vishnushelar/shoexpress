angular.module('mttapp.services')
  .service('ShippingPaymentService', ShippingPaymentService);

function ShippingPaymentService($ionicPopup, $ionicLoading, $http) {

  this.selectedAddress;
  this.selectedShippingAddress;

  this.setSelectedAddress = function (address) {
    this.selectedAddress = address;
  };
  this.getSelectedAddress = function () {
    return this.selectedAddress;
  };

  this.setSelectedShippingAddress = function (address) {
    this.selectedShippingAddress = address;
  };
  this.getSelectedShippingAddress = function () {
    return this.selectedShippingAddress;
  };

}
