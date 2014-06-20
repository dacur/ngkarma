'use strict';

var app = angular.module('MainApp',['wu.masonry','ui.bootstrap']);

// Main Page Controller.
app.controller('MainCtrl',function($scope, $http, MainFactory, RedditApiService, MasonryService, CookieService, PostContent)
{

    // Used for infinite scroll logic.
    var win = $(window);
    var doc = $(document);

    // Set state of a few scope vars.
    $scope.loggedIn = false;
    $scope.connecting = false;
    $scope.posts = [];
    $scope.votes = {};
    $scope.currentSub = 'frontPage';
    $scope.sub = '';

    // Initialize token values from Cookie data.
    $scope.access_token = CookieService.getCookie("access_token");
    $scope.refresh_token = CookieService.getCookie("refresh_token");

    // Cycle through default subs in the subreddit input field.
    MainFactory.cycleSubs();

    // Set sub large display to match entered sub.
    $scope.$watch('sub',function(){
        if(/^[^r]/.test($scope.sub) || /^r[^/]/.test($scope.sub))
            $scope.subbigtext = 'r/' + $scope.sub;
        else $scope.subbigtext = $scope.sub;
    });

    // Update masonry layout regularly.
    setInterval(function(){
        MasonryService.reloadMasonry(false);
    },1000);

    // Create Masonry object.
    MasonryService.createBrickWall();

    // Get User Data if access token is available in the cookie.
    if($scope.access_token != null && $scope.access_token != ''){

        // Get user data using given access token.
        $scope.connecting = true;
        RedditApiService.getUserData($scope.access_token).success(function(response){

            // Set user object and subreddit list.
            if(typeof(response.user) == "object" && typeof(response.subs) == "object"){
                $scope.user = response.user;
                $scope.subs = response.subs;

                // If username is now known, set cookie and logged-in status.
                if($scope.user.hasOwnProperty('name')){
                    CookieService.setCookie('name', $scope.user.name,30);
                    $scope.connecting = false;
                    $scope.loggedIn = true;

                    // If subs list is now known, build new page with it.
                    if(typeof($scope.subs) == "object")
                        getPosts($scope.subs.join("+"));
                    else getPosts();
                }
            }
        });
    }

    // If no access token is available, just start loading posts.
    else getPosts();

    // Get content from specified subreddit.
    $scope.getSub = function(sub){
        // Remove leading 'r/' if present.
        if(/^\/?r\//.test(sub))
            sub = sub.replace(/^\/?r\//g,'');
        getPosts(sub);
    };

    // Reddit OAuth login.
    $scope.authorizeAccount = function(){
        RedditApiService.authorizeAccount();
    };

    // Remove OAuth data.
    $scope.deauthorizeAccount = function(){

        // Clear cookies.
        CookieService.deleteAllCookies();

        // Set logged in status to false.
        $scope.loggedIn = false;

        // Clear posts from Masonry.
        clearPosts();

        // Get new set of posts from Front page.
        getPosts('frontPage');
    };

    // Scroll to top of page.
    $scope.goToTop = function(){
        window.scrollTo(0, 0);
    };

    // Get human-readable age of post.
    $scope.getPostAge = function(p){
        return PostContent.getPostAge(p);
    };

    // Vote on posts.
    $scope.submitVote = function(id,likes,dir){
        if(CookieService.getCookie("access_token") != null && CookieService.getCookie("access_token") != ""){

            var up = $('#'+id+'_up');
            var down = $('#'+id+'_down');

            // Set vote status from Reddit data if not already set.
            if(typeof $scope.votes[id] === "undefined")
                $scope.votes[id] = likes;

            // If upvoting now...
            if(dir == 1){
                if($scope.votes[id] == 1)
                {
                    $scope.votes[id] = 0;
                    up.removeClass('up');
                }
                else
                {
                    $scope.votes[id] = 1;
                    up.addClass('up');
                    down.removeClass('down');
                }
            }

            // If downvoting now..
            else if(dir == -1){

                if($scope.votes[id] == -1)
                {
                    $scope.votes[id] = 0;
                    down.removeClass('down');
                }
                else
                {
                    $scope.votes[id] = -1;
                    down.addClass('down');
                    up.removeClass('up');
                }
            }

            RedditApiService.submitVote($scope.access_token,id,$scope.votes[id]).then(function(response){
                console.log(response)
            });

        }
    };

    // Get some posts!
    function getPosts(sub){

        // Prepare for if requesting a new sub...
        if(sub != $scope.currentSub && sub != undefined && sub != null && sub != ''){

            // Update currentSub value.
            $scope.currentSub = sub;

            // Clear 'after' page value.
            $scope.after = null;

            // Clear existing posts.
            clearPosts();
        }

        // If not already in the process of getting a new page..
        if(!$scope.gettingPage){

            // Set loading states.
            $scope.loadingSub = true;
            $scope.gettingPage = true;

            // Get posts using OAuth if access token is available.
            if($scope.access_token != undefined && $scope.access_token != null && $scope.access_token != ''){
                RedditApiService.getSubreddit($scope.access_token,$scope.currentSub,$scope.after).then(function(response){

                    // Unset loading states.
                    $scope.loadingSub = false;
                    $scope.gettingPage = false;

                    // Add new posts to posts array.
                    for(var i in response.data.data.children)
                        $scope.posts.push(response.data.data.children[i]);

                    // Set new 'after' value for next page.
                    $scope.after = response.data.data.after;

                    // Apply scope changes.
                    setTimeout(function(){
                        $scope.$apply();
                    },0);
                });
            }

            // If no access token is available, use the JSON API.
            else{

                // Set URL.
                var url = "http://www.reddit.com/r/" + $scope.currentSub + "/hot.json";
                if($scope.currentSub == "frontPage")
                    url = "http://www.reddit.com/hot.json";

                // Set 'after' value for request.
                var params = {
                    after: $scope.after
                };

                // Get new posts via JSON API.
                $.getJSON(url, params, function(response){

                    // Unset loading states.
                    $scope.loadingSub = false;
                    $scope.gettingPage = false;

                    // Add new posts to posts array.
                    for(var i in response.data.children)
                        $scope.posts.push(response.data.children[i]);

                    // Set new 'after' value for next page.
                    $scope.after = response.data.after;

                    // Apply scope changes.
                    $scope.$apply();
                });
            }
        }
    }

    // Clear posts.
    function clearPosts(){
        $scope.posts = [];
    }

    // Trigger when scrolling.
    win.scroll(function(){
        if(win.scrollTop() + 500 > doc.height() - win.height())
            getPosts();
        if(!$scope.scrolled && win.scrollTop() > 1000){
            $scope.scrolled = true;
            setTimeout(function(){
                $scope.$apply();
            },0);
        }else if($scope.scrolled && win.scrollTop() <= 1000){
            $scope.scrolled = false;
            setTimeout(function(){
                $scope.$apply();
            },0);
        }
    });

});

app.controller('ContentCtrl',function($scope){

    $scope.toggleDescription = function(id){
        $('#' + id).slideToggle();
    };

    $scope.embedYouTube = function(id,video_id){
        console.log('id: ' + id + ' video_id: ' + video_id);
        $('#' + id).html(
            '<iframe width="288" height="216" src="http://www.youtube.com/embed/' + video_id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>'
        );
    };
});