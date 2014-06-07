<?php

class RouteController extends BaseController{

    protected $layout = 'layout.main.master';

    function main()
    {
        $this->layout->menu = View::make('layout.main.menu');
        $this->layout->main = View::make('layout.main.main');
    }

    function redirect()
    {
        return View::make('layout.redirect');
    }
}