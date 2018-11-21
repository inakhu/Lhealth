
app.controller('userSignupCtrl', function($scope,$state, $http,$ionicPopup,HTSServices) {
    $scope.data = {};
    $scope.data.user_position=4;
    $scope.userPosition = ['Super Admin', 'Admin', 'Doctor', 'Patient'];

    $scope.HTSappLoader = function() {
        HTSServices.HezecomGetOne('settings/checker').success(function (data) {
            $scope.user_sign = data.user_sign;
            $scope.doctor_sign = data.doctor_sign;
            $scope.app_email = data.app_email;

        });
    };
    $scope.HTSappLoader();

    $scope.HTSsignupForm = function () {
        HTSServices.HezecomPostNewInfo('users/signup', $scope.data)
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
                    $state.go('login');
                }
            });
    };
    /*protected*/
    $scope.HTSsignupFormAdmin = function () {
        HTSServices.HezecomPostNewInfo('users/signup', $scope.data)
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
            });
    };
    /*retrieve lost password*/
    $scope.HTSLostPassword = function () {
        HTSServices.HezecomPostNewInfo('users/lostp', $scope.data)
            .success(function (data) {
                if (data.errors) {
                    $ionicPopup.alert({
                        title: 'Error Message:',
                        template: data.errors
                    });
                } else {
                    $ionicPopup.alert({
                        title: 'Success Message:',
                        template: data.message
                    });
                }
            });
    };
});

app.controller('userLoginCtrl', function($scope,$state, $http,$ionicPopup,HTSServices,$ionicLoading) {
    $scope.data = {};
    $state.reload();
    /*$rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        var onlineState = networkState;
        alert('You online');
    });*/

    $scope.HTSLoginForm = function() {
        $ionicLoading.show({template: 'Loading...'});
        localStorage.setItem("mytoken", '89789738978973993');
        localStorage.setItem("myusername", 'hezecom');
        localStorage.setItem("myname", 'hezecom');
        localStorage.setItem("myuserid", '87777');
        localStorage.setItem("myposition", '2');
        $ionicLoading.hide();
        $state.go('app.dashboard');

        /*HTSServices.HezecomPostNewInfo('login',$scope.data)
            .success(function(data) {
                if (data.errors) {
                    $ionicPopup.alert({
                        title: 'Error Message',
                        template: data.errors
                    });
                    $ionicLoading.hide();
                } else {
                    localStorage.setItem("mytoken", data.token);
                    localStorage.setItem("myusername", data.username);
                    localStorage.setItem("myname", data.name);
                    localStorage.setItem("myuserid", data.id);
                    localStorage.setItem("myposition", data.provider);
                    $state.go('app.dashboard');
                    //$window.location.href = '/#/app/dashboard';
                    $ionicLoading.hide();
                }
            });*/
    };
});


app.controller('ProfilesCtrl', function($scope ,$state, HTSServices, $ionicFilterBar,$ionicLoading,$ionicPopup,APP_SERVER) {

    $scope.current_page = 10;
    $scope.page_size = 20;
    $scope.moreDataCanBeLoaded = true;
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true;
    $scope.surl=APP_SERVER.url+'templates/uploads/';

    $scope.HTSappLoader = function() {
        $ionicLoading.show({template: 'Loading...'});
        HTSServices.HezecomGetOne('users/view?page='+$scope.current_page).success(function (data) {
            $scope.profiles = data.data;
            $scope.totalItems = data.count;
            $scope.$broadcast('scroll.infiniteScrollComplete');

            if (($scope.totalItems < $scope.page_size) && ($scope.totalItems < $scope.current_page * $scope.page_size))
            {
                $scope.moreDataCanBeLoaded = false;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.current_page = $scope.current_page+5;
            $ionicLoading.hide();
        });

    };
/////////////////////////////////////
    $scope.isCheckboxChecked = function () {
        for(var i =0 ; i <$scope.tempData.length ; i++){
            if($scope.tempData[i].checked){
                return true;
            }
        }
    };
////////////////////////////

    $scope.$on('$stateChangeSuccess', function() {
        $scope.HTSappLoader();
    });

    $scope.HTSappLoaderSearch = function(sval) {
        //$ionicLoading.show();
        HTSServices.HezecomGetOne('users/search/'+sval).success(function (data) {
            $scope.profiles = data.data;
            //$ionicLoading.hide();
        });
    };
    $scope.HTSappLoader();
    $scope.showFilterBar = function () {
        var filterBarInstance = $ionicFilterBar.show({
            cancelText: "<i class='ion-ios-close-outline'></i>",
            //items: $scope.places,
            update: function (filteredItems, filterText) {
                if (filterText) {
                    console.log(filterText);
                    $scope.fetchRecords(filterText);
                }
            }
        });
    };

    $scope.fetchRecords= function(searchText)
    {
        if(searchText!==''){
            $scope.HTSappLoaderSearch(searchText);
        }else{
            $scope.HTSappLoader();
        }
    };

    $scope.PullRefresher= function()
    {
        $scope.HTSappLoader();
        $scope.$broadcast('scroll.refreshComplete');
    };

    /*delete*/
    $scope.deleteRecord = function(custId) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                HTSServices.HezecomDeleteInfo('users/delete/'+custId).success(function(data){
                    $scope.HTSappLoader();
                });
            } else {
                //console.log('You are not sure');
            }
        });
    };

});

app.controller('UeserDetails', function($scope, $stateParams , HTSServices,$cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet,$ionicLoading,$state) {
    var id = $stateParams.id;
    $scope.row = {};
    $scope.DetailsLoader = function(id) {
        HTSServices.HezecomGetOne('users/details/' + id).success(function (data) {
            $scope.row = data.data;
        });
    };
    $scope.DetailsLoader(id);

    /*update*/
    $scope.HTSupdateForm = function () {
        $ionicLoading.show({template: 'Loading...'});
        HTSServices.HezecomPostNewInfo('users/update', $scope.row)
            .success(function (data) {
                if (data.errors) {
                    $ionicPopup.alert({
                        title: 'Information',
                        template: 'Please complete necessary field.'
                    });
                    $ionicLoading.hide();
                } else {
                    $ionicPopup.alert({
                        title: 'Success Message:',
                        template: data.message
                    });
                    $ionicLoading.hide();
                    /*$state.go('app.profiles');*/
                }
            });
    };
    /*delete*/
    $scope.deleteRecord = function(custId) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                HTSServices.HezecomDeleteInfo('users/delete/'+custId).success(function(data){
                    $state.go('app.profiles');
                });
            } else {
                console.log('not deleted');
            }
        });
    };
    /*select*/
    /*$scope.programmez =  [
     { program_study : "B.Sc Programme"},
     { program_study : "Masters Programme"},
     { program_study : "Ph.D Pgrogramme"}
     ];*/
    $scope.programmez = ['B.Sc Programme', 'Masters Programme','Ph.D'];
    $scope.userStatus = ['Inactive', 'Active'];
    $scope.userPosition = ['Super Admin', 'Admin', 'Doctor', 'Patient'];
});

app.controller('DashCtrl', function($scope,$state, $stateParams , HTSServices,$timeout,$ionicHistory,$ionicLoading,$window) {
    //$state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
    //$state.reload();
    //$state.go($state.current, $stateParams, {reload: true, inherit: false});

    if(HTSServices.UsersAuth() === null || HTSServices.UsersAuth() === "")
    {
        $state.go('login');
    }
    else {
        $scope.myname =localStorage.getItem("myname");
        $scope.myusername = localStorage.getItem("myusername");
        $scope.myposition = localStorage.getItem("myposition");
        $scope.myuserid = localStorage.getItem("myuserid");
        $scope.mytoken=localStorage.getItem("mytoken");
        $scope.uData=localStorage.getItem("myusername")+'/'+localStorage.getItem("mytoken");
        //$state.go('app.dashboard', {}, {reload: 'app.dashboard'});
        //$state.go($state.current, {}, { reload: true });
        //console.log('Username: '+$scope.myusername);
        //$window.location.href = '/';
        //$window.location.reload(true);
    }



    /*do logout*/
    $scope.doLogout = function(){
        $ionicLoading.show({template:'Logging out....'});
        localStorage.removeItem("mytoken");
        localStorage.removeItem("myusername");
        localStorage.removeItem("myname");
        localStorage.removeItem("myuserid");
        localStorage.removeItem("myposition");
        $timeout(function () {
            $ionicLoading.hide();
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
            $state.go('login');
        }, 30);

    };
    /*$scope.reload = function() {
        return $state.transitionTo($state.current, $stateParams, {
            reload: true
        }).then(function() {
            $scope.hideContent = true;
            return $timeout(function() {
                return $scope.hideContent = false;
            }, 1);
        });
    };
    $scope.reload();*/
   /* $state.transitionTo($state.current, $stateParams, {
        reload: true,
        inherit: false,
        notify: true
    });*/
    //$scope.reload();
    /*$scope.reload = function () {

        $state.go($state.current, {}, { reload: true });
    }*/
});

app.controller('userLostPasswordCtrl', function($scope,$state,$ionicPopup,HTSServices) {
    $scope.data = {};
    $scope.HTSLostPassword = function () {
        HTSServices.HezecomPostNewInfo('users/lostp', $scope.data)
            .success(function (data) {
                if (data.errors) {
                    $ionicPopup.alert({
                        title: 'Error Message:',
                        template: data.errors
                    });
                } else {
                    $ionicPopup.alert({
                        title: 'Success Message:',
                        template: data.message
                    });
                }
            });
    };
});