'use strict';

var app = angular.module('MainApp');

app.service('ApiService',function($http){
    return {
        Auth: function(data){
            return $http({
                method: 'POST',
                url: '/api/auth',
                data: data
            })
        },
        getUser: function(){
            return $http({
                method: 'GET',
                url: '/api/user'
            })
        }
    }
});

app.service('SubService',function(){
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