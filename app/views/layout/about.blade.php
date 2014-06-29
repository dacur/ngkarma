@extends('layout.main.master')
@section('main')
<div id="about-page" ng-controller="AboutCtrl">
    <div id="heading" class="hide_very_small large">
        <i class="fa fa-chevron-circle-left back" tooltip="Back to the posts" ng-click="goTo()"></i>
        About the Project
    </div>
    <div id="heading" class="show_very_small small">
        <i class="fa fa-chevron-circle-left back" ng-click="goTo()"></i>
        About the Project
    </div>
    <hr />
    <div id="disclaimer">I am in no way affiliated with Reddit. This is to say that this app <b>is not made or maintained by Reddit</b>.</div>
    <hr />
    <div id="brick-wall" masonry>
        <div class="gutter-sizer"></div>
        <div class="brick masonry-brick" ng-repeat="brick in bricks">
            <div class="title" ng-bind-html="brick.title">
                @{{ brick.title }}
            </div>
            <div ng-if="brick.type == 'paragraphs' " class="content">
                <p ng-repeat="paragraph in brick.content" ng-bind-html="paragraph">
                    @{{ paragraph }}
                </p>
            </div>
            <div ng-if="brick.type == 'tech' " class="tech">
                <div ng-repeat="item in brick.tech">
                    <div id="@{{ item.id }}">
                        <a href="@{{ item.url }}" target="_blank">
                            <div>
                                <img ng-src="@{{ item.icon }}" />
                            </div>
                            @{{ item.label }}
                        </a>
                    </div>
                    <hr ng-show="$index+1 != brick.tech.length" />
                </div>
            </div>
            <div ng-if="brick.type == 'changelog' " class="changelog">
                <div ng-repeat="update in brick.updates">
                    <h4>@{{ update.date }}</h4>
                    <p>@{{ update.details }}</p>
                    <hr ng-show="$index+1 != brick.updates.length" />
                </div>
            </div>
        </div>
    </div>
</div>
@stop