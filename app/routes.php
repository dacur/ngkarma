<?php

// Default route.
Route::get('/', 'RouteController@main');

// Route to redirect URI handler, which checks the response from the Reddit access approval page.
Route::get('/redirect', 'RouteController@redirect');

// Reddit-style subreddit route.
Route::get('/r/{s}', 'RouteController@main');

// Reddit API controller
Route::controller('/api/reddit', 'RedditApiController');

// Imgur API controller
Route::controller('/api/imgur', 'ImgurApiController');