(function () {
  angular.module('mttapp.controllers')
    .controller('AdminHomeCtrl', AdminHomeCtrl);

  function AdminHomeCtrl($scope, $rootScope, $log,$ionicHistory, $ionicModal, $timeout, $state, $ionicSlideBoxDelegate, $ionicScrollDelegate, CommonFactory, CommonService) {
    $scope.homePageData = {};

    $scope.tabs = [
      {"text": "Smartphone case"},
      {"text": "Power banks"}
    ];

    $rootScope.adminLoggedIn = true;

    $scope.showCancel = false;
    $scope.searchText = '';

    $scope.showCancelBtn = function () {
      $log.log('show');
      $scope.showCancel = true;
    };

    $scope.hideCancelBtn = function (searchText) {
      $log.log('hide');
      $scope.showCancel = false;
      $scope.searchString = '';
      setTimeout(function () {
        CommonService.hideKeyboard();
      }, 1000)
    };

    $scope.activeTabObj = $scope.tabs[0];

    CommonFactory.getAllData()
      .then(function (response) {
        $log.log(response);
        $scope.homePageData = response;
      }, function (error) {
        $log.log(error);
      });

    $scope.homePageSlideHasChanged = function (slideNo) {
      $scope.activeTabObj = $scope.tabs[slideNo];
      //$ionicScrollDelegate.$getByHandle('homePageDelegate').scrollTop();
    };

    $scope.changeState = function (toState, history) {
      if (history) {
        $state.go(toState);
        CommonService.setNativeAnimation();
      } else {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go(toState);
        CommonService.setNativeAnimation();
      }
    };

  }

})();
