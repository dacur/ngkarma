'use strict';

var app = angular.module('MainApp',['wu.masonry']);

// Controller for sub form.
app.controller('MainCtrl',function($scope){

    // Create Masonry object.
    var container = document.querySelector('#brick-wall');
    var masonry = new Masonry( container, {
        columnWidth: 300,
        itemSelector: '.brick'
    });

    // Get content from specified subreddit.
    $scope.getSub = function(){

        // Remove leading 'r/' if present.
        if(/^\/?r\//.test($scope.sub))
            $scope.sub = $scope.sub.replace(/^\/?r\//g,'');

        // Get top data from requested sub.
        $.getJSON('http://www.reddit.com/r/' + $scope.sub + '/top.json?sort=top&t=week',function(response){
            console.log(response);
            $scope.posts = response.data.children;
            masonry.reloadItems();
        })
    };

    // Check if post content is JPG image link.
    $scope.isImage = function(url){
        return /jpg|png|gif$/i.test(url);
    };

    // Check if post is Imgur link, but not directly to image. TODO: Detect and handle Imgur galleries.
    $scope.isImgur = function(url){
        return /imgur\.com.*\/[^.]+$/.test(url);
    };

    // Check if post content is self post.
    $scope.isSelf = function(self){
        return self != null && self != "";
    };

});