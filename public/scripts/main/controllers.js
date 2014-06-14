'use strict';

var app = angular.module('MainApp',['wu.masonry','youtube-api']);

// Controller for sub form.
app.controller('MainCtrl',function($scope, $http, MainFactory, PostContentFactory, ApiService, MasonryService, CookieService)
{
    /**
     * Start Init
     */
    var currentSub; // Keep track of currently requested subs.
    MainFactory.cycleSubs(); // Cycle through default subs in the subreddit input field.
    $scope.loggedIn = false;
    $scope.connecting = false;
    $scope.sub = '';

    // Initialize token values from Cookie data.
    $scope.access_token = CookieService.getCookie("access_token");
    $scope.refresh_token = CookieService.getCookie("refresh_token");

    // Set sub large display to match entered sub.
    $scope.$watch('sub',function(){
        if(/^[^r]/.test($scope.sub) || /^r[^/]/.test($scope.sub))
            $scope.subbigtext = 'r/' + $scope.sub;
        else
            $scope.subbigtext = $scope.sub;
    });

    // Update masonry layout regularly.
    setInterval(function(){
        MasonryService.reloadMasonry(false);
    },1000);

    // Create Masonry object.
    MasonryService.createBrickWall();

    // Get User Data
    if($scope.access_token != null && $scope.access_token != "")
    {
        $scope.connecting = true;

        // Try to get user data.
        ApiService.getUserData($scope.access_token).success(function(response)
        {
            if(typeof(response.user) == "object" && typeof(response.subs) == "object")
            {
                // Set username and subreddit list.
                $scope.user = response.user;
                $scope.subs = response.subs;

                // If username is now known, set cookie and logged-in status.
                if($scope.user.hasOwnProperty('name'))
                {
                    CookieService.setCookie('name', $scope.user.name,30);
                    $scope.connecting = false;
                    $scope.loggedIn = true;

                    // If subs list is now known, build new page with it.
                    if($scope.subs != null && $scope.subs != "")
                    {
                        // TODO: This loads user subs on page load, even if URL contains reddit-style subreddit specification. Fix!
                        if(typeof($scope.subs) == "object")
                            getSub($scope.subs.join("+"));
                        else $scope.getFrontPage();
                    } else getUrlSub();
                } else getUrlSub();
            } else getUrlSub();
        });
    } else getUrlSub();

    // Get content from specified subreddit.
    $scope.getSub = function(sub)
    {
        // Remove leading 'r/' if present.
        if(/^\/?r\//.test(sub))
            sub = sub.replace(/^\/?r\//g,'');
        getSub(sub);
    };
    /**
     * End Init
     */

    /**
     * Start Reddit Interaction Methods
     */
    // Reddit OAuth login.
    $scope.authorizeAccount = function()
    {
        var auth_url = "https://ssl.reddit.com/api/v1/authorize";
        var client_id = "dKiLKnbGc8ufQw";
        var response_type = "code";
        var state = Math.random().toString(36).match(/0\.(.*)/)[1];
        var redirect_uri = "http://spreddit.multifarious.org:7777/redirect";
        var duration = "permanent";
        var scope = "identity,mysubreddits,read,vote";

        CookieService.setCookie("state",state,30);

        window.location.href = auth_url +
            "?client_id=" + client_id +
            "&response_type=" + response_type +
            "&state=" + state +
            "&redirect_uri=" + redirect_uri +
            "&duration=" + duration +
            "&scope=" + scope;
    };

    // Log out.
    $scope.deauthorizeAccount = function()
    {
        CookieService.deleteAllCookies();
        $scope.loggedIn = false;
        $scope.getFrontPage();
    };

    // Load front page. TODO: Use OAuth if logged in.
    function getFrontPage()
    {
        $scope.loadingSub = true;
        $.getJSON('http://www.reddit.com/.json',function(response){
            currentSub = "frontPage";
            $scope.loadingSub = false;
            $scope.sub = '';
            $scope.posts = response.data.children;
            $scope.after = response.data.after;
            $scope.$apply();
        });
    };
    $scope.getFrontPage = function(){
        getFrontPage();
    };

    // Load subreddit specified in URL.
    function getUrlSub()
    {
        var initSub = window.location.href.match(/\/r\/([a-zA-Z0-9]+)/);
        if(initSub != null && initSub[1] != null && initSub[1] != "")
            getSub(initSub[1]);
        else getFrontPage();
    };

    // Get top data from requested sub.
    function getSub(sub)
    {
        currentSub = sub;
        $scope.loadingSub = true;
        $scope.subbigtext = "Loading...";
        var token = CookieService.getCookie('access_token');
        if(token != undefined && token != null && token != ""){
            ApiService.getSubreddit(token,sub,null).then(function(response){
                $scope.loadingSub = false;
                $scope.subbigtext = $scope.sub;
                $scope.posts = response.data.data.children;
                $scope.after = response.data.data.after;
                setTimeout(function(){
                    $scope.$apply();
                });
            });
        }
        else
        {
            $.getJSON('http://www.reddit.com/r/' + sub + '/hot.json',function(response){
                $scope.loadingSub = false;
                $scope.subbigtext = $scope.sub;
                $scope.posts = response.data.children;
                $scope.after = response.data.after;
                $scope.$apply();
            });
        }
    }

    // Vote on posts.
    $scope.submitVote = function(id,likes,dir)
    {
        var token = CookieService.getCookie('access_token');
        if(token != undefined && token != null && token != ""){

            //TODO: These votes work just fine, but the colors don't disappear when trying to remove an upvote or downvote.
            //TODO: The reason is the "likes" value never changes with the votes, since it is set by the original API call to reddit.
            //TODO: Fix is maybe keep an array in $scope to keep track. Won't matter if a refresh happens, since reddit keeps a copy. :)
            var up = $('#'+id+'_up');
            var down = $('#'+id+'_down');

            // If upvoting now...
            if(dir == 1){

                // Set upvote color and keep direction as 1.
                up.addClass('up');

                // If previously downvoted, clear downvote.
                if(!likes && likes != null)
                    down.removeClass('down');

                // If previously upvoted, clear upvote color and set direction to 0.
                if(likes && likes != null){
                    up.removeClass('up');
                    dir = 0;
                }

            }

            // If downvoting now..
            else if(dir == -1){

                // Set downvote color and keep direction as -1.
                down.addClass('down');

                // If previously upvoted, clear upvote.
                if(likes && likes != null)
                    up.removeClass('up');

                // If previously downvoted, clear downvote color and set direction to 0.
                if(!likes && likes != null){
                    down.removeClass('down');
                    dir = 0;
                }
            }

            ApiService.submitVote(token,id,dir).then(function(response){
                console.log(response); // TODO: Handle errors here.
            });

        }
        else
        {
            console.log("Votes don't count if you're not logged in!");
        }
    };
    /**
     * End Reddit Interaction Methods
     */

    /**
     * Start Scroll Logic
     */
    // Get more posts.
    function getNextPage()
    {
        if(!$scope.gettingPage)
        {
            if($scope.after == null || $scope.after == "")
                return false;

            $scope.loadingSub = true;
            $scope.gettingPage = true;

            var token = CookieService.getCookie('access_token');
            if(token != undefined && token != null && token != ""){
                ApiService.getSubreddit(token,currentSub,$scope.after).then(function(response){
                    $scope.loadingSub = false;
                    $scope.gettingPage = false;
                    for(var i in response.data.data.children)
                        $scope.posts.push(response.data.data.children[i]);
                    $scope.after = response.data.data.after;
                    setTimeout(function(){
                        $scope.$apply();
                    });
                });
            }
            else
            {
                var url;
                if(currentSub == "frontPage")
                    url = "http://www.reddit.com/hot.json";
                else
                    url = "http://www.reddit.com/r/" + currentSub + "/hot.json";

                var params = {
                    after: $scope.after
                }

                $.getJSON(url, params, function(response){
                    $scope.loadingSub = false;
                    $scope.gettingPage = false;
                    for(var i in response.data.children)
                        $scope.posts.push(response.data.children[i]);
                    $scope.after = response.data.after;
                    $scope.$apply();
                });
            }
        }
        return true;
    }

    // Infinite scroll testing.
    var win = $(window),
        doc = $(document);

    // Trigger when scrolling.
    win.scroll(function(){

        // If near bottom of page.
        if(win.scrollTop() + 500 > doc.height() - win.height())
            getNextPage();

        // Set scroll state based on distance from top of page.
        if(!$scope.scrolled && win.scrollTop() > 1000)
        {
            $scope.scrolled = true;
            setTimeout(function(){
                $scope.$apply();
            });
        } else if($scope.scrolled && win.scrollTop() <= 1000)
        {
            $scope.scrolled = false;
            setTimeout(function(){
                $scope.$apply();
            });
        }

    });

    $scope.goToTop = function(){
        window.scrollTo(0, 0);
    };
    /**
     * End Scroll Logic
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
    // Get age of post.
    $scope.getPostAge = function(p){
        return PostContentFactory.getPostAge(p);
    };
    /**
     * End Content Helper Methods
     */

});