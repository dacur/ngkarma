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
            <div class="content-inner">
                <!-- If image, but not Imgur, display it here. -->
                <img ng-if="isImage(post.data.url) && !isImgur(post.data.domain)" id="contentImage" src="@{{ post.data.url }}" />

                <!-- If direct link to Imgur image, load large thumbnail. -->
                <a ng-if="isImage(post.data.url) && isImgur(post.data.domain)"
                    href="@{{ post.data.url }}" target="_blank" >
                   <img id="contentImage" src="@{{ getImgurThumb(post.data.url) }}" />
                </a>

                <!-- If YouTube video, try to embed. -->
                <div id="youtube-@{{ post.data.id }}" ng-if="isYouTube(post.data.domain,post.data.url)"
                     data-yt-player="myPlayer" data-yt-vid="@{{ getYouTubeVideoId(post.data.domain,post.data.url) }}">
                </div>

                <!-- If link to Imgur, but not direct to image, half-ass append .jpg. -->
                <img ng-if="!isImage(post.data.url) && isImgur(post.data.domain)" id="contentImage" src="@{{ post.data.url }}.jpg" />

                <!-- If self post, post the text. -->
                <div ng-if="post.data.is_self" id="contentText" ng-body-html-unsafe="test">@{{ post.data.selftext }}</div>

                <!-- Otherwise, try to screenshot the link destination. -->
                <a ng-if="!isImage(post.data.url) && !isImgur(post.data.domain) && !isYouTube(post.data.domain,post.data.url) && !isSelf(post.data.selftext)" href="@{{ post.data.url }}" target="_blank" >
                    <img id="contentImage" src="http://immediatenet.com/t/l?Size=1024x768&URL=@{{ stripHttps(post.data.url) }}" />
                </a>

                <!-- Otherwise, display "No Image Available". -->
                <!--<p ng-if="!isImgur(post.data.url) && !isSelf(post.data.selftext)">No Content Available</p>-->
            </div>
        </div>
        <div class="info">
            <div class="left">
                <strong><a href="http://reddit.com/u/@{{ post.data.author }}" target="_blank" >@{{ post.data.author }}</a></strong><br/>
                On: @{{ post.data.created }}<br/>
                Comments:
                    <a href="http://www.reddit.com@{{ post.data.permalink }}" target="_blank">
                        @{{ post.data.num_comments }}
                    </a>
            </div>
            <div class="right">
                <i class="fa fa-arrow-up"></i> @{{ post.data.ups }}<br/>
                <i class="fa fa-arrow-down"></i> @{{ post.data.downs }}<br/>
                Points: @{{ post.data.score }}
            </div>
        </div>
    </div>
</div>
@stop