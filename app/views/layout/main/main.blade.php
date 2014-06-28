@extends('layout.main.master')
@section('main')
<div id="main-page">
    <div class="container-fluid" id="sub-select">
        <div id="sub-bigtext" class="hide_medium">@{{ subbigtext }}</div>
        <div class="col-sm-5 col-xs-12">
            <form ng-submit="getSub(subString)">
                <label ng-show="!loadingSub">
                    <span class="hide_very_small">Enter a subreddit or multireddit (e.g. "pics+funny"):</span>
                    <span class="show_very_small">Enter a subreddit or multireddit:</span>
                </label>
                <label ng-show="loadingSub">Loading...</label><br />
                <div class="input-group">
                    <input class="form-control"
                           id="sub"
                           type="text"
                           ng-model="sub"
                           placeholder="loading..."
                           ng-disabled="loadingSub" />
                    <span class="input-group-btn">
                        <button class="btn btn-default"
                                type="submit"
                                ng-disabled="loadingSub||sub==''||sub==undefined">
                            @{{ submitButton }}
                        </button>
                    </span>
                </div>
            </form>
        </div>
    </div>
    <hr />
    <div id="brick-wall" class="brick-wall" masonry>
        <div class="brick masonry-brick" ng-repeat="post in posts track by $index">
            <div class="title">
                <a class="subLink" href="#"
                   ng-click="getSub(post.data.subreddit)">
                    r/@{{ post.data.subreddit }}
                </a>
                -
                <a class="titleLink"
                   ng-href="@{{ post.data.url }}"
                   target="_blank">
                    @{{ post.data.title }}
                </a>
            </div>
            <div class="content-outer">
                <div class="content-inner"
                     brick-content post-data="post.data">
                </div>
            </div>
            <div class="info">
                <div class="row">
                    <div class="top">
                        <div class="col-xs-12">
                            <div class="left">
                                <strong>
                                    <a href="http://reddit.com/u/@{{ post.data.author }}"
                                       tooltip="View profile"
                                       target="_blank">
                                        @{{ post.data.author }}
                                    </a>
                                </strong><br/>
                                Comments:
                                <a href="http://www.reddit.com@{{ post.data.permalink }}"
                                   tooltip="View comments"
                                   target="_blank">
                                    @{{ post.data.num_comments }}
                                </a>
                            </div>
                            <div class="right">
                                <div class="vote-box" ng-show="loggedIn">
                                    <div class="points">@{{ post.data.ups }}</div>
                                    <div class="arrows">
                                        <i id="@{{ post.data.name }}_up"
                                           ng-class="{up: loggedIn && post.data.likes && post.data.likes != null}"
                                           ng-click="submitVote(post.data.name,post.data.likes,1)"
                                           class="fa fa-arrow-up">
                                        </i><br />
                                        <i ng-show="loggedIn"
                                           id="@{{ post.data.name }}_down"
                                           ng-class="{down: loggedIn && !post.data.likes && post.data.likes != null}"
                                           ng-click="submitVote(post.data.name,post.data.likes,-1)"
                                           class="fa fa-arrow-down">
                                        </i>
                                    </div>
                                </div>
                                <div class="vote-box"
                                     ng-show="!loggedIn"
                                     tooltip="Log in"
                                     ng-click="authorizeAccount()">
                                    <div class="points">@{{ post.data.ups }}</div>
                                    <div class="arrows">
                                        <i class="fa fa-arrow-up"></i><br />
                                        <i class="fa fa-arrow-down"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="bottom">
                        <div class="col-xs-12">
                            @{{ getPostAge(post.data.created) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="bottom-tab about-this-project hide_small" ng-click="goTo('about')">
        <i class="fa fa-question"></i> About this project
    </div>
    <div class="bottom-tab about-this-project-small show_small" ng-click="goTo('about')">
        <i class="fa fa-question"></i>
    </div>
    <div class="bottom-tab go-to-top hide_small" ng-show="scrolled" ng-click="goToTop()">
        <i class="fa fa-chevron-up"></i> Scroll to top
        <img src="/resources/images/loadingSub.gif" ng-show="loadingSub" />
    </div>
    <div class="bottom-tab go-to-top-small show_small" ng-show="scrolled" ng-click="goToTop()">
        <i class="fa fa-chevron-up"></i>
        <img src="/resources/images/loadingSub.gif" ng-show="loadingSub" />
    </div>
</div>
@stop