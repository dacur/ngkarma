'use strict';

var app = angular.module('MainApp',['wu.masonry','youtube-api']);

// Controller for sub form.
app.controller('MainCtrl',function($scope, $http, MainService, ApiService, MasonryService, CookieService){

    /**
     * Start Init
     */
    var currentSub; // Keep track of currently requested subs.
    $scope.loading = false; // Disable loading gif on load.
    MainService.cycleSubs(); // Cycle through default subs in the subreddit input field.

    // Initialize token values from Cookie data.
    $scope.access_token = CookieService.getCookie("access_token");
    $scope.refresh_token = CookieService.getCookie("refresh_token");

    // Get User Data
    ApiService.getUserData($scope.access_token);

    // Set initial subreddit.
    var initSub = window.location.href.match(/\/r\/([a-zA-Z0-9]+)/);
    if(initSub != null && initSub[1] != null && initSub[1] != "")
        getSubreddit(initSub[1]); // Load specified sub.
    else if($scope.subs != null || $scope.subs != "")
        getSubreddit($scope.subs);
    else getSubreddit(); // Load front page.

    // Create Masonry object.
    MasonryService.createBrickWall();

    // Update masonry layout regularly.
    setInterval(function(){
        MasonryService.reloadMasonry(false);
    },1000);

    // Get content from specified subreddit.
    $scope.getSub = function(sub){
        // Remove leading 'r/' if present.
        if(/^\/?r\//.test(sub))
            sub = sub.replace(/^\/?r\//g,'');
        getSubreddit(sub);
        $scope.sub = "";
    };
    /**
     * End Init
     */

    /**
     * Start Reddit Interaction Methods
     */

    // Reddit OAuth login. TODO: Move to service.
    $scope.authorizeAccount = function(){
        var auth_url = "https://ssl.reddit.com/api/v1/authorize";
        var client_id = "dKiLKnbGc8ufQw";
        var response_type = "code";
        var state = Math.random().toString(36).match(/0\.(.*)/)[1];
        var redirect_uri = "http://spreddit.multifarious.org:7777/redirect";
        var duration = "permanent";
        var scope = "identity,mysubreddits";

        CookieService.setCookie("state",state,30);

        window.location.href = auth_url +
            "?client_id=" + client_id +
            "&response_type=" + response_type +
            "&state=" + state +
            "&redirect_uri=" + redirect_uri +
            "&duration=" + duration +
            "&scope=" + scope;
    };

    $scope.deauthorizeAccount = function(){
        // TODO: Clear cookies and load front page.
    };

    // Load data from a given sub.
    function getSubreddit(sub){
        $scope.loadingSub = true;
        if(sub==undefined||sub==null||sub==""){
            // Invalid sub. Load front page.
            $.getJSON('http://www.reddit.com/.json',function(response){
                currentSub = "frontPage";
                $scope.loadingSub = false;
                $scope.posts = response.data.children;
                $scope.after = response.data.after;
                $scope.$apply();
            })
        }else{
            // Get top data from requested sub.
            $.getJSON('http://www.reddit.com/r/' + sub + '/hot.json?sort=hot&t=week',function(response){
                currentSub = sub;
                $scope.loadingSub = false;
                $scope.posts = response.data.children;
                $scope.after = response.data.after;
                $scope.$apply();
            });
        }
    }
    /**
     * End Reddit Interaction Methods
     */

    /**
     * Start Infinite Scroll Logic
     */
    // Get more posts.
    function getNextPage(){

        if(!$scope.gettingPage)
        {
            if($scope.after == null || $scope.after == "")
                return false;

            var params = {
                after: $scope.after
            }

            $scope.loadingSub = true;
            $scope.gettingPage = true;

            var url;
            if(currentSub == "frontPage")
                url = "http://www.reddit.com/.json?sort=hot";
            else
                url = "http://www.reddit.com/r/" + currentSub + "/hot.json?sort=hot&t=week";

            $.getJSON(url, params, function(response){

                $scope.loadingSub = false;
                $scope.gettingPage = false;

                for(var i in response.data.children)
                {
                    $scope.posts.push(response.data.children[i]);
                }

                // Remove bricks if too many are loaded.
//                if($scope.posts.length > 100)
//                    $scope.posts.splice(0,$scope.posts.length/2);

                $scope.after = response.data.after;
                $scope.$apply();
            });
        }
    }

    // Infinite scroll testing.
    var win = $(window),
        doc = $(document);

    win.scroll(function(){
        if( win.scrollTop() + 300 > doc.height() - win.height() ) {
            getNextPage();
        }
    });
    /**
     * End Infinite Scroll Logic
     */


    /**
     * Start Content Helper Methods
     */
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
    /**
     * End Content Helper Methods
     */

});