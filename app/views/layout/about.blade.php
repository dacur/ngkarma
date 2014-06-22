@extends('layout.main.master')
@section('main')
<div id="about-page" ng-controller="AboutCtrl">
    <div id="heading" class="hide_very_small large">
        <i class="fa fa-chevron-circle-left" tooltip="Back to the posts" ng-click="goTo()"></i>
        About the Project
    </div>
    <div id="heading" class="show_very_small small">
        <i class="fa fa-chevron-circle-left" ng-click="goTo()"></i>
        About the Project
    </div>
    <div id="brick-wall" masonry>
        <div class="brick masonry-brick" ng-repeat="brick in bricks">
            <div class="title">
                @{{ brick.title }}
            </div>
            <div ng-if="brick.content!=null" class="content">
                <p ng-repeat="paragraph in brick.content" ng-bind-html="paragraph">
                    @{{ paragraph }}
                </p>
            </div>
            <div ng-if="brick.tech!=null" class="tech">
                <div ng-repeat="item in brick.tech">
                    <div id="@{{ item.id }}">
                        <a href="@{{ item.url }}" target="_blank">
                            <div>
                                <img ng-src="@{{ item.icon }}" />
                            </div>
                            @{{ item.label }}
                        </a>
                    </div>
                    <hr />
                </div>
            </div>
        </div>
    </div>
</div>
@stop