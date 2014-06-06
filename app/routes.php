<?php

// Default route.
Route::get('/', 'RouteController@main');

// Reddit-style subreddit route.
Route::get('/r/{s}', 'RouteController@main');

// Route to ApiController, which handles account-specific Reddit API calls.
Route::controller('/api', 'ApiController');