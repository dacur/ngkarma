'use strict';

var app = angular.module('MainApp');

app.directive('brickContent',function(){

    function link(scope,element,attributes){
        scope.post = jQuery.parseJSON(scope.postData);
    }

    return {
        restrict: 'A',
        scope: {
            postData: '@'
        },
        link: link,
        templateUrl: '/templates/template.html'
    }
});