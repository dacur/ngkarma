'use strict';

var app = angular.module('MainApp',['wu.masonry','ui.bootstrap','ngSanitize']);

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
    $scope.currentSub = '';
    $scope.submitButton = 'submit';
    $scope.sub = '';

    // Initialize token values from Cookie data.
    $scope.access_token = CookieService.getCookie("access_token");
    $scope.refresh_token = CookieService.getCookie("refresh_token");

    // Cycle through default subs in the subreddit input field.
    MainFactory.cycleSubs();

    // Set sub large display to match entered sub.
    $scope.$watch('sub',function(newVal,oldVal){
        $scope.submitButton = 'submit';
        if($scope.sub==null||$scope.sub==''){
            $scope.subbigtext = '';
            return;
        }
        var subs = $scope.sub.replace(/\s/g,'').split('+');
        for(var i = 0;i<subs.length;i++)
            if(!/^r\//.test(subs[i]))
                subs[i] = 'r/' + subs[i];
        $scope.subbigtext = subs.join(' + ');
        $scope.subString = subs.join('+').replace(/r\//g,'');
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

    // Reload page.
    $scope.reload = function(){
        location.reload();
    };

    // Get content from specified subreddit.
    $scope.getSub = function(sub){
        if(/\+/.test(sub))
            $scope.submitButton = 'more from these subs';
        else $scope.submitButton = 'more from this sub';
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
        getPosts();
    };

    // Scroll to top of page.
    $scope.goToTop = function(){
        window.scrollTo(0, 0);
    };

    // Get human-readable age of post.
    $scope.getPostAge = function(p){
        return PostContent.getPostAge(p);
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
                if($scope.currentSub == '')
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

            RedditApiService.submitVote($scope.access_token,id,$scope.votes[id]);

        }
    };

    // Change location using ng-clicks.
    $scope.goTo = function(loc){
        if(loc==null||loc=='')
            window.location.href = '/';
        else window.location.href = loc;
    };

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
        $('#' + id).slideToggle(200);
    };

    $scope.embedYouTube = function(id,video_id){
        $('#' + id).html(
            '<iframe width="288" height="216" src="http://www.youtube.com/embed/' + video_id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>'
        );
    };

    $scope.embedVimeo = function(id,video_id){
        $('#' + id).html(
            '<iframe width="288" height="216" src="http://player.vimeo.com/video/' + video_id + '?color=a8a8a8&autoplay=1" frameborder="0"></iframe>'
        );
    };

});

app.controller('AboutCtrl',function($scope, $sce, MasonryService){

    // Create Masonry object.
    MasonryService.createBrickWall();

    $scope.bricks = [
        {
            type: 'paragraphs',
            title: 'Why',
            content: [
                'This project was started with the goal of creating a quick and easy way to view Reddit post content without the need to open a million browser tabs.'
                ]
        },
        {
            type: 'tech',
            title: 'The Tech',
            tech: [
                {
                    id: 'laravel',
                    icon: '/resources/images/laravel.png',
                    label: 'Laravel 4',
                    url: 'http://laravel.com/'
                },
                {
                    id: 'jquery',
                    icon: '/resources/images/jquery.png',
                    label: 'jQuery',
                    url: 'http://jquery.com/'
                },
                {
                    id: 'angular',
                    icon: '/resources/images/angular.png',
                    label: 'AngularJS',
                    url: 'https://angularjs.org/'
                },
                {
                    id: 'masonry',
                    icon: '/resources/images/masonry.png',
                    label: 'Masonry',
                    url: 'http://masonry.desandro.com/'
                },
                {
                    id: 'bootstrap',
                    icon: '/resources/images/bootstrap.png',
                    label: 'Bootstrap CSS',
                    url: 'http://getbootstrap.com/css/'
                },
                {
                    id: 'fontawesome',
                    icon: '/resources/images/fontawesome.png',
                    label: 'Font Awesome Icons',
                    url: 'http://fontawesome.io/icons/'
                }
            ]
        },
        {
            type: 'paragraphs',
            title: 'Usage Tips',
            content: [
                'The main page will load the default front page posts, but you can use the subreddit input field to specify a subreddit, or multireddit, to view. Try entering "funny+aww". :)',
                'If you haven\'t already, use the login button in the menu at the top of the page to use this service with your Reddit account. It\'s 100% safe and secure, and allows you to automatically view your own front page content, and also vote!',
                $sce.trustAsHtml(
                    'If you aren\'t using <a href="http://hoverzoom.net/" target="_blank">HoverZoom</a>, I highly recommend installing it!'
                )
            ]
        },
        {
            type: 'paragraphs',
            title: 'APIs',
            content: [
                'The official Reddit API is used to get post data, and also to connect securely to your own Reddit account using OAuth and SSL.',
                'Imgur\'s API is also used to help pull image and gallery/album data and thumbnails, making it easy to quickly view post content from Imgur without leaving the page.'
            ]
        },
        {
            type: 'paragraphs',
            title: $sce.trustAsHtml('<i class="fa fa-lock"></i> Privacy Matters'),
            content: [
                'When using your Reddit account with this site, none of your account details (not even your username) is made available to anyone but Reddit. Your browser only communicates with my servers to handle secure Reddit API interactions such as voting and retrieving post data from subreddits to which you\'re subscribed.'
            ]
        },
        {
            type: 'paragraphs',
            title: 'Bugs',
            content: [
                'Yes, there are some.'
            ]
        },
        {
            type: 'changelog',
            title: 'Major Changes',
            updates: [
                {
                    date: '6/22/2014',
                    details: 'Vimeo support added.'
                },
                {
                    date: '6/21/2014',
                    details: 'Bootstrap tooltips added to make UI usage clearer.'
                },
                {
                    date: '6/20/2014',
                    details: 'YouTube support added.'
                },
                {
                    date: '6/19/2014',
                    details: 'Imgur gallery support working properly. Image titles and descriptions displayed when available.'
                },
                {
                    date: '6/18/2014',
                    details: 'Tons of UI changes. Voting logic revisited, votes can now be changed/cancelled.'
                },
                {
                    date: '6/16/2014',
                    details: 'Code cleanup and complete refactor of all client-side code. Much cleaner and faster.'
                },
                {
                    date: '6/15/2014',
                    details: 'Imgur API support added.'
                },
                {
                    date: '6/14/2014',
                    details: 'Content type and display template now determined using customer Angular directive instead of Angular conditions in a global template.'
                },
                {
                    date: '6/9/2014',
                    details: 'Basic voting logic added.'
                },
                {
                    date: '6/7/2014',
                    details: 'Reddit user account access implemented securely using OAuth. Much faster. Cookies enabled.'
                },
                {
                    date: '6/6/2014',
                    details: 'Infinite scroll logic added. Next page data returned successfully for subreddits and multireddits.'
                },
                {
                    date: '6/3/2014',
                    details: 'Basic Reddit login mechanism added. Insecure, but works for testing. Posts retrieved server-side.'
                },
                {
                    date: '6/1/2014',
                    details: 'Inital write. Posts retrieved with Reddit JSON API, displayed with Masonry.'
                }
            ]
        },
        {
            type: 'paragraphs',
            title: 'Inspiration',
            content: [
                'This project was inspired by <a href="http://pinterest.com/" target="_blank">Pinterest</a>, <a href="http://scrolldit.com/" target="_blank">Scrolldit</a> and several other services using tiled interfaces with infinite scroll functionality.'
            ]
        }
    ];

});