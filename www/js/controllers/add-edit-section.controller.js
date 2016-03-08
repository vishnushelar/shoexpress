(function(){
  angular.module('mttapp.controllers')
    .controller('AddEditSectionCtrl', AddEditSectionCtrl);

  function AddEditSectionCtrl($scope, $state, $ionicHistory, $cordovaCamera, CommonFactory, ScrollService, CameraService,CommonService) {

    $scope.addEditSectionTitle = '';
    $scope.operationType = '';

    $scope.goToHome = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.admin-home');
      CommonService.setNativeAnimation();
    };

    if ($state.current.name === 'app.add-category') {
      $scope.addEditSectionTitle = 'Add Section';
      $scope.operationType = 'Add';
    } else {
      $scope.addEditSectionTitle = 'Edit Section';
      $scope.operationType = 'Edit';
    }


  }

})();
