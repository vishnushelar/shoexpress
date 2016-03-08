angular.module('mttapp.services')
  .service('AuthService', AuthService);

function AuthService($ionicPopup, $log,$ionicLoading, $http, CommonService) {

  this.loginFrom;

  this.isEmailAlreadyExists = function (userObj, scb, ecb) {
    var emailId = userObj.email;
    var ya_user_login = Parse.Object.extend("ya_user_login");
    var query = new Parse.Query(ya_user_login);
    query.equalTo("user_email", emailId);
    query.limit(1);

    query.find({
      success: function (results) {
        scb(results);
      },
      error: function (error) {
        ecb(error);
      }
    });
  };


  function sendNewUserVerificationEmail(scb, ecb, userId, emailVerificationToken, response) {
    CommonService.showLoader();
    var url = "https://www.right-click.in/yellowapps_payment_gateway/send_user_verification_email.php?app_id=145034519587836600&user_id=" + userId + "&email_verification_token=" + emailVerificationToken;
    $http({
      method: 'GET',
      url: url
    }).then(function (response) {
      if (response.data.code == 200) {
        scb(response);
      }
    }, function (error) {
      $log.log(error);
      ecb(error);
    })
  }

  this.addNewUserData = function (userObj, scb, ecb) {
    var app_id = "145034519587836600";
    var ya_user_login = Parse.Object.extend("ya_user_login");
    var ya_user_login_obj = new ya_user_login();
    var userId = (CommonService.generateUID()).toString();
    var emailVerificationToken = (CommonService.generateUID()).toString();

    ya_user_login_obj.set("user_id", userId);
    ya_user_login_obj.set("user_name", userObj.name.trim());
    ya_user_login_obj.set("user_email", userObj.email.trim());
    ya_user_login_obj.set("user_password", calcMD5(userObj.password.trim()));
    ya_user_login_obj.set("is_email_verified", false);
    ya_user_login_obj.set("email_verification_token", emailVerificationToken);
    ya_user_login_obj.set("is_merchant", false);
    ya_user_login_obj.set("is_signed_up_via_fb", false);
    ya_user_login_obj.set("app_id", app_id);

    ya_user_login_obj.save(null, {
      success: function (response) {
        $log.log(response);
        sendNewUserVerificationEmail(scb, ecb, userId, emailVerificationToken, response);
      },
      error: function (error) {
        ecb(error);
      }
    });
  };

  this.setLoginOpenedFrom = function (val) {
    this.loginFrom = val;
  };
  this.getLoginOpenedFrom = function (val) {
    return this.loginFrom;
  };

}
