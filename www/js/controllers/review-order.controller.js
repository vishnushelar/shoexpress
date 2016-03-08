(function () {
  angular.module('mttapp.controllers')
    .controller('ReviewOrderCtrl', ReviewOrderCtrl);

  function ReviewOrderCtrl($scope, $rootScope, $log, $ionicModal, $timeout, $state, $ionicHistory, $ionicSlideBoxDelegate, $ionicScrollDelegate, $cordovaInAppBrowser, CommonFactory, CartService, CommonService, urls) {

    $scope.allCartProducts = CartService.getAllCartProducts();
    $scope.shippingAddress = CartService.getShippingAddress();
    $scope.deliveryTypeCharge = CartService.getDeliveryTypeCharge();
    $scope.totalCartDiscountPrice = CartService.getTotalCartDiscountPrice() || CartService.getTotalCartOriginalPrice();
    $scope.orderId;

    $scope.changeState = function (toState) {
      $state.go(toState);
      CommonService.setNativeAnimation();
    };

    function deleteFromUserOrderDetails(orderId) {
      var prodCount = 0;
      var deletedProdCount = 0;

      var ya_user_orders_details = Parse.Object.extend("ya_user_orders_details");
      var cartProduct = new Parse.Query(ya_user_orders_details);
      cartProduct.equalTo('order_id', orderId);

      cartProduct.find({
        success: function (results) {
          var results1 = angular.toJson(results);
          var results2 = angular.fromJson(results);
          prodCount = results.length;
          angular.forEach(results, function (val, key) {
            val.save('is_deleted_from_cart', true);
            deletedProdCount += 1;
            if (prodCount == deletedProdCount) {
              $log.log('All the products deleted from the ya_user_orders_details');
              CommonService.hideLoader();
            }
          });
        },
        error: function (error) {
          $log.log("Error: " + error.code + " " + error.message);
          CommonService.hideLoader();
        }
      });
    }

    function deleteFromCart(orderId) {
      var cartProducts = $scope.allCartProducts.length;
      var count = 0;
      angular.forEach($scope.allCartProducts, function (val, key) {
        if (!val.is_deleted_from_cart) {
          var ya_user_cart = Parse.Object.extend("ya_user_product_cart");
          var query = new Parse.Query(ya_user_cart);
          query.equalTo("objectId", val.objectId);

          query.first({
            success: function (result) {
              result.save('is_deleted_from_cart', true);
              count += 1;
              if (count == cartProducts) {
                $log.log('All Products deleted from the cart.');
                deleteFromUserOrderDetails(orderId);
              }
            }
          });
        }
      });
    }

    function getCardNumberFromDB(transactionId) {
      CommonService.showLoader();
      var getCardClass = Parse.Object.extend("ya_user_order_pg_details");
      var getCardQuery = new Parse.Query(getCardClass);
      getCardQuery.equalTo('transaction_id', transactionId);
      getCardQuery.containedIn('mode', ['CC', 'NB', 'DC']);

      getCardQuery.find({
        success: function (results) {
          var result1 = angular.toJson(results);
          var result = angular.fromJson(result1);

          CommonService.hideLoader();
          if (result.length > 0) {
            if (result[0].mode == 'CC') {
              CartService.setPaymentMode('CC');
              CartService.setCardNumber(result[0].cardnum);
            } else if (result[0].mode == 'NB') {
              CartService.setPaymentMode('NB');
              CartService.setCardNumber('');
            } else if (result[0].mode == 'DC') {
              CartService.setPaymentMode('DC');
              CartService.setCardNumber('');
            }
          }
          $state.go('app.order-summary');
          CommonService.setNativeAnimation();
        },
        error: function (error) {
          $log.log("Error: " + error.code + " " + error.message);
          CommonService.hideLoader();
          CartService.setCardNumber('');
        }
      });
    }

    function openPaymentWindow(orderId) {
      CartService.setOrderId(orderId);
      if (CommonService.isMobile()) {
        var url = 'https://www.right-click.in/yellowapps_payment_gateway/payment_gateway_init.php?app_id=' + urls.appId + '&order_id=' + orderId + '&user_id=' + CommonService.getUserObjInLocalStorage().user_id + '&mode=test&v=' + CommonService.generateUID();

        var options = {
          location: 'yes',
          clearcache: 'yes'
        };
        $cordovaInAppBrowser
          .open(url, '_blank', options)
          .then(function (event) {
            $log.log('success : ', event);
          })
          .catch(function (event) {
            $log.log('error : ', event);
          });
      } else {
        $log.log('Not a mobile device');
      }
    }

    $rootScope.$on('$cordovaInAppBrowser:loadstart', function (e, event) {
      if (event.url.indexOf('payment_gateway_end.php') > 0) {
        $cordovaInAppBrowser.close();
      }
    });

    $rootScope.$on('$cordovaInAppBrowser:exit', function (e, event) {
      $log.log('$cordovaInAppBrowser:exit');
      CommonService.showLoader();

      var allCartProductsClass = Parse.Object.extend("ya_user_orders");
      var cartProductsQuery = new Parse.Query(allCartProductsClass);
      cartProductsQuery.equalTo('user_id', CommonService.getUserObjInLocalStorage().user_id);
      cartProductsQuery.equalTo('order_id', CartService.getOrderId());

      cartProductsQuery.find({
        success: function (results) {
          var result1 = angular.toJson(results);
          var result = angular.fromJson(result1);
          var transactionId = result[0].transaction_id;

          if (result[result.length - 1].is_success) {
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            deleteFromCart(result[0].order_id);
            getCardNumberFromDB(transactionId);
            $log.log('Transaction ID - ' + transactionId, 'Your payment was successful.');
          } else if (result[0].is_failed) {
            CommonService.showAlert('Transaction ID - ' + transactionId, ' Your payment was not successful. Please try again.');
          } else if (result[0].is_cancelled) {
            CommonService.showAlert('Transaction ID - ' + transactionId, ' Your payment was cancelled. Please try again.');
          } else {
            CommonService.showAlert('Transaction ID - ' + transactionId, ' Your payment was terminated. Please try again.');
          }
          CommonService.hideLoader();
        },
        error: function (error) {
          $log.log("Error: " + error.code + " " + error.message);
          CommonService.hideLoader();
        }
      });

    });

    function saveOrderShippingAddress(orderId) {
      CommonService.showLoader();
      var ya_user_order_address = Parse.Object.extend("ya_user_orders_address");
      var orderAddress = new ya_user_order_address();

      orderAddress.set("first_name", $scope.shippingAddress.first_name);
      orderAddress.set("last_name", $scope.shippingAddress.last_name);
      orderAddress.set("phone_no", $scope.shippingAddress.phone_no);
      orderAddress.set("address_first_line", $scope.shippingAddress.address);
      orderAddress.set("zip", $scope.shippingAddress.zip);
      orderAddress.set("city", $scope.shippingAddress.city);
      orderAddress.set("country", $scope.shippingAddress.country);
      orderAddress.set("order_id", orderId);
      orderAddress.set("user_id", CommonService.getUserObjInLocalStorage().user_id);
      orderAddress.set("ip_address", CommonService.getIpAddress());
      orderAddress.set("app_id", urls.appId);

      orderAddress.save(null, {
        success: function (response) {
          $log.log('Success', 'Shipping address added successfully.');
          CommonService.hideLoader();
          saveOrderDetails(orderId);
        },
        error: function (error) {
          $log.log('Error', 'Error while creating the order. Error is ' + error.message);
          CommonService.hideLoader();
        }
      });
    }

    function saveOrderDetails(orderId) {
      var addedProdCount = 0;
      var count = 0;

      var allProductCount = $scope.allCartProducts.length;
      angular.forEach($scope.allCartProducts, function (val, key) {
        CommonService.showLoader();

        count += 1;
        var ya_user_orders_details = Parse.Object.extend("ya_user_orders_details");
        var cartProduct = new ya_user_orders_details();

        cartProduct.set("product_id", val.product_id);
        cartProduct.set("order_id", orderId);
        cartProduct.set("product_title", val.product_title);
        cartProduct.set("product_desc", val.product_desc);
        cartProduct.set("product_image", val.product_image);
        cartProduct.set("original_price", val.original_price);
        cartProduct.set("discounted_price", val.discounted_price);
        cartProduct.set("currency_logo", "&#8377;");
        cartProduct.set("quantity", val.quantity);
        cartProduct.set("selected_attributes", val.selected_attributes);
        cartProduct.set("ip_address", CommonService.getIpAddress());
        cartProduct.set("is_deleted_from_cart", false);
        cartProduct.set("is_deleted", false);
        cartProduct.set("app_id", urls.appId);
        cartProduct.set("user_id", CommonService.getUserObjInLocalStorage().user_id);

        cartProduct.save(null, {
          success: function (response) {
            addedProdCount += 1;
            $log.log('Order detail added to the ya_user_orders_details table : ' + response.id);
            CommonService.hideLoader();
            if (allProductCount == addedProdCount) {
              openPaymentWindow(orderId);
              $log.log('All the products in the order are added to ya_user_orders_details');
            }
          },
          error: function (response, error) {
            $log.log('Error', 'Error while adding the products. Error is ' + error.message);
            CommonService.hideLoader();
          }
        })
      });
    }

    function saveOrder(orderId) {
      CommonService.showLoader();
      var ya_user_orders = Parse.Object.extend("ya_user_orders");
      var cartProduct = new ya_user_orders();

      cartProduct.set("is_cod", false);
      cartProduct.set("order_id", orderId);
      cartProduct.set("is_deleted", false);
      cartProduct.set("is_pg", true);
      cartProduct.set("is_success", false);
      cartProduct.set("is_failed", false);
      cartProduct.set("delivery_type", CartService.getDeliveryTypeCharge().type);
      cartProduct.set("delivery_cost", CartService.getDeliveryTypeCharge().charge);
      cartProduct.set("total_amount", $scope.totalCartDiscountPrice);
      cartProduct.set("user_id", CommonService.getUserObjInLocalStorage().user_id);
      cartProduct.set("ip_address", CommonService.getIpAddress());
      cartProduct.set("app_id", urls.appId);

      cartProduct.save(null, {
        success: function (response) {
          CommonService.hideLoader();
          $log.log('Products added to user_orders table');
          saveOrderShippingAddress(orderId);
        },
        error: function (response, error) {
          $log.log('Error', 'Error while creating the order. Error is ' + error.message);
          CommonService.hideLoader();
        }
      });
    }

    $scope.goToPaymentPage = function () {
      $rootScope.$broadcast('cartCount', 0);
      var orderId = (CommonService.generateUID()).toString();
      $log.log('goToPaymentPage', orderId);
      saveOrder(orderId);
    };

  }

})();
