angular.module('mttapp.services')
  .service('AddressService', AddressService);

function AddressService($ionicPopup, $ionicLoading, $http) {

  this.allAddresses;

  this.setAllAddressesList = function (allAddresses) {
    this.allAddresses = allAddresses;
  };
  this.getAllAddressesList = function () {
    return this.allAddresses;
  };

}
