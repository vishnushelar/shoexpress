// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'mttapp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'mttapp.controllers' is found in controllers.js

var handleOpenURL = function (url) {
  console.log('url', url);
  window.localStorage.setItem("mtt_external_url_load", 'reset_pwd');
};

angular.module('mttapp', [
  'ionic',
  'ngCordova',
  'ngResource',
  'ionic.ion.imageCacheFactory',
  'tabSlideBox',
  'mttapp.controllers',
  'mttapp.constants',
  'mttapp.directives',
  'mttapp.services',
  'mttapp.factories',
  'mttapp.filters'
])

  .run(function ($ionicPlatform, $cordovaStatusbar, $rootScope, $ionicHistory, $state, $log, urls, CommonService) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)

      $cordovaStatusbar.overlaysWebView(true);
      $cordovaStatusbar.style(1);

      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
//        StatusBar.styleDefault();
        $log.log("status bar plugin is installed.");

      }

      setTimeout(function () {
        if (window.localStorage.getItem("mtt_external_url_load")) {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go("app.reset-password");
          CommonService.setNativeAnimation();
        }
      });

      //Parse.initialize(urls.parse_applicationId, urls.parse_javaScriptKey, urls.parse_masterKey);

      // then override any default you want
      window.plugins.nativepagetransitions.globalOptions.duration = 350;
      window.plugins.nativepagetransitions.globalOptions.iosdelay = 200;
      window.plugins.nativepagetransitions.globalOptions.androiddelay = 200;
      window.plugins.nativepagetransitions.globalOptions.winphonedelay = 200;
      window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 8;
      // these are used for slide left/right only currently
      window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
      window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;

    });

    //Parse.initialize(urls.parse_applicationId, urls.parse_javaScriptKey, urls.parse_masterKey);

    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromStateParams) {
      if (toState.name === 'app.home' || toState.name === 'app.admin-home') {
        $rootScope.showSettingsButton = true;
        setTimeout(function () {
          $rootScope.showSettingsButton = true;
        }, 200);

      } else {
        $rootScope.showSettingsButton = false;
      }
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toStateParams, fromState, fromStateParams) {
    });

    $rootScope.$on('$stateChangeError', function (event, toState, toStateParams, fromState, fromStateParams) {
    });

  })

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, $logProvider, $compileProvider) {

    $ionicConfigProvider.scrolling.jsScrolling(false);
    $ionicConfigProvider.views.maxCache(5);
    $logProvider.debugEnabled(false);
    $compileProvider.debugInfoEnabled(false);
    $ionicConfigProvider.views.transition('none');

    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl',
        cache: false
      })
      .state('app.reset-password', {
        url: '/reset-password',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/reset-password.html',
            controller: 'ResetPasswordCtrl'
          }
        }
      })
      .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
          }
        }
      })
      .state('app.admin-home', {
        url: '/admin-home',
        views: {
          'menuContent': {
            templateUrl: 'templates/admin-home.html',
            controller: 'AdminHomeCtrl'
          }
        }
      })
      .state('app.products-list', {
        url: '/products-list',
        views: {
          'menuContent': {
            templateUrl: 'templates/products-list.html',
            controller: 'ProductsListCtrl'
          }
        }
      })
      .state('app.product-details', {
        url: '/product-details',
        views: {
          'menuContent': {
            templateUrl: 'templates/product-details.html',
            controller: 'ProductDetailsCtrl'
          }
        },
        cache: false
      })
      .state('app.cart', {
        url: '/cart',
        views: {
          'menuContent': {
            templateUrl: 'templates/cart.html',
            controller: 'CartCtrl'
          }
        },
        cache: false
      })
      .state('app.edit-cart', {
        url: '/edit-cart',
        views: {
          'menuContent': {
            templateUrl: 'templates/edit-cart.html',
            controller: 'EditCartCtrl'
          }
        },
        cache: false
      })
      .state('app.settings', {
        url: '/settings',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })
      .state('app.notifications', {
        url: '/notifications',
        views: {
          'menuContent': {
            templateUrl: 'templates/notifications.html',
            controller: 'NotificationsCtrl'
          }
        }
      })
      .state('app.orders', {
        url: '/orders',
        views: {
          'menuContent': {
            templateUrl: 'templates/orders.html',
            controller: 'OrdersCtrl'
          }
        }
      })
      .state('app.order-details', {
        url: '/order-details',
        views: {
          'menuContent': {
            templateUrl: 'templates/order-details.html',
            controller: 'OrderDetailsCtrl'
          }
        }
      })
      .state('app.shipping-payment', {
        url: '/shipping-payment',
        views: {
          'menuContent': {
            templateUrl: 'templates/shipping-payment.html',
            controller: 'ShippingPaymentCtrl'
          }
        }
      })
      .state('app.shipping-addresses', {
        url: '/shipping-addresses',
        views: {
          'menuContent': {
            templateUrl: 'templates/shipping-addresses.html',
            controller: 'ShippingAddressesCtrl'
          }
        }
      })
      .state('app.select-shipping-address', {
        url: '/select-shipping-address',
        views: {
          'menuContent': {
            templateUrl: 'templates/select-shipping-address.html',
            controller: 'ShippingAddressesCtrl'
          }
        }
      })

      .state('app.add-shipping', {
        url: '/add-shipping',
        views: {
          'menuContent': {
            templateUrl: 'templates/add-edit-shipping.html',
            controller: 'AddEditShippingCtrl'
          }
        }
      })
      .state('app.add-payment', {
        url: '/add-payment',
        views: {
          'menuContent': {
            templateUrl: 'templates/add-payment.html',
            controller: 'AddPaymentCtrl'
          }
        }
      })
      .state('app.shipping-information', {
        url: '/shipping-information',
        views: {
          'menuContent': {
            templateUrl: 'templates/shipping-information.html',
            controller: 'ShippingInformationCtrl'
          }
        },
        cache: false
      })
      .state('app.review-order', {
        url: '/review-order',
        views: {
          'menuContent': {
            templateUrl: 'templates/review-order.html',
            controller: 'ReviewOrderCtrl'
          }
        },
        cache: false
      })
      .state('app.order-summary', {
        url: '/order-summary',
        views: {
          'menuContent': {
            templateUrl: 'templates/order-summary.html',
            controller: 'OrderSummaryCtrl'
          }
        }
      })
      .state('app.payment', {
        url: '/payment',
        views: {
          'menuContent': {
            templateUrl: 'templates/payment.html',
            controller: 'PaymentCtrl'
          }
        }
      })
      .state('app.privacy', {
        url: '/privacy',
        views: {
          'menuContent': {
            templateUrl: 'templates/privacy-policy.html'
          }
        }
      })
      .state('app.terms', {
        url: '/terms',
        views: {
          'menuContent': {
            templateUrl: 'templates/terms.html'
          }
        }
      })
      .state('app.returns', {
        url: '/returns',
        views: {
          'menuContent': {
            templateUrl: 'templates/returns.html'
          }
        }
      })
      .state('app.cancellation', {
        url: '/cancellation',
        views: {
          'menuContent': {
            templateUrl: 'templates/cancellation.html'
          }
        }
      })
      .state('app.add-item', {
        url: '/add-item',
        views: {
          'menuContent': {
            templateUrl: 'templates/add-item.html',
            controller: 'AddItemCtrl'
          }
        }
      })
      .state('app.add-section', {
        url: '/add-section',
        views: {
          'menuContent': {
            templateUrl: 'templates/add-edit-section.html',
            controller: 'AddEditSectionCtrl'
          }
        }
      })
      .state('app.edit-section', {
        url: '/edit-section',
        views: {
          'menuContent': {
            templateUrl: 'templates/add-edit-section.html',
            controller: 'AddEditSectionCtrl'
          }
        }
      })
      .state('app.add-category', {
        url: '/add-category',
        views: {
          'menuContent': {
            templateUrl: 'templates/add-edit-category.html',
            controller: 'AddEditCategoryCtrl'
          }
        }
      })
      .state('app.edit-category', {
        url: '/edit-category',
        views: {
          'menuContent': {
            templateUrl: 'templates/add-edit-category.html',
            controller: 'AddEditCategoryCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');


    $httpProvider.interceptors.push(function ($q, $injector, $log) {
      return {
        requestError: function (req) {
          $log.log(res);
          if (req.url.indexOf('.html') < 0) {
            cordova.plugins.Keyboard.close();
          }
          return $q.reject(req);
        },
        responseError: function (res) {
          $log.log(res);
          if (res.config.url.indexOf('.html') < 0) {
            var popup = $injector.get('$ionicPopup');
            var loader = $injector.get('CommonService');

            if (res.status === 500) {
              loader.hideLoader();
              popup.alert({
                title: 'Server Error',
                template: 'Oops! We are sorry, the server has ran into trouble while fulfilling your request. Please try again after some time.'
              });
            } else if (res.status === 0) {
              loader.hideLoader();
              popup.alert({
                title: 'Device is offline',
                template: 'Please try again when you are connected to the internet.'
              });
            }
          }
          //return $q.reject(res);
        }
      };
    });
  });
