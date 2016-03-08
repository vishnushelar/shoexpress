(function () {
  angular.module('mttapp.controllers')
    .controller('HomeCtrl', HomeCtrl);

  function HomeCtrl($scope, $rootScope, $state, $log, $http, $ionicSlideBoxDelegate, $ionicScrollDelegate, $timeout, $ImageCacheFactory, CommonFactory, CommonService, HomeService, urls, CartFactory, $cordovaNetwork) {

    $scope.homePageData = {};
    $scope.showCancel = false;
    $scope.searchText = '';
    $scope.tabs = [];
    $scope.activeTabObj = '';
    $rootScope.searchProduct = '';

    var scrollTo = 0;

    $rootScope.hideHeader = false;

    if (HomeService.getAppHeading()) {
      $scope.appHeading = HomeService.getAppHeading();
    }

    CommonService.setIpAddress();

    function getAllImages(response) {
      var allImagesInData = [];

      allImagesInData.push(response.app_json.pages[0].page_icon);
      allImagesInData.push(response.app_json.app_info.app_icon);

      var data = response.app_json.pages[0].sections;
      _.each(data, function (data) {
        if (data.sub_section_data) {
          _.each(data.sub_section_data, function (sub_section_data) {
            allImagesInData.push(sub_section_data.obj_img_url);
            if (sub_section_data.section_data) {
              _.each(sub_section_data.section_data, function (section_data) {
                allImagesInData.push(section_data.obj_img_url);
                allImagesInData.push(section_data.obj_showcase_img_url);
                if (section_data.product_img_attributes) {
                  _.each(section_data.product_img_attributes, function (product_img_attributes) {
                    allImagesInData.push(product_img_attributes.product_pic);
                  })
                }
              })
            }
          });
        }
        if (data.section_data) {
          _.each(data.section_data, function (section_data) {
            allImagesInData.push(section_data.obj_img_url);
            allImagesInData.push(section_data.obj_showcase_img_url);
            if (section_data.product_img_attributes) {
              _.each(section_data.product_img_attributes, function (product_img_attributes) {
                allImagesInData.push(product_img_attributes.product_pic);
              })
            }
          });
        }
      });

      if (navigator.onLine) {
        $ImageCacheFactory
          .Cache(allImagesInData)
          .then(function (response) {
            console.log("All images caching done loading!");
          }, function (error) {
            console.log("An image failed caching : " + error);
          });
      }

    }

    function prepareData(response) {
      getAllImages(response);
      $scope.wholeData = response.app_json;

      HomeService.setAppHeading(response.app_json.app_info.app_name);
      $scope.appHeading = HomeService.getAppHeading();
      angular.forEach($scope.wholeData.pages[0].sections, function (val, key) {
        $scope.tabs.push(val.section_name);
      });

      $scope.activeTabObj = $scope.tabs[0];
      $timeout(function () {
        $ionicSlideBoxDelegate.$getByHandle('homePageDelegate').update();
        $ionicScrollDelegate.$getByHandle('tabsMenu');
      })
    }

    function loadJsonFromParse() {
      CommonService.showLoader();
      var getWholeData = new Parse.Query(Parse.Object.extend("ya_apps_products_json"));
	  getWholeData.equalTo("app_id", urls.appId);
	  getWholeData.limit(1);
	  
      var isOnline = navigator.onLine;
      //var isOnline = $cordovaNetwork.isOnline() || navigator.onLine;
      if (isOnline) {
        getWholeData.find({
          success: function (results) {
            var lastUpdatedDate = angular.fromJson(results[0].get('updatedAt'));
            var wholeJson = angular.fromJson(results[0].get('products_listing_json'));

            if (HomeService.getJsonLastModifiedInLocal() && (HomeService.getJsonLastModifiedInLocal() == lastUpdatedDate)) {
              $log.log('JSON from local : ', HomeService.getJsonInLocal());
              prepareData(HomeService.getJsonInLocal());
            } else {
              $log.log('JSON from server : ', wholeJson);
              HomeService.setJsonInLocal(wholeJson);
              prepareData(wholeJson);
            }
            HomeService.setJsonLastModifiedInLocal(lastUpdatedDate);
            CommonService.hideLoader();
          },
          error: function (error) {
            $log.log('Failed to create new object, with error code: ' + error.message);
            CommonService.hideLoader();
          }
        });
      } else {
        $log.log('Not online');
        if (HomeService.getJsonInLocal()) {
          prepareData(HomeService.getJsonInLocal());
        } else {
          CommonService.showAlert('Error!', 'Error while retrieving the data from the server.');
        }
      }
    }

    loadJsonFromParse();

    $scope.continueShoppingSearch = function (index) {
      setTimeout(function () {
        var myElement = document.getElementById('cancelBtn' + index);
        angular.element(myElement).triggerHandler('click');
      });
      //CommonService.hideKeyboard();
      $scope.showCancel = false;
    };

    $scope.goToProductsListPage = function (data, toState) {
      HomeService.setSelectedProductData(data);
      $state.go(toState);
      CommonService.setNativeAnimation();
    };

    $scope.showProductDetails = function (details, toState) {
      HomeService.setProductDetails(details);
      $state.go(toState);
      CommonService.setNativeAnimation();
    };

    $scope.homePageSlideHasChanged = function (slideNo) {
      CommonService.hideKeyboard();
      $scope.showCancel = false;

      setTimeout(function () {
        var myElement = document.getElementById('cancelBtn' + slideNo);
        angular.element(myElement).triggerHandler('click');
        CommonService.hideKeyboard();
        document.getElementById("searchBox").blur();
      });

      $scope.activeTabObj = $scope.tabs[slideNo];
      scrollTo = (slideNo * 80);
      $ionicScrollDelegate.$getByHandle('tabsMenu').scrollTo(scrollTo, 0, true);
      HomeService.setPrevTabScrollPosition(slideNo, scrollTo);
    };

    $scope.changeState = function (toState) {
      $state.go(toState);
      CommonService.setNativeAnimation();
    };

  }

})();
