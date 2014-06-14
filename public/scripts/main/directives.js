'use strict';

var app = angular.module('MainApp');

app.directive('brickContent',function(){

    function link(scope,element,attributes)
    {
        var post = jQuery.parseJSON(scope.post);
        console.log(post.domain);
    }

    return {
        restrict: 'A',
        transclude: true,
        scope: {
            post: '@postData'
        },
        link: link
    }
});