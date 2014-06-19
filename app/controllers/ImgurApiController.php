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

        $url = 'https://api.imgur.com/3/gallery/' . $id;

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Authorization: Client-ID ' . $this->client['id']
        ));

        $results = json_decode(curl_exec($ch));
        curl_close($ch);

        $images = array();
        if(property_exists($results,'success') && $results->success)
            if(property_exists($results,'data'))
                if(property_exists($results->data,'is_album') && $results->data->is_album)
                {
                    if(property_exists($results->data,'images'))
                        foreach($results->data->images as $image)
                            if(property_exists($image,'link'))
                                array_push($images,$image->link);
                }
                else if(property_exists($results->data,'link'))
                    array_push($images,$results->data->link);



        if(count($images) >= 1)
            $response = array(
                "status" => 'GOOD',
                "images" => $images
            );
        else $response = array("status" => 'FAIL');

        return Response::json($response);
    }
}