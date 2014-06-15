<?php

class ImgurApiController extends BaseController{

    private $client;

    function __construct()
    {
        $this->client = array(
            "id" => "d77ad751ae23f3d",
            "secret" => ""
        );
    }

    function getGallery()
    {
        $id = Input::get('id');

        $url = 'https://api.imgur.com/3/image/' . $id;

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, array(
            'Authorization: Client-ID ' . $this->client['id']
        ));

        $images = curl_exec($ch);
        curl_close($ch);

        return Response::json($images);
    }
}