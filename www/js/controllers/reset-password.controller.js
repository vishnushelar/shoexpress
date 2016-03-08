(function () {
  angular.module('mttapp.controllers')
    .controller('ResetPasswordCtrl', ResetPasswordCtrl);

  function ResetPasswordCtrl($scope, $rootScope, $ionicModal, $timeout, $state, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, $cordovaOauth, CommonFactory, CommonService, AuthService) {

    window.localStorage.removeItem("mtt_external_url_load");

    $scope.goToHome = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.home');
      CommonService.setNativeAnimation();
    };

    $scope.resetToNewPassword = function (newUser) {
      if (newUser.password == newUser.confirmPassword) {
        var ya_user_login= Parse.Object.extend("ya_user_login");
        var ya_user_login_query = new Parse.Query(ya_user_login);
        ya_user_login_query.equalTo("forgot_pass_token", product.objectId);

        ya_user_login_query.first({
          success: function (result) {
            result.save('is_deleted_from_cart', true);
            $rootScope.$broadcast('cartCount', -1);
          }
        });
      }
    };

    //mttionicapp://forgot_password_token/123456

  }

})();
