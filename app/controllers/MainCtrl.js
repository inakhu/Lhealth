app.controller('MainCtrl', function($scope,$state, $http,$ionicPopup,$ionicSlideBoxDelegate,HTSServices,$ionicLoading) {
    $scope.data = {};

    $scope.startApp = function() {
        $state.go('app.accredit');
    };

    $scope.next = function() {
        $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
        $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };

    $scope.HTSappLoader = function() {
        //$ionicLoading.show({template: 'Loading...'});
        HTSServices.HezecomGetOne('questions').success(function (data) {
            $scope.questions = data.questions;
            $scope.options = data.options;
            $scope.totalItems = data.counter;

            //$ionicLoading.hide();
        });

    };

    $scope.HTSappLoader();


    /*protected*/

    $scope.SubmitForm = function () {
        $state.go('app.uploader');
        /*HTSServices.HezecomPostNewInfo('users/signup', $scope.data)
            .success(function (data) {
                if (data.errors) {
                    $ionicPopup.alert({
                        title: 'Information',
                        template: data.errors
                    });
                } else {
                    $ionicPopup.alert({
                        title: 'Success Message:',
                        template: data.message
                    });
                    $state.go('app.profiles');
                }
            });*/
    };

});
