/**
 * Created by Hezecom on 5/12/2017.
 */
app.controller('SettingsCtrl', function($scope,$state,$ionicPopup,HTSServices,USER_VARS) {

    $scope.myposition = localStorage.getItem("myposition");
    $scope.HTSappLoader = function() {
        HTSServices.HezecomGetOne('settings/view/'+$scope.myposition).success(function (data) {
            $scope.data.host = data.host;
            $scope.data.dbusername = data.dbusername;
            $scope.data.dbpassword = data.dbpassword;
            $scope.data.dbname = data.dbname;
            $scope.data.dbtype = data.dbtype;
            $scope.data.ptitle = data.ptitle;
            $scope.data.recordsp = data.recordsp;
            $scope.data.app_email = data.app_email;
            $scope.data.no_reply = data.no_reply;
            $scope.data.app_website = data.app_website;
            $scope.data.app_enotify = data.app_enotify;
            $scope.data.app_timezone = data.app_timezone;
            $scope.data.user_sign = data.user_sign;
            $scope.data.doctor_sign = data.doctor_sign;
            //$scope.tzones = data.tzones;

        });
    };
    $scope.HTSappLoader();

    $scope.data = {};
    $scope.HTSLSettingsUpdate = function () {
        HTSServices.HezecomPostNewInfo('settings/update/'+$scope.myposition, $scope.data)
            .success(function (data) {
                if (data.errors) {
                    $ionicPopup.alert({
                        title: 'Error Message:',
                        template: 'An error have occured'
                    });
                } else {
                    $ionicPopup.alert({
                        title: 'Success Message:',
                        template: 'Settings updated successfully'
                    });
                    $scope.HTSappLoader();
                }
            });
    };

   /* $scope.pushNotificationChange = function() {
        console.log('Push Notification Change', $scope.pushNotification.checked);
    };

    $scope.emailNotificationChange = function() {
        console.log('Email Notification Change', $scope.emailNotification);
    };*/

    //$scope.pushNotification = { checked: true };
    $scope.data = { app_enotify: 'On' };
    $scope.data = { user_sign: 'On' };
    $scope.data = { doctor_sign: 'Off' };
});