/*Ionic Starter App*/
angular.module('HezecomApp',[
    'ionic',
    'ngCordova',
    'jett.ionic.filter.bar',
    'ionic-modal-select',
    'ion-datetime-picker',
    'ion-floating-menu',
    'htsApp.controllers',
    'htsApp.services',
    'htsApp.constants'
])

    .run(function($ionicPlatform , $rootScope, $location, HTSServices,$ionicPopup) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.confirm({
                        title: 'No Internet Connection',
                        content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
                    })
                        .then(function(result) {
                            if(!result) {
                                ionic.Platform.exitApp();
                            }
                        });
                }
            }
        });

        $rootScope.authStatus = false;
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            $rootScope.authStatus = toState.authStatus;
            if ($rootScope.authStatus===true && HTSServices.UsersAuth()===null) {
                $location.path('/dashboard');
            }
        });
    })

    .config(function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http?):\/\/(w{3}.)?nftvapp\.com/.+$')]);
    })

    .filter('validUrl', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                cache: true,
                templateUrl: 'app/templates/others/menu.html',
                controller: 'DashCtrl'
            })

            .state('login', {
                url: '/login',
                templateUrl: 'app/templates/users/tab-signin.html',
                controller: 'userLoginCtrl',
                authStatus: false
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'app/templates/users/tab-signup.html',
                controller: 'userSignupCtrl',
                authStatus: false
            })
            .state('UserLost', {
                url: '/lost',
                templateUrl: 'app/templates/users/lost-password.html',
                controller: 'userLostPasswordCtrl',
                authStatus: false
            })

            .state('app.dashboard', {
                url: '/dashboard',
                views: {
                    'menuContent': {
                        templateUrl: 'app/templates/others/dashboard.html',
                        controller: 'DashCtrl'
                    }
                },
                authStatus: true
            })
            /*Users*/
            .state('app.profiles', {
                url: '/profiles',
                views: {
                    'menuContent': {
                        templateUrl: 'app/templates/users/profiles.html',
                        controller: 'ProfilesCtrl'
                    }
                },
                authStatus: true
            })
            .state('app.profileDetails', {
                url: '/profile/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'app/templates/users/profile-detail.html',
                        controller: 'UeserDetails'
                    }
                },
                authStatus: true
            })
            .state('app.UserUpdate', {
                url: '/profile/update/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'app/templates/users/Update.html',
                        controller: 'UeserDetails'
                    }
                },
                authStatus: true
            })
            .state('app.UserAdd', {
                url: '/profile/add',
                views: {
                    'menuContent': {
                        templateUrl: 'app/templates/users/Add.html',
                        controller: 'userSignupCtrl'
                    }
                },
                authStatus: true
            })
            .state('app.UserUpload', {
                url: '/profile/upload/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'app/templates/users/Upload.html',
                        controller: 'UeserDetails'
                    }
                },
                authStatus: true
            })
            .state('app.uploader', {
                url: '/uploader',
                views: {
                    'menuContent': {
                        templateUrl: 'app/templates/main/Upload.html',
                        controller: 'MainCtrl'
                    }
                },
                authStatus: false
            })
            .state('app.videouploader', {
                url: '/video',
                views: {
                    'menuContent': {
                        templateUrl: 'app/templates/iwitness/Upload2.html',
                        controller: 'VideoUploaderCtrl'
                    }
                },
                authStatus: false
            })


            /*Main*/
            .state('app.verify', {
                url: '/verify',
                views: {
                    'menuContent': {
                        templateUrl: 'app/templates/main/verify.html',
                        //controller: 'MainCtrl'
                    }
                },
                authStatus: true
            })
            .state('app.accredit', {
                url: '/accredit',
                views: {
                    'menuContent': {
                        templateUrl: 'app/templates/main/create.html',
                        //controller: 'MainCtrl'
                    }
                },
                authStatus: true
            })
            .state('app.vsuccess', {
                url: '/vsuccess',
                views: {
                    'menuContent': {
                        templateUrl: 'app/templates/main/hospital.html',
                        controller: 'MainCtrl'
                    }
                },
                authStatus: true
            });

        $urlRouterProvider.otherwise('/app/dashboard');
    });
