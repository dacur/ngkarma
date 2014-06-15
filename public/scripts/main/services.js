'use strict';

var app = angular.module('MainApp');

app.service('ApiService',function($http)
{

    this.getUserData = function(token){
        return $http({
            method: 'GET',
            url: '/api/user-data',
            params: {
                token: token
            }
        });
    };

    this.submitVote = function(token,id,dir){
        return $http({
            method: 'GET',
            url: '/api/submit-vote',
            params: {
                id: id,
                dir: dir,
                token: token
            }
        });
    };

    this.getSubreddit = function(token,sub,after){
        return $http({
            method: 'GET',
            url: '/api/subreddit',
            params: {
                sub: sub,
                after: after,
                token: token
            }
        });
    };

});

app.service('MasonryService',function()
{

    this.createBrickWall = function(){
        var container = $('#brick-wall');
        container.masonry({
            columnWidth:  300,
            itemSelector: '.item',
            isFitWidth: true
        });
    };

    this.reloadMasonry = function(reload){
        var container = $('#brick-wall');
        if(reload)
            container.masonry('reloadItems');
        container.masonry('layout');
    };

});

app.service('CookieService',function()
{

    this.setCookie = function(cname, cvalue, exdays){
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };

    this.getCookie = function(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
        }
        return "";
    };

    this.deleteAllCookies = function(){
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var c = cookies[i];
            var eq = c.indexOf("=");
            var name = eq > -1 ? c.substr(0, eq) : c;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    };

});

app.service('DefaultSubService',function()
{
    this.defaultSubs = [
        "announcements",
        "art",
        "askreddit",
        "askscience",
        "aww",
        "blog",
        "books",
        "creepy",
        "dataisbeautiful",
        "diy",
        "documentaries",
        "earthporn",
        "explainlikeimfive",
        "fitness",
        "food",
        "funny",
        "futurology",
        "gadgets",
        "gaming",
        "getmotivated",
        "gifs",
        "history",
        "iama",
        "internetisbeautiful",
        "jokes",
        "lifeprotips",
        "listentothis",
        "mildlyinteresting",
        "movies",
        "music",
        "news",
        "nosleep",
        "nottheonion",
        "oldschoolcool",
        "personalfinance",
        "philosophy",
        "photoshopbattles",
        "pics",
        "science",
        "showerthoughts",
        "space",
        "sports",
        "television",
        "tifu",
        "todayilearned",
        "twoxchromosomes",
        "upliftingnews",
        "videos",
        "worldnews",
        "writingprompts",
        "all",
        "random",
        "funny",
        "pics",
        "askreddit",
        "iama",
        "news",
        "todayilearned",
        "worldnews",
        "gifs",
        "videos",
        "aww",
        "explainlikeimfive",
        "music",
        "movies",
        "sports",
        "television",
        "gaming",
        "science",
        "earthporn",
        "askscience",
        "books",
        "upliftingnews",
        "internetisbeautiful",
        "mildlyinteresting",
        "getmotivated",
        "food",
        "nosleep",
        "oldschoolcool",
        "twoxchromosomes",
        "lifeprotips",
        "futurology",
        "writingprompts",
        "dataisbeautiful",
        "listentothis",
        "diy",
        "jokes",
        "showerthoughts",
        "art",
        "gadgets",
        "personalfinance",
        "history",
        "philosophy",
        "fitness",
        "tifu",
        "space",
        "photoshopbattles",
        "documentaries",
        "creepy",
        "nottheonion",
        "woahdude"
    ];
});