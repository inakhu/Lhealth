app.controller('UploaderCtrl', function ($scope,$state,$localStorage, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup,$ionicLoading, $cordovaActionSheet,APP_SERVER) {
    $scope.image = null;
    var AppBase = APP_SERVER.url;
    // Present Actionsheet for switch beteen Camera / Library
    $scope.loadImage = function() {
        var options = {
            title: 'Select Image Source',
            buttonLabels: ['Load from Library', 'Use Camera'],
            addCancelButtonWithLabel: 'Cancel',
            androidEnableCancelButton : true
        };
        $cordovaActionSheet.show(options).then(function(btnIndex) {
            var type = null;
            if (btnIndex === 1) {
                type = Camera.PictureSourceType.PHOTOLIBRARY;
            } else if (btnIndex === 2) {
                type = Camera.PictureSourceType.CAMERA;
            }
            if (type !== null) {
                $scope.selectPicture(type);
            }
        });
    };

    // Take image with the camera or from library and store it inside the app folder
    // Image will not be saved to users Library.
    $scope.selectPicture = function(sourceType) {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: sourceType,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imagePath) {
                // Grab the file name of the photo in the temporary directory
                var currentName = imagePath.replace(/^.*[\\\/]/, '');

                //Create a new name for the photo
                var d = new Date(),
                    n = d.getTime(),
                    newFileName =  "iwitness_"+n + ".jpg";

                // If you are trying to load image from the gallery on Android we need special treatment!
                if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
                    window.FilePath.resolveNativePath(imagePath, function(entry) {
                            window.resolveLocalFileSystemURL(entry, success, fail);
                            function fail(e) {
                                console.error('Error: ', e);
                            }

                            function success(fileEntry) {
                                var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
                                // Only copy because of access rights
                                $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
                                    $scope.image = newFileName;
                                }, function(error){
                                    $scope.showAlert('Error', error.exception);
                                });
                            }
                        }
                    );
                } else {
                    var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                    // Move the file to permanent storage
                    $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
                        $scope.image = newFileName;
                    }, function(error){
                        $scope.showAlert('Error', error.exception);
                    });
                }
            },
            function(err){
                // Not always an error, maybe cancel was pressed...
            })
    };

    // Returns the local path inside the app for an image
    $scope.pathForImage = function(image) {
        if (image === null) {
            return '';
        } else {
            return cordova.file.dataDirectory + image;
        }
    };

    $scope.uploadImage = function() {
        $ionicLoading.show({template: 'uploading image ...'});
        // Destination URL
        // var url = "http://localhost:8888/upload.php";
        var url = 'http://nftvapp.com/upload.php?apikey='+APP_SERVER.apikey;
        //var url = "https://devdactic.com/downloads/upload.php";

        // File for Upload
        var targetPath = $scope.pathForImage($scope.image);

        // File name only
        var filename = $scope.image;
        $localStorage.filename =  filename;

        var options = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params : {'fileName': filename}
        };

        $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
            //$localStorage.filename =  filename;
            //console.log($localStorage.filename);
            $state.go('app.iwitnessupdate');
            $scope.showAlert('Success', 'Image upload finished.');
            $ionicLoading.hide();
        });
    };

    $scope.showAlert = function(title, msg) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: msg
        });
    };

});


app.controller('VideoUploaderCtrl', function ($scope,$state,$localStorage, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup,$ionicLoading,APP_SERVER) {

    $scope.openVideoLibrary = function() {
        var options = {
            quality: 50,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType:navigator.camera.MediaType.VIDEO
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {

            $ionicLoading.show({template: 'uploading video ...'});
            //var image = document.getElementById('tempVideo');
            //image.src = imageData;
            //image.src = 'http://nftvapp.com/templates/uploads/main/video.jpg';
            var server = 'http://nftvapp.com/upload.php?apikey='+APP_SERVER.apikey,
                filePath = imageData;
            //filePath = cordova.file.externalRootDirectory + imageData;
            $localStorage.filename =  imageData;

            var date = new Date();
            var options = {
                fileKey: "file",
                fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
                chunkedMode: false,
                mimeType: "video/mp4"
            };

            $cordovaFileTransfer.upload(server, filePath, options).then(function(result) {
                //$state.go('app.iwitnessupdate');
                $scope.showAlert('Success', 'Image upload finished.');
                $ionicLoading.hide();

            }, function(err) {
                console.log("ERROR: " + JSON.stringify(err));
                //alert(JSON.stringify(err));
            }, function (progress) {
                // constant progress updates
            });

        }, function(err) {
            // error
            console.log(err);
        });
    };

    $scope.showAlert = function(title, msg) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: msg
        });
    };




    $scope.captureVideo = function () {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URL,
            sourceType: Camera.PictureSourceType.CAMERA
        };
        $cordovaCapture.captureVideo(options).then(function(videoData) {
            $scope.clip = videoData[0].fullPath;
            $scope.file=videoData[0].name;

            var first=$scope.clip.substr(0,$scope.clip.lastIndexOf('/')+1);

            $cordovaFile.readAsDataURL(first,$scope.file)
                .then(function (success) {

                    var bucket = new AWS.S3({params: { Bucket: 'jbf-dev-bucket' }});

                    var params = {

                        Key: videoData[0].name,
                        ContentEncoding: 'base64',
                        ContentType: 'video/mp4',
                        Body: success
                    };

                    bucket.upload(params).on('httpUploadProgress', function(evt) {
                        $scope.uploading = true;
                        $scope.progress = parseInt((evt.loaded * 100) / evt.total)+'%';
                        console.log("Uploaded :: " + $scope.progress );
                        $scope.$apply();
                    }).send(function(err, data) {
                        $scope.uploading = false;
                        /*$scope.images.push(data.Location);*/

                        /*console.log(data.Location);*/
                        $scope.$apply();
                    });

                    $scope.i++;

                }, function (error) {

                    console.log("==========error==========");
                    console.log(error);
                })


        })

    }

});
