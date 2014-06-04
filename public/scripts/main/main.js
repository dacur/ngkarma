'use strict';

var app = angular.module('MainApp',['wu.masonry','youtube-api']);

// Controller for sub form.
app.controller('MainCtrl',function($scope, ApiService, SubService){



    // Set initial subreddit.
    var initSub = window.location.href.match(/\/r\/([a-zA-Z0-9]+)/);
    if(initSub != null && initSub[1] != null && initSub[1] != "")
        getSubreddit(initSub[1]); // Load specified sub.
    else getSubreddit(); // Load front page.

    // Rotate sub input placeholder with popular subreddit suggestions.
    var subs = SubService.getDefaultSubs();
    setInterval(function(){
        var n = Math.floor(Math.random()*subs.length+1);
        $('#sub').attr('placeholder','r/' + subs[n]);
    },1500);

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
    $scope.getSub = function(sub){
        // Remove leading 'r/' if present.
        if(/^\/?r\//.test(sub))
            sub = sub.replace(/^\/?r\//g,'');
        getSubreddit(sub);
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
        if(!(/\.gif$/).test(url))
            return url.replace(/(\.[a-zA-Z0-9]+)$/,"m$1");
        return url;
    };

    // Check if post is YouTube video link.
    $scope.isYouTube = function(dom, url){
        return (/youtube.com/.test(dom) && /watch/.test(url)) || /youtu.be/.test(dom)
    };

    // Get YouTube embed code.
    $scope.getYouTubeVideoId = function(dom,url){
        var video_id;
        if(/youtube.com/.test(dom))
            video_id = url.match(/[^a-zA-Z0-9]v=([a-zA-Z0-9-_]+)/);
        else if(/youtu.be/.test(dom))
            video_id = url.match(/youtu\.be\/([a-zA-Z0-9-_]+)/);
        if(video_id != undefined && video_id.length > 1)
            return video_id[1];
        return false;
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

    // Connect to Reddit.
    $scope.logIn = function(){
        var data = {
            username: $scope.r_user,
            password: $scope.r_pass
        }
        ApiService.Auth(data).success(function(response) {
            if(response.hasOwnProperty('user') && response.user.hasOwnProperty('data') && response.hasOwnProperty('subs')
                && response.subs.hasOwnProperty('data') && response.subs.data.hasOwnProperty('children'))
            {
                $scope.user = response.user.data;
                $scope.subs = response.subs.data.children;
                $scope.isLoggedIn = true;
            }
            console.log($scope.user);
        }).error(function(response) {
            console.log(response);
        });
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

    function parseUrl(key) {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
            function(m,key,value) {
                vars[key] = value;
            }
        );
        return vars[key];
    }

});