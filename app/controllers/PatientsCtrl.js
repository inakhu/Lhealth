
app.controller('PatientCtrl', function($scope ,$state, HTSServices, $ionicFilterBar,$ionicLoading,$ionicPopup,APP_SERVER) {

    $scope.current_page = 10;
    $scope.page_size = 20;
    $scope.moreDataCanBeLoaded = true;

    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true;
    $scope.surl=APP_SERVER.url+'templates/uploads/';

    $scope.HTSappLoader = function() {
        $ionicLoading.show({template: 'Loading...'});
        HTSServices.HezecomGetOne('patients/view?page='+$scope.current_page).success(function (data) {
            $scope.patients = data.data;
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

    $scope.$on('$stateChangeSuccess', function() {
        $scope.HTSappLoader();
    });

    $scope.HTSappLoaderSearch = function(sval) {
        $ionicLoading.show();
        HTSServices.HezecomGetOne('patients/search/'+sval+'?page='+$scope.current_page).success(function (data) {
            $scope.patients = data.data;
            $ionicLoading.hide();
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
                HTSServices.HezecomDeleteInfo('patients/delete/'+custId).success(function(data){
                    $scope.HTSappLoader();
                });
            } else {
                console.log('not deleted');
            }
        });
    };

});

app.controller('PatientDetails', function($scope, $stateParams , HTSServices,$cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet,$ionicLoading,$state) {
    var id = $stateParams.id;
    $scope.row = {};
    $scope.DetailsLoader = function(id) {
        HTSServices.HezecomGetOne('patients/one/' + id).success(function (data) {
            $scope.row = data.data;
        });
    };
    $scope.DetailsLoader(id);

    /*update*/
    $scope.HTSupdateForm = function () {
        $ionicLoading.show({template: 'Loading...'});
        HTSServices.HezecomPostNewInfo('patients/update', $scope.row)
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
                    $state.go('app.patients');
                });
            } else {
                console.log('not deleted');
            }
        });
    };

    $scope.programmez = ['Pre-Degree','B.Sc', 'Masters','Ph.D'];
    $scope.genderSelect = ['Male','Female'];
});

