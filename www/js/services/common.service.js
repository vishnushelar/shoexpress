angular.module('mttapp.services', [])
  .service('CommonService', CommonService);

function CommonService($ionicPopup, $ionicLoading, $http, $log) {
  this.currentSlide = 0;
  this.isLoggedIn;

  this.setImageSliderCount = function (index) {
    this.currentSlide = index;
  };
  this.getImageSliderCount = function () {
    return this.currentSlide;
  };

  this.showKeyboard = function () {
    try {
      cordova.plugins.Keyboard.show();
    } catch (e) {
      $log.log('Error while trying to access the keyboard');
    }
  };
  this.hideKeyboard = function () {
    try {
      cordova.plugins.Keyboard.close();
    } catch (e) {
      $log.log('Error while trying to access the keyboard');
    }
  };

  this.showLoader = function (text) {
    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner>'
    });
  };
  this.hideLoader = function () {
    $ionicLoading.hide();
  };

  this.showAlert = function (title, body) {
    $ionicPopup.alert({
      title: title,
      template: body
    });
  };

  this.setIpAddress = function () {
    $http.get('http://ipv4.myexternalip.com/json')
      .then(function (result) {
        localStorage.setItem('mtt_user_ip', result.data.ip);
      }, function (e) {
        $log.log("Error while getting the ip address of this device.");
      });

  };

  this.getIpAddress = function () {
    return localStorage.getItem('mtt_user_ip');
  };

  this.generateUID = function () {
    var max = 99999;
    var min = 10000;

    var d = new Date();
    var n = d.valueOf();
    n = n + "" + parseInt(Math.random() * (max - min) + min);

    n = parseFloat(n);

    return n;
  };

  this.showPopup = function (title, msg, cb) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: msg
    });
    alertPopup.then(function (res) {
      if (cb) {
        cb();
      }
    });
  };

  this.isMobile = function () {
    return (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i));
  };

  this.getMobileDevice = function () {
    var device = '';
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (userAgent.match(/Android/i)) {
      device = 'Android';
    } else if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
      device = 'iPhone';
    } else {
      device = 'Browser';
    }
    return device;
  };

  this.setUserObjInLocalStorage = function (obj) {
    localStorage.setItem('mtt_user_obj', JSON.stringify(obj));
  };
  this.getUserObjInLocalStorage = function () {
    return JSON.parse(localStorage.getItem('mtt_user_obj'));
  };
  this.removeUserObjInLocalStorage = function () {
    localStorage.removeItem('mtt_user_obj');
  };


  this.setLoggedInStatus = function (val) {
    this.isLoggedIn = val;
  };
  this.getLoggedInStatus = function () {
    return this.isLoggedIn;
  };

  this.setNativeAnimation = function (val) {
    var animationDirection = 'left';
    if (val) {
      animationDirection = val;
    }

    window.plugins.nativepagetransitions.slide(
      {"direction": animationDirection},
      function (msg) {
        $log.log("Animation success : " + msg)
      }, // called when the animation has finished
      function (msg) {
        $log.log("Animation error : " + msg)
      } // called in case you pass in weird values
    );
  };

}
