/**
 * Created by admin on 3/31/2017.
 */
app.controller('DoctorsCtrl', function($scope ,$state, HTSServices, $ionicFilterBar,$ionicLoading,$ionicPopup) {

    $scope.current_page = 10;
    $scope.page_size = 20;
    $scope.moreDataCanBeLoaded = true;
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true;

    $scope.HTSappLoader = function() {
        $ionicLoading.show({template: 'Loading...'});
        HTSServices.HezecomGetOne('doctors/view?page='+$scope.current_page).success(function (data) {
            $scope.doctors = data.data;
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
        //$ionicLoading.show();
        HTSServices.HezecomGetOne('doctors/search/'+sval+'?page='+$scope.current_page).success(function (data) {
            $scope.doctors = data.data;
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
                HTSServices.HezecomDeleteInfo('doctors/delete/'+custId).success(function(data){
                    $scope.HTSappLoader();
                });
            } else {
                console.log('not deleted');
            }
        });
    };

});

app.controller('DoctorsDetails', function($scope, $stateParams , HTSServices,$cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet,$ionicLoading,$state,$ionicModal) {
    var id = $stateParams.id;
    $scope.row = {};
    $scope.DetailsLoader = function(id) {
        HTSServices.HezecomGetOne('doctors/one/' + id).success(function (data) {
            $scope.row = data.data;
            $scope.availab = data.availab;
        });
    };
    $scope.DetailsLoader(id);

    var currentTime = new Date();
    $scope.currentTime = currentTime;
    /*update*/
    /*$scope.dayz={};
    $scope.HTSformat=function(){
        $scope.modifyNum=[];
        angular.forEach($scope.dayz, function(value, key) {
            if(value){
                $scope.modifyNum.push(parseInt(key));
            }
        });
    };*/
    $scope.genderSelect = ['Male','Female'];
    $scope.availSelect = ['Available','Unavailable'];
    $scope.WorkDays = [
        {wdays: 'Sun'},
        {wdays: 'Mon'},
        {wdays: 'Tue'} ,
        {wdays: 'Wed'},
        {wdays: 'Thu'},
        {wdays: 'Fri'},
        {wdays: 'Sat'}
    ];
    $scope.checkItems = {};
    $scope.printChecks = function() {
        console.log($scope.checkItems);
    };

    $scope.saveChecks = function() {
        var datarray = [];
        var i;
        for(i in $scope.checkItems) {
            console.log($scope.checkItems[i]);
            if($scope.checkItems[i] == true) {
                datarray.push(i);
            }
        }
        //console.log(datarray);
        HTSServices.HezecomGetOne('doctors/wdays/'+datarray+'/'+$scope.row.userid).success(function (data) {
            $scope.DetailsLoader(id);
            $scope.modal.hide();
        });
    };

    $ionicModal.fromTemplateUrl('templates/workDays.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function(){
        $scope.modal.show();
    };
    $scope.closeModal = function(){
        $scope.modal.hide();
    };


    $scope.HTSupdateDoctor = function () {
        $ionicLoading.show({template: 'Loading...'});
        HTSServices.HezecomPostNewInfo('doctors/update', $scope.row)
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
                HTSServices.HezecomDeleteInfo('doctors/delete/'+custId).success(function(data){
                    $state.go('app.doctors');
                });
            } else {
                console.log('not deleted');
            }
        });
    };

});

