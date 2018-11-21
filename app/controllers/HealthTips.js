/**
 * Created by Hezecom on 4/28/2017.
 */

// FEED
//brings all feed categories
/*
 app.controller('FeedsCategoriesCtrl', function($scope, $http) {
 $scope.feeds_categories = [];

 $http.get('feeds-categories.json').success(function(response) {
 $scope.feeds_categories = response;
 });
 })

 //bring specific category providers
 .controller('CategoryFeedsCtrl', function($scope, $http, $stateParams) {
 $scope.category_sources = [];

 $scope.categoryId = $stateParams.categoryId;

 $http.get('feeds-categories.json').success(function(response) {
 var category = _.find(response, {id: $scope.categoryId});
 $scope.categoryTitle = category.title;
 $scope.category_sources = category.feed_sources;
 });
 })

 //this method brings posts for a source provider
 .controller('FeedEntriesCtrl', function($scope, $stateParams, $http, FeedList, $q, $ionicLoading, BookMarkService) {
 $scope.feed = [];

 var categoryId = $stateParams.categoryId,
 sourceId = $stateParams.sourceId;

 $scope.doRefresh = function() {

 $http.get('feeds-categories.json').success(function(response) {

 $ionicLoading.show({
 template: 'Loading entries...'
 });

 var category = _.find(response, {id: categoryId }),
 source = _.find(category.feed_sources, {id: sourceId });

 $scope.sourceTitle = source.title;

 FeedList.get(source.url)
 .then(function (result) {
 $scope.feed = result.feed;
 $ionicLoading.hide();
 $scope.$broadcast('scroll.refreshComplete');
 }, function (reason) {
 $ionicLoading.hide();
 $scope.$broadcast('scroll.refreshComplete');
 });
 });
 };

 $scope.doRefresh();

 $scope.bookmarkPost = function(post){
 $ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
 BookMarkService.bookmarkFeedPost(post);
 };
 });
 */

/*app.controller('Healthtips', function($scope,$http) {

 $scope.init = function() {
 $http.get("http://ajax.googleapis.com/ajax/services/feed/load", { params: { "v": "1.0", "q": "http://www.health.com/fitness/feed/" } })
 .success(function(data) {
 $scope.rssTitle = data.responseData.feed.title;
 $scope.rssUrl = data.responseData.feed.feedUrl;
 $scope.rssSiteUrl = data.responseData.feed.link;
 $scope.entries = data.responseData.feed.entries;
 window.localStorage["entries"] = JSON.stringify(data.responseData.feed.entries);
 })
 .error(function(data) {
 console.log("ERROR: " + data);
 if(window.localStorage["entries"] !== undefined) {
 $scope.entries = JSON.parse(window.localStorage["entries"]);
 }
 });

 var result = $filter('filter')(foo.results, {id:2})[0];
 $scope.name = result.name;
 }
 });*/

app.controller('Healthtips', function($scope, $http) {

        $http.get('MOCK_DATA.json').success(function(data){
            $scope.dataSet = data;

            //day of the year
            var now = new Date();
            var CurrentDate = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2);
            var now = new Date(CurrentDate);
            var start = new Date(now.getFullYear(), 0, 0);
            var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
            var oneDay = 1000 * 60 * 60 * 24;
            var day = Math.floor(diff / oneDay);
            console.log('Day of year: ' + day);
            var currentDay=3-1;
            console.log('Current Array: ' + currentDay);
            //end

            $scope.current = $scope.dataSet[currentDay],
                $scope.next = function(){
                    var i = $scope.getIndex($scope.current.id, 1);
                    $scope.current = $scope.dataSet[i];
                },
                $scope.previous = function(){
                    var i = $scope.getIndex($scope.current.id, -1);
                    $scope.current = $scope.dataSet[i];
                },
                $scope.getIndex = function(currentIndex, shift){
                    var len = $scope.dataSet.length;
                    return (((currentIndex + shift) + len) % len)
                }

            $scope.openDetails = function(data){
                var fullArrayLength = $scope.dataSet.length - 1;
                $scope.dataSet = data;
                var index= $scope.dataSet.indexOf(data);
                $scope.index = index;
                if(fullArrayLength == $scope.index){
                    $scope.mydisabled2 = true;
                }else if($scope.index == 0){
                    $scope.mydisabled1 = true;
                }else{
                    $scope.mydisabled1 = false;
                    $scope.mydisabled2 = false;
                }
                var allData = $scope.dataSet[$scope.index];
                $scope.current = allData;
            }
        });



        var date = new Date();
        $scope.CurrentDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    }
);

/*app.controller('Healthtips', function($http, $ionicPlatform, $scope, $cordovaNetwork, $ionicLoading, $state,HTSServices) {

 $ionicLoading.show({
 template: 'Loading...'
 });

 $scope.HTSappLoader = function() {
 HTSServices.HezecomGetOne('MOCK_DATA.json').success(function (data) {
 $scope.entries = data;
 $ionicLoading.hide();
 });
 };
 $scope.HTSappLoader();
 });*/

/*
 app.controller('HealthtipOne', function($scope, $rootScope, $location, $stateParams) {

 var id = $stateParams.index;

 $ionicLoading.show({
 template: 'Loading...'
 });

 HTSServices.HezecomGetOne('feeds/healthtips/' + id).success(function (data) {
 $scope.entrie = data.data;
 $ionicLoading.hide();
 });
 });
 */

app.controller('MyGeneralCtrl', function($scope, $timeout, HTSServices) {
    $scope.items = [];
    $scope.newItems = [];
    var pageSize = 8;
    var newSize = 2;

    /* PersonService.GetFeed().then(function(items){
     $scope.items = items;
     });*/
    $scope.HTSappLoader = function(pageSize) {
        HTSServices.HezecomGetOne('users/view?page=' + pageSize).success(function (data) {
            $scope.items = data.data;
        });
    };
    $scope.HTSappLoader(pageSize);

    $scope.doRefresh = function() {
        if($scope.newItems.length > 0){
            $scope.items = $scope.newItems.concat($scope.items);

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');

            $scope.newItems = [];
        } else {
            HTSServices.HezecomGetOne('users/view?page=' + newSize).success(function(items){
                $scope.items = items.data.concat($scope.items);

                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
    };

    $scope.loadMore = function(){
        HTSServices.HezecomGetOne('users/view?page=' + pageSize).success(function(items) {
            $scope.items = $scope.items.data.concat(items);

            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    var CheckNewItems = function(){
        $timeout(function(){
            HTSServices.HezecomGetOne('users/view?page=' + newSize).success(function(items){
                $scope.newItems = items.data.concat($scope.newItems);

                CheckNewItems();
            });
        },10000);
    };

    CheckNewItems();
});

app.controller('WordpressCtrl', function( $scope, $http ) {
    var dataURL = "http://thehealthwise.org/wp-json/posts?_jsonp=JSON_CALLBACK";
    $http.jsonp( dataURL ).success( function( data, status, headers, config ) {
        $scope.posts = data;
    }).
    error( function( data, status, headers, config ) {
        console.log( 'error' );
    });
});

app.controller('loadController', function ($scope, $http) {
    $http.get('MOCK_DATA.json')
        .success(function (data) {
            $scope.myJsonData = data;
        });
});