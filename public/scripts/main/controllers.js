'use strict';

var app = angular.module('MainApp',['wu.masonry','ui.bootstrap','ngSanitize']);

// Main Page Controller.
app.controller('MainCtrl',function($scope, $http, MainFactory, RedditApiService, MasonryService, CookieService, PostContent)
{

    // Used for infinite scroll logic.
    var win = $(window);
    var doc = $(document);

    // Set theme options stored in cookies.
    var theme = CookieService.getCookie('theme');
    if(theme != undefined && theme != null && theme != '')
        setTheme(theme);
    else setTheme('default');

    // Set layout options.
    var gutterWidth = CookieService.getCookie('gutter-width');
    if(gutterWidth != undefined && gutterWidth != null && gutterWidth != '')
        setGutterWidth(gutterWidth);
    else setGutterWidth('8');

    // Set state of a few scope vars.
    $scope.loggedIn = false;
    $scope.connecting = false;
    $scope.loadingSub = false;
    $scope.posts = [];
    $scope.previousPosts = [];
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
                    if(response.hasOwnProperty('data') && response.data.hasOwnProperty('data')
                        && response.data.data.hasOwnProperty('children'))
                    {
                        // Push new posts.
                        pushPosts(response.data.data.children);

                        // Set new 'after' value for next page.
                        $scope.after = response.data.data.after;

                        // Apply scope changes.
                        setTimeout(function(){
                            $scope.$apply();
                        },0);
                    }
                    else alert('Whoops! Failed to load "' + $scope.currentSub + '". Try again?');

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
                $.getJSON(url, params, function(response)
                {
                    // Unset loading states.
                    $scope.loadingSub = false;
                    $scope.gettingPage = false;

                    // Add new posts to posts array.
                    if(response.hasOwnProperty('data') && response.data.hasOwnProperty('children'))
                    {
                        // Push new posts (only clean for now).
                        var filtered = [];
                        for(var i in response.data.children)
                            if(!response.data.children[i].data.over_18)
                                filtered.push(response.data.children[i]);
                        pushPosts(filtered);

                        // Set new 'after' value for next page.
                        $scope.after = response.data.after;

                        // Apply scope changes.
                        $scope.$apply();
                    }
                });
            }
        }
    }

    // Push new posts to main posts array.
    function pushPosts(newPosts){
        var addedPostNames = [];

        // Loop through new posts. If new post has a post ID, check the previous post IDs and add if unique.
        for(var i in newPosts)
            if(newPosts[i].hasOwnProperty('data') && newPosts[i].data.hasOwnProperty('name'))
                if(!inArray(newPosts[i].data.name,$scope.previousPosts)){
                    $scope.posts.push(newPosts[i]);
                    addedPostNames.push(newPosts[i].name);
                }
        // Remember the names of these added posts for next time.
        $scope.previousPostNames = addedPostNames;
    }

    // Clear posts in main posts array.
    function clearPosts(){
        $scope.posts = [];
    }

    // Return true if array contains value.
    function inArray(value,array){
        for(var i in array){
            if(array[i] == value)
                return true;
        }
        return false;
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

    // Set theme from user selection.
    $scope.setTheme = function(theme) {
        setTheme(theme);
        CookieService.setCookie('theme',theme,30);
    };

    // Increase gutter width.
    $scope.increaseGutterWidth = function(){
        var gutter = document.querySelector('.gutter-sizer');
        if(gutter != null && gutter.hasOwnProperty('offsetWidth'))
            setGutterWidth(gutter.offsetWidth + 4);
    };

    // Increase gutter width.
    $scope.decreaseGutterWidth = function(){
        var gutter = document.querySelector('.gutter-sizer');
        if(gutter != null && gutter.hasOwnProperty('offsetWidth'))
            setGutterWidth(gutter.offsetWidth - 4);
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

    // Set theme.
    function setTheme(theme){
        document.getElementById('theme').setAttribute('href','/styles/theme-' + theme + '.css');
    }

    // Set gutter width.
    function setGutterWidth(width){
        if(width < 0)
            width = 0;
        var gutter = document.querySelector('.gutter-sizer');
        if(gutter != null && gutter.hasOwnProperty('style') && gutter.style.hasOwnProperty('width')){
            gutter.style.width = width + "px";
            CookieService.setCookie('gutter-width',width,30);
        }
    }

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
                'The main page will load posts from the default front page, but you can use the subreddit input field to specify a subreddit, or multireddit, to view. Separate your favorite subs with a plus, like "funny+aww", to view multiple subs at once.',
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
            title: 'Coming Soon (maybe)',
            content: [
                'Flickr support',
                'External page screenshots',
                'Display top comments',
                'UI Options',
                'Performance improvements',
                'Sorting options',
                'Message notifications'
            ]
        },
        {
            type: 'changelog',
            title: 'Major Changes',
            updates: [
                {
                    date: '6/29/2014',
                    details: 'Imgur API call results are now cached and served from the ngKarma server where possible. This means faster results for images/galleries and fewer API calls to Imgur.'
                },
                {
                    date: '6/28/2014',
                    details: 'UI changes, including theme support. Gutter between columns is now adjustable. NSFW posts are only viewable when logged in. Finally, added play button to YouTube and Vimeo posts.'
                },
                {
                    date: '6/25/2014',
                    details: 'Improved duplicate post detection logic between pages.'
                },
                {
                    date: '6/22/2014',
                    details: 'Vimeo support added. Imgur API support vastly improved.'
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
            title: $sce.trustAsHtml('<i class="fa fa-legal"></i> Legal Stuff'),
            content: [
                $sce.trustAsHtml(
                    'Web Site Terms and Conditions of Use<h3> 1. Terms </h3> <p> By accessing this web site, you are agreeing to be bound by these web site Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this web site are protected by applicable copyright and trade mark law. </p> <h3> 2. Use License </h3> <ol type="a"> <li> Permission is granted to temporarily download one copy of the materials (information or software) on ngKarma\'s web site for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: <ol type="i"> <li>modify or copy the materials;</li> <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li> <li>attempt to decompile or reverse engineer any software contained on ngKarma\'s web site;</li> <li>remove any copyright or other proprietary notations from the materials; or</li> <li>transfer the materials to another person or "mirror" the materials on any other server.</li> </ol> </li> <li> This license shall automatically terminate if you violate any of these restrictions and may be terminated by ngKarma at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format. </li> </ol> <h3> 3. Disclaimer </h3> <ol type="a"> <li> The materials on ngKarma\'s web site are provided "as is". ngKarma makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, ngKarma does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Internet web site or otherwise relating to such materials or on any sites linked to this site. </li> </ol> <h3> 4. Limitations </h3> <p> In no event shall ngKarma or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on ngKarma\'s Internet site, even if ngKarma or a ngKarma authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you. </p> <h3> 5. Revisions and Errata </h3> <p> The materials appearing on ngKarma\'s web site could include technical, typographical, or photographic errors. ngKarma does not warrant that any of the materials on its web site are accurate, complete, or current. ngKarma may make changes to the materials contained on its web site at any time without notice. ngKarma does not, however, make any commitment to update the materials. </p> <h3> 6. Links </h3> <p> ngKarma has not reviewed all of the sites linked to its Internet web site and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by ngKarma of the site. Use of any such linked web site is at the user\'s own risk. </p> <h3> 7. Site Terms of Use Modifications </h3> <p> ngKarma may revise these terms of use for its web site at any time without notice. By using this web site you are agreeing to be bound by the then current version of these Terms and Conditions of Use. </p> <h3> 8. Governing Law </h3> <p> Any claim relating to ngKarma\'s web site shall be governed by the laws of the State of Michigan without regard to its conflict of law provisions. </p> <p> General Terms and Conditions applicable to Use of a Web Site. </p> <h2> Privacy Policy </h2> <p> Your privacy is very important to us. Accordingly, we have developed this Policy in order for you to understand how we collect, use, communicate and disclose and make use of personal information. The following outlines our privacy policy. </p> <ul> <li> Before or at the time of collecting personal information, we will identify the purposes for which information is being collected. </li> <li> We will collect and use of personal information solely with the objective of fulfilling those purposes specified by us and for other compatible purposes, unless we obtain the consent of the individual concerned or as required by law. </li> <li> We will only retain personal information as long as necessary for the fulfillment of those purposes. </li> <li> We will collect personal information by lawful and fair means and, where appropriate, with the knowledge or consent of the individual concerned. </li> <li> Personal data should be relevant to the purposes for which it is to be used, and, to the extent necessary for those purposes, should be accurate, complete, and up-to-date. </li> <li> We will protect personal information by reasonable security safeguards against loss or theft, as well as unauthorized access, disclosure, copying, use or modification. </li> <li> We will make readily available to customers information about our policies and practices relating to the management of personal information. </li> </ul> <p> We are committed to conducting our business in accordance with these principles in order to ensure that the confidentiality of personal information is protected and maintained. </p>'
                )
            ]
        },
        {
            type: 'paragraphs',
            title: 'Inspiration',
            content: [
                'This project was inspired by <a href="http://pinterest.com/" target="_blank">Pinterest</a>, <a href="http://scrolldit.com/" target="_blank">Scrolldit</a> and several other services using tiled interfaces with infinite scroll functionality.'
            ]
        },
        {
            type: 'paragraphs',
            title: 'Bugs',
            content: [
                'Yes, there are some.'
            ]
        }
    ];

});