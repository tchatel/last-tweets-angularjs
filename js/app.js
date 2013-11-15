"use strict";

var module = angular.module('lasttweets', ['ngSanitize', 'gmaps']);

module.config(function ($routeProvider) {
    $routeProvider.when('/tweets', {
        templateUrl: 'partials/tweets.html',
        controller: 'TweetsCtrl'
    });
    $routeProvider.when('/user/:id', {
        templateUrl: 'partials/user.html',
        controller: 'UserCtrl'
    });
    $routeProvider.when('/map/:id', {
        templateUrl: 'partials/map.html',
        controller: 'MapCtrl'
    });
    $routeProvider.otherwise({
       redirectTo: '/tweets'
    });
});

module.value('search', {});

module.controller('TweetsCtrl', function ($scope, $http, $timeout, search) {

    var url = 'http://www.methotic.com/apps/twitter-demo/search?q=angularjs&count=50';
    // -> statuses : { id_str, text, created_at, user: {id_str, screen_name, name, profile_image_url},
    //        coordinates: {"type":"Point","coordinates":[-77.01982413,-12.10552557]} }

    function load() {
        $scope.loading = true;
        $http.get(url).success(function (data) {
            $scope.tweets = data.statuses;
            $scope.loading = false;
        });
        $timeout(load, 10 * 1000);
    }
    load();

    $scope.search = search;
});

module.controller('UserCtrl', function ($scope, $http, $routeParams) {

    var url = 'http://www.methotic.com/apps/twitter-demo/profile?id=' + $routeParams.id;
    // -> { id_str, screen_name, name, description, location, profile_image_url,
    //        profile_use_background_image, profile_background_image_url,
    //        statuses_count, followers_count, friends_count }

    $http.get(url).success(function (data) {
        $scope.user = data;
        $scope.user.profile_image_url_bigger = $scope.user.profile_image_url.replace('_normal', '_bigger');
        $scope.style = {
            "background-image": "url(" + $scope.user.profile_background_image_url + ")"
        };
    });

});

module.controller('MapCtrl', function ($scope, $http, $routeParams) {
    var url = 'http://www.methotic.com/apps/twitter-demo/tweet?id=' + $routeParams.id;
    // -> { id_str, text, created_at, user: {screen_name, name, profile_image_url},
    //        coordinates: {"type":"Point","coordinates":[-77.01982413,-12.10552557]} }

    $http.get(url).success(function (data) {
        $scope.tweet = data;
        $scope.map = {
            center: {
                lat: $scope.tweet.coordinates.coordinates[1],
                lng: $scope.tweet.coordinates.coordinates[0]
            },
            zoom: 7
        };
    });
});


module.filter('age', function () {
    return function (input) {
        var sec = (new Date() - Date.parse(input)) / 1000;
        var min = sec / 60;
        var hour = min / 60;
        if (hour >= 1) {
            return Math.floor(hour) + " h";
        } else if (min >= 1) {
            return Math.floor(min) + " min";
        } else {
            return Math.floor(sec) + " s";
        }
    }
});


module.filter('decode_html_entities', function () {
    return function (input) {
		return input.replace(/&amp;/g,'&');		
    }
});


