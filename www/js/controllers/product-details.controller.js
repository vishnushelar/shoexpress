(function () {
  angular.module('mttapp.controllers')
    .controller('ProductDetailsCtrl', ProductDetailsCtrl);

  function ProductDetailsCtrl($scope, $log,$rootScope, $ionicModal, $state, $timeout, $ionicScrollDelegate, $ionicHistory, $ionicSlideBoxDelegate, $cordovaSocialSharing, CommonFactory, CommonService, HomeService, ScrollService, urls, CartService, AuthService) {

    $scope.showDescription = true;
    $scope.productDetails = {};

    $scope.$on('$ionicView.beforeEnter', function () {
      $ionicSlideBoxDelegate.$getByHandle('product_img_slidebox_dh').update();
    });

    $scope.openLoginModal = function () {
      $rootScope.$broadcast('login');
    };

    $scope.productDetails = HomeService.getProductDetails();

    $scope.toggleDescription = function () {
      $scope.showDescription = !$scope.showDescription;
    };

    $scope.setStylesForColor = function (color) {
      var borderColor = color;
      var whiteColors = ['#fff', '#ffffff', '#FFF', '#FFFFFF', 'white', 'transparent'];
      if (whiteColors.indexOf(color) >= 0) {
        borderColor = '#aaa';
      }
      return {
        backgroundColor: color,
        borderColor: borderColor
      };
    };

    var imageDetailSliderDelegate;

    setTimeout(function () {
      imageDetailSliderDelegate = $ionicSlideBoxDelegate.$getByHandle("product_img_slidebox_dh");
      imageDetailSliderDelegate.update();
    }, 100);

    $scope.quantitySelected = function (quantity) {
      $scope.selectedQuantity = quantity;
    };

    if ($scope.productDetails && $scope.productDetails.product_img_attributes[0]) {
      $scope.selectedImage = $scope.productDetails.product_img_attributes[0].product_pic;
    }

    $scope.colorSelected = function (color) {
      var selectedImageIndex = 0;
      angular.forEach($scope.productDetails.product_img_attributes, function (val, key) {
        if (val.color_value == color) {
          selectedImageIndex = key;
          $scope.selectedImage = val.product_pic;
          $log.log($scope.selectedImage);
        }
      });
      imageDetailSliderDelegate.slide(selectedImageIndex);
      $scope.selectedColor = color;
    };

    $ionicModal.fromTemplateUrl('templates/image-detail-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.imageDetailsModal = modal;
    });

    var imageModalDelegate = $ionicSlideBoxDelegate.$getByHandle('imageModalDelegateHandle');

    $scope.imageDetailsSlideHasChanged = function (val) {
      CommonService.setImageSliderCount(val);
    };

    $scope.openImageDetailsModal = function () {
      $scope.imageDetailsModal.show();
      setTimeout(function () {
        imageModalDelegate.slide(CommonService.getImageSliderCount());
      }, 150);
    };

    $scope.closeImageDetailsModal = function () {
      $scope.imageDetailsModal.hide();
    };

    function addSelectedItemToCart() {
      var ya_user_cart = Parse.Object.extend("ya_user_product_cart");
      var cartProduct = new ya_user_cart();

      cartProduct.set("product_id", $scope.productDetails.obj_id);
      cartProduct.set("product_title", $scope.productDetails.obj_title);
      cartProduct.set("product_desc", $scope.productDetails.obj_desc);
      cartProduct.set("product_image", $scope.selectedImage);
      cartProduct.set("original_price", $scope.productDetails.obj_orig_price);
      cartProduct.set("discounted_price", $scope.productDetails.obj_discounted_price);
      cartProduct.set("currency_logo", "&#8377;");
      cartProduct.set("quantity", $scope.selectedQuantity);
      cartProduct.set("selected_attributes", [{"Color": $scope.selectedColor}]);
      cartProduct.set("ip_address", CommonService.getIpAddress());
      cartProduct.set("is_deleted_from_cart", false);
      cartProduct.set("app_id", urls.appId);
      cartProduct.set("user_id", CommonService.getUserObjInLocalStorage().user_id);

      cartProduct.save(null, {
        success: function (response) {
          $log.log('Success', 'New address created with objectId : ' + response.id);
          CommonService.hideLoader();
          $state.go('app.cart');
          CommonService.setNativeAnimation();
        },
        error: function (response, error) {
          CommonService.showAlert('Error', 'Error while creating the address. Error is ' + error.message);
          CommonService.hideLoader();
        }
      });
    }

    $rootScope.$on('addToCartAfterLogin', function (event) {
      addSelectedItemToCart();
    });


    $scope.addToCart = function () {
      AuthService.setLoginOpenedFrom('product');
      if (($scope.selectedColor && $scope.selectedQuantity && $scope.productDetails.product_attributes.length > 0) || ($scope.selectedQuantity && $scope.productDetails.product_attributes.length == 0)) {
        if (CommonService.getUserObjInLocalStorage() && CommonService.getUserObjInLocalStorage().user_id) {
          CartService.setShowItemAddedAtCart(false);
          CommonService.showLoader();
          addSelectedItemToCart();
        } else {
          CartService.setShowItemAddedAtCart(true);
          $scope.openLoginModal();
        }
      } else {
        if ($scope.selectedColor && !$scope.selectedQuantity && $scope.productDetails.product_attributes.length > 0) {
          CommonService.showAlert('Oh snap!', 'Please select quantity and try adding the item again.');
        } else if (!$scope.selectedColor && $scope.selectedQuantity && $scope.productDetails.product_attributes.length > 0) {
          CommonService.showAlert('Oh snap!', 'Please select color and try adding the item again.');
        } else if ($scope.productDetails.product_attributes.length > 0) {
          CommonService.showAlert('Oh snap!', 'Please select color and quantity and try adding the item again.');
        } else {
          CommonService.showAlert('Oh snap!', 'Please select quantity and try adding the item again.');
        }
      }
    };

    $scope.shareTheProduct = function (socialType, obj) {

      var obj_title = obj.obj_title.replace(/(<([^>]+)>)/ig, "");
      var obj_desc = obj.obj_desc.replace(/(<([^>]+)>)/ig, "");
      var link = '';

      switch (socialType) {
        case 'facebook':
          $cordovaSocialSharing
            .shareViaFacebook(obj_title, obj.obj_img_url, link)
            .then(function (result) {
              $log.log('Successfully shared via facebook');
            }, function (err) {
              $log.log('Error while sharing via facebook');
            });
          break;

        case 'twitter':
          $cordovaSocialSharing
            .shareViaTwitter(obj_title, obj.obj_img_url, link)
            .then(function (result) {
              $log.log('Successfully shared via twitter');
            }, function (err) {
              $log.log('Error while sharing via twitter');
            });
          break;

        case 'whatsapp':
          $cordovaSocialSharing
            .shareViaWhatsApp(obj_title, obj.obj_img_url, link)
            .then(function (result) {
              $log.log('Successfully shared via whatsapp');
            }, function (err) {
              $log.log('Error while sharing via whatsapp');
            });
          break;

        case 'instagram':
          break;

        case 'chatbubble':
          $cordovaSocialSharing
            .shareViaSMS(obj_title, '')
            .then(function (result) {
              $log.log('Successfully shared via message');
            }, function (err) {
              $log.log('Error while sharing via message');
            });
          break;

        case 'chatwithus':
          $cordovaSocialSharing
            .shareViaSMS(obj_title, '+919920969124')
            .then(function (result) {
              $log.log('Successfully shared via message');
            }, function (err) {
              $log.log('Error while sharing via message');
            });
          break;

        case 'email':

          $cordovaSocialSharing
            .shareViaEmail(obj_desc, obj_title, [], ['info@mtt.co.in'], [], '')
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


    try {
      $timeout(function () {
        var sv = $ionicScrollDelegate.$getByHandle('quantity_scroll_delegate').getScrollView();
        ScrollService.handleScroll(sv);
      });
      $timeout(function () {
        var sv = $ionicScrollDelegate.$getByHandle('color_scroll_delegate').getScrollView();
        ScrollService.handleScroll(sv);
      });
      $timeout(function () {
        var sv = $ionicScrollDelegate.$getByHandle('share_scroll_delegate').getScrollView();
        ScrollService.handleScroll(sv);
      });
    } catch (e) {
      $log.log('Error in scrolling : HomeCtrl')
    }

    var colorScrollDelegate = $ionicScrollDelegate.$getByHandle('color_scroll_delegate');
    var quantityScrollDelegate = $ionicScrollDelegate.$getByHandle('quantity_scroll_delegate');
    var shareScrollDelegate = $ionicScrollDelegate.$getByHandle('share_scroll_delegate');

    $scope.moveLeftForColors = function () {
      colorScrollDelegate.scrollBy(-100, 0, true);
    };
    $scope.moveRightForColors = function () {
      colorScrollDelegate.scrollBy(100, 0, true);
    };
    $scope.moveLeftForQuantity = function () {
      quantityScrollDelegate.scrollBy(-100, 0, true);
    };
    $scope.moveRightForQuantity = function () {
      quantityScrollDelegate.scrollBy(100, 0, true);
    };

  }

})();
