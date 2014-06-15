@extends('layout.main.master')
@section('main')
<div class="container-fluid" id="sub-select">
    <div id="sub-bigtext" class="hide_medium">@{{ subbigtext }}</div>
    <div class="col-sm-5 col-xs-12">
        <form ng-submit="getSub(sub)">
            <label ng-show="!loadingSub">Enter a subreddit:</label>
            <label ng-show="loadingSub">Loading...</label><br />
            <div class="input-group">
                <input class="form-control" id="sub" type="text" ng-model="sub" placeholder="loading..." ng-disabled="loadingSub" />
                <span class="input-group-btn">
                    <button class="btn btn-default" type="submit" ng-disabled="loadingSub||sub==''||sub==undefined">submit</button>
                </span>
            </div>
        </form>
    </div>
</div>
<hr />
<div id="brick-wall" masonry>
    <div class="brick masonry-brick" ng-repeat="post in posts track by $index">
        <div class="title">
            <a class="subLink" href="#" ng-click="getSub(post.data.subreddit)">r/@{{ post.data.subreddit }}</a> - @{{ post.data.title }}
        </div>
        <div class="content-outer">
            <div class="content-inner" brick-content post-data="post.data"></div>
        </div>
        <div class="info">
            <div class="left">
                <strong><a href="http://reddit.com/u/@{{ post.data.author }}" target="_blank" >@{{ post.data.author }}</a></strong><br/>
                Posted: @{{ getPostAge(post.data.created) }}<br/>
                Comments:
                <a href="http://www.reddit.com@{{ post.data.permalink }}" target="_blank">
                    @{{ post.data.num_comments }}
                </a>
            </div>
            <div class="right">
                @{{ post.data.ups }}
                <i id="@{{ post.data.name }}_up" ng-class="{up: loggedIn && post.data.likes && post.data.likes != null}" ng-click="submitVote(post.data.name,post.data.likes,1)" class="fa fa-arrow-up"></i>
                <br />
                @{{ post.data.downs }}
                <i id="@{{ post.data.name }}_down" ng-class="{down: loggedIn && !post.data.likes && post.data.likes != null}" ng-click="submitVote(post.data.name,post.data.likes,-1)" class="fa fa-arrow-down"></i>
                <br />
                Points: @{{ post.data.score }}
            </div>
        </div>
    </div>
</div>
<div id="go-to-top" ng-show="scrolled" ng-click="goToTop()">
    <i class="fa fa-chevron-up"></i> Scroll to top!
    <img src="/resources/images/loadingSub.gif" ng-show="loadingSub" />
</div>
@stop