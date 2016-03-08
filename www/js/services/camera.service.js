angular.module('mttapp.services')
  .service('CameraService', CameraService);

function CameraService($cordovaCamera,$log) {

  this.showCamOptions = function (val, cb) {
    var options = {
      quality: 50,
      //destinationType: Camera.DestinationType.DATA_URL,
      destinationType: 0,
      sourceType: (val == 0) ? 1 : 2,
      allowEdit: true,
      //encodingType: Camera.EncodingType.JPEG,
      encodingType: 0,  //0 - JPEG, 1 - PNG
      targetWidth: 100,
      targetHeight: 100,
      //popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options)
      .then(function (imageData) {
        //var image = document.getElementById('myImage');
        //image.src = "data:image/jpeg;base64," + imageData;
        cb("data:image/jpeg;base64," + imageData);
      }, function (err) {
        $log.log('err', err);
        cb(err);
      });
  }


}
