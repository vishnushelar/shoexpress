(function () {
  angular.module('mttapp.controllers')
    .controller('AddItemCtrl', AddItemCtrl);

  function AddItemCtrl($scope, $ionicModal, $timeout,$log, $state, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate,
                       $ionicActionSheet, $ionicPopup, $cordovaCamera, CommonFactory, ScrollService, CameraService,CommonService) {

    $scope.selectedQuantity = 0;
    $scope.showCustomerActions = true;
    $scope.homeDeliveryCharge = "50";
    $scope.itemImages = [1, 2, 3];
    $scope.itemColors = [];
    $scope.itemSizes = [{name: 'Enter'}];
    $scope.selectedColor = '#ff00ff';
    $scope.itemPrice = {};

    $scope.goToHome = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.admin-home');
      CommonService.setNativeAnimation();
    };

    $scope.autoExpand = function (e) {
      var element = typeof e === 'object' ? e.target : document.getElementById(e);
      var scrollHeight = element.scrollHeight - 20; // replace 20 by the sum of padding-top and padding-bottom
      element.style.height = scrollHeight + "px";
    };

    try {
      $timeout(function () {
        var sv = $ionicScrollDelegate.$getByHandle('images_scroll_delegate').getScrollView();
        ScrollService.handleScroll(sv);
      });
      $timeout(function () {
        var sv = $ionicScrollDelegate.$getByHandle('colors_scroll_delegate').getScrollView();
        ScrollService.handleScroll(sv);
      });
      $timeout(function () {
        var sv = $ionicScrollDelegate.$getByHandle('sizes_scroll_delegate').getScrollView();
        ScrollService.handleScroll(sv);
      });
    } catch (e) {
      $log.log('Error in scrolling : AddItemCtrl')
    }

    $scope.changeQuantity = function (val) {
      if ($scope.selectedQuantity >= 0 && val == 1) {
        $scope.selectedQuantity += val;
      } else if ($scope.selectedQuantity > 0 && val == -1) {
        $scope.selectedQuantity += val;
      }
    };

    $scope.showAddNewPhotoActionSheet = function () {

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
      //hideSheet();
    };

    $scope.addAnotherCameraIcon = function () {
      $scope.itemImages.push(1);
    };

    $ionicModal.fromTemplateUrl('templates/color-picker-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.colorPickerModal = modal;
    });
    $scope.openColorPickerModal = function () {
      $scope.colorPickerModal.show();
    };
    $scope.closeColorPickerModal = function () {
      $scope.colorPickerModal.hide();
    };

    $scope.showAddNewColorActionSheet = function () {

      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: '<span class="color_sheet_options">Take photo</span>'},
          {text: '<span class="color_sheet_options">Color pallette</span>'}
        ],
        titleText: '',
        cancelText: '<span class="color_sheet_options">Cancel</span>',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          if (index == 0) {
            CameraService.showCamOptions(index, function (val) {
              $log.log('image val : ', val);
              $scope.itemColors.push({name: 'Color'});
            });
          } else {
            $scope.openColorPickerModal();
          }
          return true;
        }
      });
      //hideSheet();
    };

    $scope.addAnotherSizeItem = function () {
      $scope.itemSizes.push({name: 'Enter'});
    };

    $scope.size = {};

    $scope.enterSize = function (index) {
      $scope.size.newSize = '';

      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="size.newSize">',
        title: 'Enter Size',
        subTitle: '',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.size.newSize) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return {index: index, val: $scope.size.newSize};
              }
            }
          }
        ]
      });
      myPopup.then(function (res) {
        $log.log('Tapped!', res);
        if (res && res.val && res.index != undefined) {
          $scope.itemSizes[res.index].name = res.val;
        }
      });
      /*$timeout(function () {
       myPopup.close(); //close the popup after 3 seconds for some reason
       }, 3000);*/
    };

    $scope.calculateDiscountPercentage = function () {
      if ($scope.itemPrice.current && $scope.itemPrice.discount) {
        var discount = (($scope.itemPrice.current - $scope.itemPrice.discount) / ($scope.itemPrice.current)) * 100;
        discount = parseFloat(discount.toPrecision(4));
        $scope.itemPrice.discountPercentage = discount + ' %';
      }
    };

    $scope.toggleCustomerActions = function () {
      $scope.showCustomerActions = !$scope.showCustomerActions;
    };

  };

})();
