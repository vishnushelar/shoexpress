(function(){
  angular.module('mttapp.controllers')
    .controller('AddEditCategoryCtrl', AddEditCategoryCtrl);

  function AddEditCategoryCtrl($scope, $state, $log,$ionicHistory, $ionicActionSheet, $cordovaCamera, CommonFactory, ScrollService, CameraService,CommonService) {

    $scope.addEditCategoryTitle = '';
    $scope.operationType = '';

    $scope.goToHome = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.admin-home');
      CommonService.setNativeAnimation();
    };

    if ($state.current.name === 'app.add-category') {
      $scope.addEditCategoryTitle = 'Add Category';
      $scope.operationType = 'Add';
    } else {
      $scope.addEditCategoryTitle = 'Edit Category';
      $scope.operationType = 'Edit';
    }

    $scope.uploadImage = function () {
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: '<span class="photo_sheet_options">Take photo</span>'},
          {text: '<span class="photo_sheet_options">Photo library</span>'}
        ],
        titleText: '',
        cancelText: '<span class="photo_sheet_options">Cancel</span>',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          CameraService.showCamOptions(index, function (val) {
            $log.log('image val : ', val);
          });
          return true;
        }
      });
    };

  }

})();
