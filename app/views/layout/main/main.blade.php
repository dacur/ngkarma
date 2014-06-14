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
        <div brick-content post-data="@{{post.data}}"></div>
    </div>
</div>
<div id="go-to-top" ng-show="scrolled" ng-click="goToTop()">
    <i class="fa fa-chevron-up"></i> Scroll to top!
    <img src="/resources/images/loadingSub.gif" ng-show="loadingSub" />
</div>
@stop