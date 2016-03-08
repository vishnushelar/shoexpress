angular.module('mttapp.directives', [])
  .directive('horizontalScrollFix', horizontalScrollFix)
  .directive('scrollWatch', scrollWatch)
  .directive('hideHeader', hideHeader)
  .directive('goNative', goNative);

function horizontalScrollFix($timeout, $ionicScrollDelegate) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var mainScrollID = attrs.horizontalScrollFix,
        scrollID = attrs.delegateHandle;

      var getEventTouches = function (e) {
        return e.touches && (e.touches.length ? e.touches : [
            {
              pageX: e.pageX,
              pageY: e.pageY
            }
          ]);
      };

      var fixHorizontalAndVerticalScroll = function () {
        var mainScroll, scroll;
        mainScroll = $ionicScrollDelegate.$getByHandle(mainScrollID).getScrollView();
        scroll = $ionicScrollDelegate.$getByHandle(scrollID).getScrollView();

        // patch touchstart
        scroll.__container.removeEventListener('touchstart', scroll.touchStart);
        scroll.touchStart = function (e) {
          var startY;
          scroll.startCoordinates = ionic.tap.pointerCoord(e);
          if (ionic.tap.ignoreScrollStart(e)) {
            return;
          }
          scroll.__isDown = true;
          if (ionic.tap.containsOrIsTextInput(e.target) || e.target.tagName === 'SELECT') {
            scroll.__hasStarted = false;
            return;
          }
          scroll.__isSelectable = true;
          scroll.__enableScrollY = true;
          scroll.__hasStarted = true;
          scroll.doTouchStart(getEventTouches(e), e.timeStamp);
          startY = mainScroll.__scrollTop;

          // below is our changes to this method
          // e.preventDefault();

          // lock main scroll if scrolling horizontal
          $timeout((function () {
            var animate, yMovement;
            yMovement = startY - mainScroll.__scrollTop;
            if (scroll.__isDragging && yMovement < 2.0 && yMovement > -2.0) {
              mainScroll.__isTracking = false;
              mainScroll.doTouchEnd();
              animate = false;
              return mainScroll.scrollTo(0, startY, animate);
            } else {
              return scroll.doTouchEnd();
            }
          }), 100);
        };
        scroll.__container.addEventListener('touchstart', scroll.touchStart);
      };
      $timeout(function () {
        fixHorizontalAndVerticalScroll();
      });
    }
  };
}

function scrollWatch($rootScope) {
  return function (scope, elem, attr) {
    var start = 0;
    var threshold = 10;

    elem.bind('scroll', function (e) {
      if (e.detail.scrollTop - start > threshold) {
        $rootScope.slideHeader = true;
      } else {
        $rootScope.slideHeader = false;
      }
      if ($rootScope.slideHeaderPrevious >= e.detail.scrollTop - start) {
        $rootScope.slideHeader = false;
      }
      $rootScope.slideHeaderPrevious = e.detail.scrollTop - start;
      $rootScope.$apply();
    });
  };
}


function hideHeader($rootScope) {
  return function (scope, elem, attr) {
    var prevScroll = 0;

    elem.bind('scroll', function (e) {
      if (e.detail.scrollTop > 20) {
        $rootScope.hideHeader = true;
      } else {
        $rootScope.hideHeader = false;
      }
      prevScroll = e.detail.scrollTop;
      $rootScope.$apply();
    });
  };
}


function goNative($ionicGesture, $ionicPlatform) {
  return {
    restrict: 'A',

    link: function (scope, element, attrs) {

      $ionicGesture.on('tap', function (e) {

        var direction = attrs.direction;
        var transitiontype = attrs.transitiontype;

        $ionicPlatform.ready(function () {

          switch (transitiontype) {
            case "slide":
              window.plugins.nativepagetransitions.slide({
                  "direction": direction
                },
                function (msg) {
                  console.log("success: " + msg)
                },
                function (msg) {
                  console.log("error: " + msg)
                }
              );
              break;
            case "flip":
              window.plugins.nativepagetransitions.flip({
                  "direction": direction
                },
                function (msg) {
                  console.log("success: " + msg)
                },
                function (msg) {
                  console.log("error: " + msg)
                }
              );
              break;

            case "fade":
              window.plugins.nativepagetransitions.fade({},
                function (msg) {
                  console.log("success: " + msg)
                },
                function (msg) {
                  console.log("error: " + msg)
                }
              );
              break;

            case "drawer":
              window.plugins.nativepagetransitions.drawer({
                  "origin": direction,
                  "action": "open"
                },
                function (msg) {
                  console.log("success: " + msg)
                },
                function (msg) {
                  console.log("error: " + msg)
                }
              );
              break;

            case "curl":
              window.plugins.nativepagetransitions.curl({
                  "direction": direction
                },
                function (msg) {
                  console.log("success: " + msg)
                },
                function (msg) {
                  console.log("error: " + msg)
                }
              );
              break;

            default:
              window.plugins.nativepagetransitions.slide({
                  "direction": direction
                },
                function (msg) {
                  console.log("success: " + msg)
                },
                function (msg) {
                  console.log("error: " + msg)
                }
              );
          }


        });
      }, element);
    }
  };
}
