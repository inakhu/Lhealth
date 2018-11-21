/**
 * Created by hezecom on 4/9/2017.
 */
app.controller('AppointmentsCtrl', function($scope ,$state, HTSServices, $ionicFilterBar,$ionicLoading,$ionicPopup,USER_VARS) {

    $scope.current_page = 10;
    $scope.page_size = 20;
    $scope.moreDataCanBeLoaded = true;
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true;

    //var userData = USER_VARS.uData;
    var userData = localStorage.getItem("myusername")+'/'+localStorage.getItem("mytoken");

    $scope.HTSappLoader = function() {
        //$ionicLoading.show({template: 'Loading...'});
        HTSServices.HezecomGetOne('appointments/view/'+userData+'?page='+$scope.current_page).success(function (data) {
            $scope.appointments = data.data;
            $scope.totalItems = data.count;
            $scope.$broadcast('scroll.infiniteScrollComplete');

            if (($scope.totalItems < $scope.page_size) && ($scope.totalItems < $scope.current_page * $scope.page_size))
            {
                $scope.moreDataCanBeLoaded = false;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.current_page = $scope.current_page+5;
            //$ionicLoading.hide();
        });

    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.HTSappLoader();
    });

    $scope.HTSappLoaderSearch = function(sval) {
        //$ionicLoading.show();
        HTSServices.HezecomGetOne('appointments/search/'+userData+'/'+sval+'?page='+$scope.current_page).success(function (data) {
            $scope.appointments = data.data;
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
                HTSServices.HezecomDeleteInfo('appointments/delete/'+custId).success(function(data){
                    $scope.HTSappLoader();
                });
            } else {
                //console.log('not deleted');
            }
        });
    };

});

app.controller('AppointmentsDetails', function($scope, $stateParams , HTSServices,$cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet,$ionicLoading,$state,$ionicModal,USER_VARS) {
    var id = $stateParams.id;
    var ndate = $stateParams.ndate;
    var actualDate=null;
    $scope.row = {};
    var userData = localStorage.getItem("myusername")+'/'+localStorage.getItem("mytoken");
    $scope.DetailsLoader = function(id) {
        HTSServices.HezecomGetOne('appointments/details/' + id+'/'+userData).success(function (data) {
            $scope.row = data.data;
        });
    };
    $scope.DetailsLoader(id);

    /*delete*/
    $scope.deleteRecord = function(custId) {
        var confirmPopup = HTSServices.htsDeleteMSG($ionicPopup);
        confirmPopup.then(function(res) {
            if(res) {
                HTSServices.HezecomDeleteInfo('appointments/delete/'+custId).success(function(data){
                    $state.go('app.appointments');
                });
            } else {
                /*console.log('not deleted');*/
            }
        });
    };

    /*delete*/
    $scope.AppointmentApproval = function(custId) {
        var confirmPopup = HTSServices.htsConfirm($ionicPopup);
        confirmPopup.then(function(res) {
            if(res) {
                /*console.log(custId);*/
               HTSServices.HezecomDeleteInfo('appointments/approval/'+custId).success(function(data){
                    $scope.DetailsLoader(id);
                });
            }
        });
    };

});

app.controller('BookAppointments', function($scope, $stateParams , HTSServices,$cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet,$ionicLoading,$state,$ionicModal,USER_VARS) {
    var id = $stateParams.id;
    var ndate = $stateParams.ndate;
    var actualDate=null;
    $scope.row = {};

    var date = new Date();
    var cmonth=date.getMonth()+1;
    var cday=date.getDate();
    var cyear=date.getFullYear();

    if(!ndate){
        actualDate = cyear+'-'+cmonth+'-'+cday;
    }else{
        actualDate = ndate;
    }

    $scope.DoctorsLoader = function(actualDate) {
        HTSServices.HezecomGetOne('doctors/available/doc/'+ actualDate).success(function (data) {
            $scope.doctorsList = data.data;
            $scope.row.appDate=actualDate;
            //$scope.row.patientId = USER_VARS.myuserid;
            $scope.row.patientId = localStorage.getItem("myuserid");
        });
    };
    $scope.DoctorsLoader(actualDate);

    $scope.ClinicLocation = ['Ago-Iwoye Mini Campus','Ago-Iwoye Main Campus','Shagam Campus'];

    $ionicModal.fromTemplateUrl('templates/bookNow.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function(docId){
        $scope.modal.show();
        $scope.row.doctorId = docId;
    };
    $scope.closeModal = function(){
        $scope.modal.hide();
    };

    $scope.SubmitAppointment = function () {
        $ionicLoading.show({template: 'Loading...'});
        HTSServices.HezecomPostNewInfo('appointments/addnew', $scope.row)
            .success(function (data) {
                if (data.errors) {
                    $ionicPopup.alert({
                        title: 'Information',
                        template: 'Please complete the necessary fields.<br>'
                        +data.errors.CheckExist
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

});


