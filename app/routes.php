<?php

Route::get('/', 'RouteController@main');
Route::get('/r/{s}', 'RouteController@main');
Route::controller('/api', 'ApiController');