@extends('layout.main.master')
@section('main')
<form name="subForm" ng-submit="getSub()">
    <label>Enter a sub:</label><br />
    r/<input type="text" ng-model="sub" placeholder="pics" />
    <input type="submit">
</form>
<hr />
<div id="brick-wall" masonry>
        <div class="gutter-sizer"></div>
        <div class="masonry-brick brick" ng-repeat="post in posts">
            <div class="title">@{{ post.data.title }}</div>
            <div class="content">
                <!-- If image, display it here. -->
                <img ng-if="isImage(post.data.url)" id="contentImage" src="@{{ post.data.url }}" />

                <!-- If link to imgur page, refer to image directly. -->
                <img ng-if="isImgur(post.data.url)" id="contentImage" src="@{{ post.data.url }}.jpg" />

                <!-- If self post, post the text. -->
                <div ng-if="isSelf(post.data.selftext)" id="contentText"
                     ng-body-html-unsafe="test">@{{ post.data.selftext }}</div>

                <!-- Otherwise, try to screenshot the link destination. -->
                <img ng-if="!isImage(post.data.url) && !isSelf(post.data.selftext)"
                     id="contentImage" src="http://immediatenet.com/t/l?Size=1024x768&URL=@{{ post.data.url }}" />

                <!-- Otherwise, display "No Image Available". -->
                <!--<p ng-if="!isImgur(post.data.url) && !isSelf(post.data.selftext)">No Content Available</p>-->

            </div>
            <div class="info">
                <div class="left">
                    <strong>@{{ post.data.author }}</strong><br/>
                    On: @{{ post.data.created }}<br/>
                    Comments:
                        <a href="http://www.reddit.com@{{ post.data.permalink }}" target="_blank">
                            @{{ post.data.num_comments }}
                        </a>
                </div>
                <div class="right">
                    <img src="/resources/images/upvote.png" /> @{{ post.data.ups }}<br/>
                    <img src="/resources/images/downvote.png" /> @{{ post.data.downs }}<br/>
                    Points: @{{ post.data.score }}
                </div>
        </div>
    </div>
</div>
@stop