'use strict';

var app = angular.module('MainApp',['wu.masonry']);

// Controller for sub form.
app.controller('MainCtrl',function($scope, MainService){

    // Rotate sub input placeholder with popular subreddit suggestions.
    var subs = MainService.getDefaultSubs();
    setInterval(function(){
        var n = Math.floor(Math.random()*subs.length+1);
        $('#sub').attr('placeholder','r/' + subs[n]);
    },1500);

    // Load front page.
    getSubreddit();

    // Create Masonry object.
    var container = $('#brick-wall');
    container.masonry({
        columnWidth:  300,
        itemSelector: '.item'
    });

    // Update masonry layout regularly.
    setInterval(function(){
        reloadMasonry(false);
    },1000);

    // Get content from specified subreddit.
    $scope.getSub = function(){
        // Remove leading 'r/' if present.
        if(/^\/?r\//.test($scope.sub))
            $scope.sub = $scope.sub.replace(/^\/?r\//g,'');
        getSubreddit($scope.sub);
        $scope.sub = "";
    };

    // Check if post content is direct image link.
    $scope.isImage = function(url){
        return /jpg|png|gif$/i.test(url);
    };

        // Check if post is Imgur link.
    $scope.isImgur = function(dom){
        return /imgur\.com/.test(dom);
    };

    // Convert Imgur image links to large thumbnails.
    $scope.getImgurThumb = function(url){
        return url.replace(/(\.[a-zA-Z0-9]+)$/,"m$1");
    };

    // Check if post content is self post.
    $scope.isSelf = function(self){
        return self != null && self != "";
    };

    // Remove https from URLs.
    $scope.stripHttps = function(url){
        if(/^https:/i.test(url))
            return url.replace(/^https/i,'http');
        return url;
    };

    // Reload masonry.
    function reloadMasonry(reload){
        if(reload)
            container.masonry('reloadItems');
        container.masonry('layout');
    }

    // Load data from a given sub.
    function getSubreddit(sub){

        // Set loadingSub status.
        $scope.loadingSub = true;

        if(sub==undefined||sub==null||sub==""){
            // Invalid sub. Load front page.
            $.getJSON('http://www.reddit.com/.json',function(response){
                $scope.loadingSub = false;
                console.log(response.data)
                $scope.posts = response.data.children;
                $scope.$apply();
            })
        }else{
            // Get top data from requested sub.
            $.getJSON('http://www.reddit.com/r/' + sub + '/top.json?sort=top&t=week',function(response){
                $scope.loadingSub = false;
                $scope.posts = response.data.children;
                $scope.$apply();
            });
        }
    }

});