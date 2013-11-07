"use strict";

//   <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDcsWomnJ54vsm3Lwqm4ILkTLyA5BPB-nQ&sensor=false"></script>

var gmapsModule = angular.module('gmaps', []);

gmapsModule.directive('gmaps', function factory($timeout) {
    return {
        restrict: 'EA',
        template: '<div class="gmaps"></div>',
        replace: true,
        scope: {
            center: '=',
            zoom: '='
        },
        link: function postLink(scope, iElement, iAttrs) {

            var mapOptions = {
                zoom: scope.zoom,
                center: new google.maps.LatLng(scope.center.lat, scope.center.lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(iElement[0], mapOptions);

            scope.$watch('zoom', function () {
                map.setZoom(scope.zoom);
            });

            scope.$watch('center', function () {
                map.setCenter(new google.maps.LatLng(scope.center.lat, scope.center.lng));
            }, true);

            google.maps.event.addListener(map, 'zoom_changed', function () {
                $timeout(function () {
                    scope.zoom = map.getZoom();
                });
            });

            google.maps.event.addListener(map, 'center_changed', function () {
                $timeout(function () {
                    var center = map.getCenter();
                    scope.center.lat = center.lat();
                    scope.center.lng = center.lng();
                });
            });

        }
    };
});
