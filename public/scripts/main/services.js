'use strict';

var app = angular.module('MainApp');

app.service('MainService',function(DefaultSubService){
    return {
        cycleSubs: function(){
            var subs = DefaultSubService.getDefaultSubs();
            setInterval(function(){
                var n = Math.floor(Math.random()*subs.length+1);
                $('#sub').attr('placeholder','r/' + subs[n]);
            },1500);
        }
    }
});

app.service('MasonryService',function(){
    return {
        createBrickWall: function(){
            var container = $('#brick-wall');
            container.masonry({
                columnWidth:  300,
                itemSelector: '.item',
                isFitWidth: true
            });
        },
        reloadMasonry: function(reload){
            var container = $('#brick-wall');
            if(reload)
                container.masonry('reloadItems');
            container.masonry('layout');
        }
    }
});

app.service('ApiService',function($http){
    return {
        logIn: function(data){
            return $http({
                method: 'POST',
                url: '/api/login',
                data: data
            })
        },
        logOut: function(){
            return $http({
                method: 'GET',
                url: '/api/logout'
            })
        }
    }
});

app.service('DefaultSubService',function(){
    return {
        getDefaultSubs: function(){
            return [
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
            ]
        }
    };
});