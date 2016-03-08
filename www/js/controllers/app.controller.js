(function () {
  angular.module('mttapp.controllers', [])
    .controller('AppCtrl', AppCtrl);

  function AppCtrl($scope, $rootScope, $http, $log, $ionicViewSwitcher, $ionicModal, $state, $ionicSlideBoxDelegate, $ionicHistory, $cordovaOauth, CommonService, AuthService, CartFactory) {

    $rootScope.$on('cartCount', function (event, val, exactCount) {
      if (val) {
        $scope.cartItemNumber += val;
        if ($scope.cartItemNumber < 0) {
          $scope.cartItemNumber = 0;
        }
      } else {
        $scope.cartItemNumber = 0;
      }
      if (!CommonService.getUserObjInLocalStorage() && !CommonService.getUserObjInLocalStorage().user_id) {
        $scope.cartItemNumber = 0;
      }
      if (exactCount) {
        $scope.cartItemNumber = exactCount;
      }
    });

    function getAllCartProducts() {
      CommonService.showLoader();
      CartFactory
        .getAllCartProductsFact()
        .then(function (response) {
          $scope.cartItemNumber = response.length;
          CommonService.hideLoader();
        }, function (error) {
          $log.log(error);
          CommonService.hideLoader();
        });
    }

    if (CommonService.getUserObjInLocalStorage() && CommonService.getUserObjInLocalStorage().user_id) {
      getAllCartProducts();
    } else {
      $scope.cartItemNumber = 0;
    }

    $scope.openSettings = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.settings');
      CommonService.setNativeAnimation('up');
    };

    $ionicModal.fromTemplateUrl('templates/login-signup-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.loginSignUpModal = modal;
    });

    var loginSignUpModalDelegate = $ionicSlideBoxDelegate.$getByHandle('loginSignUpDelegateHandler');

    $scope.signOut = function () {
      $rootScope.userSignedIn = false;
      CommonService.removeUserObjInLocalStorage();
      $scope.loginSignUpModal.hide();
    };

    $scope.editAppChanged = function (editApp) {
      if (editApp) {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.admin-home');
        CommonService.setNativeAnimation();
      }
    };

    $scope.openLoginModal = function () {
      $scope.loginSignUpModal.show();
      loginSignUpModalDelegate.enableSlide(false);
      loginSignUpModalDelegate.slide(0);
    };

    $rootScope.$on('login', function (event, data) {
      $scope.openLoginModal();
    });

    $scope.closeLoginSignUpModal = function () {
      $scope.loginSignUpModal.hide();
    };

    $scope.goToSignInSlide = function () {
      loginSignUpModalDelegate.slide(0);
    };
    $scope.goToSignUpSlide = function () {
      loginSignUpModalDelegate.slide(1);
    };

    $scope.goToForgotPasswordSlide = function () {
      loginSignUpModalDelegate.slide(2);
    };

    $scope.signInUser = function (userObj) {
      CommonService.showLoader();
      var ya_user_login = Parse.Object.extend("ya_user_login");
      var emailQuery = new Parse.Query(ya_user_login);

      emailQuery.equalTo("user_email", userObj.email.trim());
      emailQuery.equalTo("user_password", calcMD5(userObj.password.trim()));

      var signInQuery = Parse.Query.or(emailQuery, emailQuery).limit(1);

      signInQuery.find({
        success: function (results) {
          var response = angular.fromJson(angular.toJson(results));
          if (response.length > 0 && !response[0].is_email_verified) {
            $scope.closeLoginSignUpModal();
            CommonService.showAlert('Error', 'Please check your email for the activation link that we have sent you. Please also check spam folder in case if you will not receive activation email. Thank you for signing up with us. Please check your email for the activation link that we have sent you. Please also check spam folder in case if you will not receive activation email.');
          } else if (results.length > 0) {
            var user_details = "";
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              user_details = "User name : " + object.get('user_name') + " \n User id : " + object.get('user_id');
            }
            $log.log('Success', 'Logged in successfully. Details are ' + user_details);
            CommonService.setUserObjInLocalStorage(object);
            $scope.userObj = CommonService.getUserObjInLocalStorage();
            $rootScope.userSignedIn = true;
            $scope.closeLoginSignUpModal();
            CommonService.hideLoader();

            if (AuthService.getLoginOpenedFrom()) {
              var loginFrom = AuthService.getLoginOpenedFrom();

              switch (loginFrom) {
                case 'settings':
                  $ionicHistory.nextViewOptions({
                    disableBack: true
                  });
                  $state.go('app.home');
                  break;
                case 'cart':
                  $state.go('app.cart');
                  CommonService.setNativeAnimation('up');
                  break;
                case 'product':
                  $rootScope.$broadcast('addToCartAfterLogin');
                  $state.go('app.cart');
                  CommonService.setNativeAnimation('up');
                  break;
                default:
                  $ionicHistory.nextViewOptions({
                    disableBack: true
                  });
                  $state.go('app.home');
                  break;
              }
            }
            userObj = {};
            getAllCartProducts();
          } else {
            CommonService.showAlert('Error', 'Please enter valid email ID and password.');
          }
          CommonService.hideLoader();
        },
        error: function (error) {
          CommonService.showAlert('Error', 'Error while trying to login. Error message is : ' + error.message);
          CommonService.hideLoader();
        }
      });
    };

    function addNewUserDataToDB(userObj) {
      CommonService.showLoader();
      AuthService.addNewUserData(userObj, function (response) {
        //$scope.closeLoginSignUpModal();
        loginSignUpModalDelegate.enableSlide(false);
        loginSignUpModalDelegate.slide(0);
        CommonService.hideLoader();
        CommonService.showAlert('Success', 'Thank you for signing up with us. Please check your email for the activation link that we have sent you. Please also check spam folder, in case you can\'t find the activation email in your inbox.');
      }, function (error) {
        if (error.message) {
          CommonService.showAlert('Error', 'Error while creating the user. Error is ' + error.message);
        } else {
          CommonService.showAlert('Error', 'Error while creating the user.');
        }
        CommonService.hideLoader();
      })
    }

    function isEmailAlreadyExists(userObj) {
      CommonService.showLoader();
      AuthService.isEmailAlreadyExists(userObj, function (results) {
        if (results.length > 0) {
          CommonService.showAlert('Error', 'This email already exists. Please use another email address.');
        } else {
          addNewUserDataToDB(userObj);
        }
        CommonService.hideLoader();
      }, function (error) {
        CommonService.showAlert('Error', 'Error while creating the user. Error is ' + error.message);
        CommonService.hideLoader();
      });

    }

    $scope.signInWithFacebook = function () {
      $cordovaOauth.facebook("1044939798861179", ["public_profile", "email"])
        .then(function (response) {
          $log.log(JSON.stringify(response));
          var expires_in = Number(response.expires_in) * 1000;
          var expires_in_date = new Date(expires_in);
          var fb_expiration_date = new Date();
          fb_expiration_date.setMonth(expires_in_date.getMonth());
          fb_expiration_date.setDate(expires_in_date.getDate());

          $log.log('Expires on : ', fb_expiration_date);

          var app_id = "145034519587836600";
          var ya_user_login = Parse.Object.extend("ya_user_login");
          var ya_user_login_obj = new ya_user_login();

          ya_user_login_obj.set("is_signed_up_via_fb", CommonService.generateUID());
          ya_user_login_obj.set("fb_token", response.access_token);
          ya_user_login_obj.set("fb_expires_on", fb_expiration_date);
          ya_user_login_obj.set("app_id", app_id);

          ya_user_login_obj.save(null, {
            success: function (response) {
              $log.log('Logged in via FB and details saved in DB');
            },
            error: function (error) {
              $log.log('Error while trying to save login details via FB');
            }
          });

        }, function (error) {
          $log.log(error);
        });
    };

    $scope.createNewUser = function (userObj) {
      isEmailAlreadyExists(userObj);
    };

    function sendResetPwdEmail(forgotPwdToken) {
      CommonService.showLoader();
      var url = "https://www.right-click.in/yellowapps_payment_gateway/send_forgot_password_email.php?app_id=145034519587836600&forgot_pass_token=" + forgotPwdToken + "&v=" + CommonService.generateUID();

      $http({
        method: 'GET',
        url: url
      }).then(function (response) {
        if (response.data.code == 200) {
          CommonService.hideLoader();
          CommonService.showAlert("Success", "We've sent you an email to reset your password");
          //$scope.closeLoginSignUpModal();
          loginSignUpModalDelegate.enableSlide(false);
          loginSignUpModalDelegate.slide(0);
        }
      }, function (error) {
        $log.log(error);
        CommonService.hideLoader();
        CommonService.showAlert('Error', 'Email ID does not exist.');
      })
    }

    $scope.sendEmailForPasswordReset = function (userObj) {
      CommonService.showLoader();
      if (userObj.email) {
        var checkUserClass = Parse.Object.extend("ya_user_login");
        var checkUserQuery = new Parse.Query(checkUserClass);
        checkUserQuery.equalTo('user_email', userObj.email);
        checkUserQuery.limit(1);

        checkUserQuery.first({
          success: function (result) {
            var parsedResult = angular.toJson(result);
            $log.log(parsedResult);
            if (!parsedResult) {
              CommonService.hideLoader();
              CommonService.showAlert('Error', 'Email ID does not exist.');
            }
            if (angular.fromJson(parsedResult).user_email == userObj.email) {
              var forgotPwdToken = CommonService.generateUID();
              result.save('forgot_pass_token', forgotPwdToken.toString());
              sendResetPwdEmail(forgotPwdToken);
            } else {
              CommonService.showAlert('Error', 'Email ID does not exist.');
              CommonService.hideLoader();
            }
          },
          error: function (error) {
            $log.log("Error: " + error.code + " " + error.message);
            CommonService.showAlert('Error', 'Email ID does not exist.');
            CommonService.hideLoader();
          }
        });
      } else {

      }
    };

    $scope.goToCartPage = function () {
      AuthService.setLoginOpenedFrom('cart');
      if (CommonService.getUserObjInLocalStorage() && CommonService.getUserObjInLocalStorage().user_id) {
        /*$ionicHistory.nextViewOptions({
          disableBack: true
        });*/
        $state.go('app.cart');
        CommonService.setNativeAnimation();
        //CommonService.setNativeAnimation('up');
      } else {
        $scope.openLoginModal();
      }
    };


  }

})();
