'use strict';

var app = angular.module('MainApp',['wu.masonry']);

// Controller for sub form.
app.controller('MainCtrl',function($scope){

    // Create Masonry object.
    var container = $('#brick-wall');
    container.masonry({
        columnWidth:  300,
        itemSelector: '.item'
    });

    // Update masonry layout regularly.
    setInterval(function(){
        console.log("Updating layout...");
        reloadMasonry(false);
    },2000);

    // Get content from specified subreddit.
    $scope.getSub = function(){

        // Remove leading 'r/' if present.
        if(/^\/?r\//.test($scope.sub))
            $scope.sub = $scope.sub.replace(/^\/?r\//g,'');

        // Get top data from requested sub.
        $.getJSON('http://www.reddit.com/r/' + $scope.sub + '/top.json?sort=top&t=week',function(response){
            $scope.posts = response.data.children;
        })
    };

    // Check if post content is JPG image link.
    $scope.checkTypeByUrl = function(url){

        // Check if post is image.
        if(/jpg|png|gif$/i.test(url))
            return "image";

        // Check if post is Imgur link, but not directly to image. TODO: Detect and handle Imgur galleries.
        else if(/imgur\.com.*\/[^.]+$/.test(url))
            return "imgur";

        else return false;

    };

    // Check if post content is self post.
    $scope.isSelf = function(self){
        return self != null && self != "";
    };

    // Reload masonry.
    function reloadMasonry(reload){
        if(reload)
            container.masonry('reloadItems');
        container.masonry('layout');
    };

});