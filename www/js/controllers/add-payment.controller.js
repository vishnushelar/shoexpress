(function () {
  angular.module('mttapp.controllers')
    .controller('AddPaymentCtrl', AddPaymentCtrl);

  function AddPaymentCtrl($scope, $ionicModal, $timeout, $state, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, CommonFactory,CommonService) {

    $scope.changeState = function (toState) {
      $state.go(toState);
      CommonService.setNativeAnimation();
    };

  }

})();
