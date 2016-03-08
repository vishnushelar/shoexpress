(function () {
  angular.module('mttapp.controllers')
    .controller('SettingsCtrl', SettingsCtrl);

  function SettingsCtrl($scope, $rootScope, $log, $ionicModal, $cordovaAppVersion, $ionicNavBarDelegate, $timeout, $state, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, $cordovaOauth, $cordovaSocialSharing, CommonFactory, CommonService, AuthService) {

    $rootScope.userSignedIn = false;
    $scope.editApp = false;
    $scope.appVersion;

    $scope.device = CommonService.getMobileDevice();
    //$ionicNavBarDelegate.showBackButton(false);

    if (CommonService.getUserObjInLocalStorage()) {
      $rootScope.userSignedIn = true;
      $scope.userObj = CommonService.getUserObjInLocalStorage();
    }

    document.addEventListener("deviceready", function () {
      $cordovaAppVersion
        .getVersionNumber()
        .then(function (version) {
          $scope.appVersion = version;
        });
    }, false);

    $scope.signOut = function () {
      $rootScope.userSignedIn = false;
      $rootScope.$broadcast('cartCount', 0, 0);
      CommonService.removeUserObjInLocalStorage();
    };

    $scope.editAppChanged = function (editApp) {
      if (editApp) {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.home');
        CommonService.setNativeAnimation();
      }
    };

    $scope.openLoginModal = function () {
      AuthService.setLoginOpenedFrom('settings');
      $rootScope.$broadcast('login');
    };

    $scope.resetPassword = function (userObj) {
      $log.log(userObj);
    };

    $scope.goToHome = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.home');
      CommonService.setNativeAnimation('down');
    };

    $scope.goToReturns = function () {
      $state.go('app.returns');
      CommonService.setNativeAnimation();
    };
    $scope.goToShippingPayment = function () {
      $state.go('app.shipping-addresses');
      CommonService.setNativeAnimation();
    };
    $scope.goToOrders = function () {
      $state.go('app.orders');
      CommonService.setNativeAnimation();
    };
    $scope.goToNotifications = function () {
      $state.go('app.notifications');
      CommonService.setNativeAnimation();
    };
    $scope.goToTerms = function () {
      $state.go('app.terms');
      CommonService.setNativeAnimation();
    };
    $scope.goToCancellation = function () {
      $state.go('app.cancellation');
      CommonService.setNativeAnimation();
    };
    $scope.goToPrivacyPolicy = function () {
      $state.go('app.privacy');
      CommonService.setNativeAnimation();
    };
    $scope.goToReturns = function () {
      $state.go('app.returns');
      CommonService.setNativeAnimation();
    };

    $scope.shareTheProduct = function (socialType) {

      var link = '';
      var file = '';

      switch (socialType) {
        case 'chatbubble':
          $cordovaSocialSharing
            .shareViaSMS('msg', '+919930703696')
            .then(function (result) {
              $log.log('Successfully shared via message');
            }, function (err) {
              $log.log('Error while sharing via message');
            });

          break;
        case 'email':
          $cordovaSocialSharing
            .shareViaEmail('', '', ['info@mtt.co.in'], [], [], file)
            .then(function (result) {
              $log.log('Successfully shared via email');
            }, function (err) {
              $log.log('Error while sharing via email');
            });

          break;

        default:
          $log.log('Not sharing on any social network.');
      }

    };


  }

})();
