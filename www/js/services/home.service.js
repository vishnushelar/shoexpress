angular.module('mttapp.services')
  .service('HomeService', HomeService);

function HomeService() {
  this.appHeading = '';
  this.selectedProductData = {};
  this.productDetails;
  this.prevTabScrollPosition;

  this.setAppHeading = function (heading) {
    this.appHeading = heading;
  };
  this.getAppHeading = function () {
    return this.appHeading;
  };

  this.setSelectedProductData = function (data) {
    this.selectedProductData = data;
  };
  this.getSelectedProductData = function () {
    return this.selectedProductData;
  };

  this.setProductDetails = function (details) {
    this.productDetails = details;
  };
  this.getProductDetails = function () {
    return this.productDetails;
  };

  this.setPrevTabScrollPosition = function (number, scrollPosition) {
    this.prevTabScrollPosition = {tab: number, position: scrollPosition};
  };
  this.getPrevTabScrollPosition = function () {
    return this.prevTabScrollPosition;
  };

  this.setJsonInLocal = function (obj) {
    localStorage.setItem('mtt_home_data', JSON.stringify(obj));
  };
  this.getJsonInLocal = function () {
    return JSON.parse(localStorage.getItem('mtt_home_data'));
  };

  this.setJsonLastModifiedInLocal = function (lastDate) {
    localStorage.setItem('mtt_home_data_last_update', lastDate);
  };
  this.getJsonLastModifiedInLocal = function () {
    return localStorage.getItem('mtt_home_data_last_update');
  };

}
