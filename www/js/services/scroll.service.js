angular.module('mttapp.services')
  .service('ScrollService', ScrollService);

function ScrollService($log) {
  this.handleScroll = function (sv) {
    try {
      var container = sv.__container;
      var originaltouchStart = sv.touchStart;
      var originalmouseDown = sv.mouseDown;
      var originaltouchMove = sv.touchMove;
      var originalmouseMove = sv.mouseMove;

      container.removeEventListener('touchstart', sv.touchStart);
      container.removeEventListener('mousedown', sv.mouseDown);
      document.removeEventListener('touchmove', sv.touchMove);
      document.removeEventListener('mousemove', sv.mousemove);

      sv.touchStart = function (e) {
        e.preventDefault = function () {
        };
        try {
          originaltouchStart.apply(sv, [e]);
        } catch (e) {
          $log.log('Error in scroll directive : touchStart.');
        }
      };

      sv.touchMove = function (e) {
        e.preventDefault = function () {
        };
        try {
          originaltouchMove.apply(sv, [e]);
        } catch (e) {
          $log.log('Error in scroll directive : touchMove.');
        }
      };

      sv.mouseDown = function (e) {
        e.preventDefault = function () {
        };
        try {
          originalmouseDown.apply(sv, [e]);
        } catch (e) {
          $log.log('Error in scroll directive : mouseDown.');
        }
      };

      sv.mouseMove = function (e) {
        e.preventDefault = function () {
        };
        try {
          originalmouseMove.apply(sv, [e]);
        } catch (e) {
          $log.log('Error in scroll directive : mouseMove.');
        }
      };

      container.addEventListener("touchstart", sv.touchStart, false);
      container.addEventListener("mousedown", sv.mouseDown, false);
      document.addEventListener("touchmove", sv.touchMove, false);
      document.addEventListener("mousemove", sv.mouseMove, false);
    } catch (e) {
      $log.log('Error in scroll directive.');
    }
  }
}
