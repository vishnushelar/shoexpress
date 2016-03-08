(function () {
  angular.module('mttapp.controllers')
    .controller('ProductsListCtrl', ProductsListCtrl);

  function ProductsListCtrl($scope, $ionicModal,$log, $timeout, $state, $ionicSlideBoxDelegate, $ionicScrollDelegate, CommonFactory, HomeService,CommonService) {

    $scope.selectedColors = [];
    $scope.colorsRefined = false;
    $scope.priceRefined = false;

    function getProductsListData() {
      CommonFactory
        .getAllData()
        .then(function (response) {
          $scope.homePageData = response;
        }, function (error) {
          $log.log(error);
        });
    }

    //getProductsListData();

    $scope.productsData = HomeService.getSelectedProductData();
    $scope.allProductsListNoRefine = $scope.productsData.section_data;
    $scope.allProductsList = $scope.allProductsListNoRefine;

    $scope.changeState = function (toState) {
      $state.go(toState);
      CommonService.setNativeAnimation();
    };

    $scope.showProductDetails = function (details, toState) {
      HomeService.setProductDetails(details);
      $state.go(toState);
      CommonService.setNativeAnimation();
    };

    $ionicModal.fromTemplateUrl('templates/refine-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.refineModal = modal;
    });

    $scope.clearRefinement = function () {
      $scope.priceRefined = false;
      $scope.colorsRefined = false;
      $scope.allProductsList = $scope.allProductsListNoRefine;
    };

    $scope.showRefineModal = function () {
      $scope.refineModal.show();
      var product_attributes = [];
      $scope.allColors = [];
      angular.forEach($scope.allProductsListNoRefine, function (val, key) {
        product_attributes.push(val.product_attributes);
      });
      product_attributes = _.flatten(product_attributes);
      angular.forEach(product_attributes, function (val, key) {
        if (val.label.toLowerCase() == 'color') {
          $scope.allColors.push(val.values);
        }
      });
      $scope.allColors = _.uniq(_.flatten($scope.allColors));
    };

    $scope.hideRefineModal = function (val) {
      if (val) {
        if ($scope.selectedColors.length > 0) {
          $scope.colorsRefined = true;
          $scope.allProductsList = [];

          angular.forEach($scope.allProductsListNoRefine, function (val, key) {
            angular.forEach(val.product_attributes, function (innerVal, key) {
              if (innerVal.label.toLowerCase() == 'color') {
                var intersection = _.intersection(innerVal.values, $scope.selectedColors);
                if (intersection.length > 0) {
                  $scope.allProductsList.push(val);
                }
              }
            });
          });
        }

        if ($scope.selectedPrice) {
          $scope.priceRefined = true;
          if ($scope.selectedPrice == 'low') {
            $scope.allProductsList = (_.sortBy($scope.allProductsList, function (o) {
              return o.obj_discounted_price;
            }));
          } else if ($scope.selectedPrice == 'high') {
            $scope.allProductsList = (_.sortBy($scope.allProductsList, function (o) {
              return o.obj_discounted_price;
            })).reverse();
          }
        }
      } else {
        if (!$scope.colorsRefined) {
          $scope.selectedColors = [];
        }
        if (!$scope.priceRefined) {
          $scope.selectedPrice = undefined;
        }
      }
      $scope.refineModal.hide();
    };

    $scope.refinePriceSelected = function (price) {
      $scope.selectedPrice = price;
    };

    $scope.refineColorSelected = function (color) {
      if ($scope.selectedColors.indexOf(color) >= 0) {
        $scope.selectedColors.splice(_.indexOf($scope.selectedColors, color), 1);
      } else {
        $scope.selectedColors.push(color);
      }
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

  }

})();
