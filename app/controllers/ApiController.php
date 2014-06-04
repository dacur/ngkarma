<?php

use SDKTools\reddit;

class ApiController extends BaseController{

    private $reddit;

    function postAuth(){
        $u = Input::get('username');
        $p = Input::get('password');

        $this->reddit = new reddit($u,$p);

        $response = array(
            "user" => $this->reddit->getUser(),
            "subs" => $this->reddit->getSubscriptions()
        );

        return Response::json($response);
    }
}