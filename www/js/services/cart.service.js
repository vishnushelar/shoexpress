angular.module('mttapp.services')
  .service('CartService', CartService);

function CartService($ionicPopup, $ionicLoading, $http) {

  this.allCartProducts;
  this.totalCartOriginalPrice;
  this.totalCartDiscountPrice;
  this.shippingAddress;
  this.deliveryTypeCharge;
  this.showItemAddedAtCart = false;
  this.selectedOrderDetails;
  this.cardNumber;
  this.paymentMode;
  this.orderId;

  this.setAllCartProducts = function (allCartProducts) {
    this.allCartProducts = allCartProducts;
  };
  this.getAllCartProducts = function () {
    return this.allCartProducts;
  };

  this.setTotalCartOriginalPrice = function (price) {
    this.totalCartOriginalPrice = price;
  };
  this.getTotalCartOriginalPrice = function () {
    return this.totalCartOriginalPrice;
  };

  this.setTotalCartDiscountPrice = function (price) {
    this.totalCartDiscountPrice = price;
  };
  this.getTotalCartDiscountPrice = function () {
    return this.totalCartDiscountPrice;
  };

  this.setShippingAddress = function (address) {
    this.shippingAddress = address;
  };
  this.getShippingAddress = function () {
    return this.shippingAddress;
  };

  this.setDeliveryTypeCharge = function (obj) {
    this.deliveryTypeCharge = obj;
  };
  this.getDeliveryTypeCharge = function () {
    return this.deliveryTypeCharge;
  };

  this.setShowItemAddedAtCart = function (val) {
    this.showItemAddedAtCart = val
  };
  this.getShowItemAddedAtCart = function () {
    return this.showItemAddedAtCart;
  };

  this.setSelectedOrderDetails = function (order) {
    this.selectedOrderDetails = order;
  };
  this.getSelectedOrderDetails = function () {
    return this.selectedOrderDetails;
  };

  this.setCardNumber = function (cardNumber) {
    this.cardNumber = cardNumber;
  };
  this.getCardNumber = function () {
    return this.cardNumber;
  };
  this.setPaymentMode = function (paymentMode) {
    this.paymentMode = paymentMode;
  };
  this.getPaymentMode = function () {
    return this.paymentMode;
  };
  this.setOrderId = function (orderId) {
    this.orderId = orderId;
  };
  this.getOrderId= function () {
    return this.orderId;
  };

}
