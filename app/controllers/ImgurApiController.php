<?php

use Illuminate\Support\Facades\Log;

class ImgurApiController extends BaseController{

    private $client;
    private $imgurCacheModel;

    function __construct(ImgurCacheModel $imgurCacheModel)
    {
        $this->client = array(
            "id" => "965638f046842b8",
            "secret" => "c820053d2ef3c75bc74b72ce57f07f13559ca4b9"
        );

        $this->imgurCacheModel = $imgurCacheModel;
    }

    function getImages()
    {
        $id = Input::get('id');
        $type = Input::get('type');

        if($type == 'album')
            $url = 'https://api.imgur.com/3/album/' . $id . '/images';
        else if($type == 'gallery')
            $url = 'https://api.imgur.com/3/gallery/' . $id;
        else if($type == 'image')
            $url = 'https://api.imgur.com/3/image/' . $id;

        // Check Imgur cache in Mongo before calling API for data.
        $cache_results = $this->imgurCacheModel->getCacheStore($id,$type);
        if(array_key_exists(0,$cache_results))
            if(array_key_exists('images',$cache_results[0]))
                if(count($cache_results[0]['images']) >= 1)
                {
                    Log::info('Imgur result',array('id' => $id, 'status' => 'GOOD', 'from' => 'cache'));
                    $response = array(
                        "status" => 'GOOD',
                        "from" => 'cache',
                        "images" => $cache_results[0]['images']
                    );
                    return Response::json($response);
                }

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Authorization: Client-ID ' . $this->client['id']
        ));

        $results = json_decode(curl_exec($ch));
        curl_close($ch);

        $images = array();
        if(is_object($results))
        {
            if(property_exists($results,'success') && $results->success)
            {
                if(property_exists($results,'data'))
                {
                    if(is_object($results->data))
                    {
                        if(property_exists($results->data,'is_album') && $results->data->is_album)
                        {
                            if(property_exists($results->data,'images'))
                            {
                                foreach($results->data->images as $image)
                                {
                                    if(property_exists($image,'id') && property_exists($image,'title') && property_exists($image,'description') && property_exists($image,'link'))
                                    {
                                        array_push(
                                            $images,
                                            array(
                                                'id' => $image->id,
                                                'title' => $image->title,
                                                'description' => $image->description,
                                                'link' => $image->link
                                            )
                                        );
                                    }
                                }
                            }
                        }
                        else if(property_exists($results->data,'id') && property_exists($results->data,'title') && property_exists($results->data,'description') && property_exists($results->data,'link'))
                        {
                            array_push(
                                $images,
                                array(
                                    'id' => $results->data->id,
                                    'title' => $results->data->title,
                                    'description' => $results->data->description,
                                    'link' => $results->data->link
                                )
                            );
                        }
                    }
                    else if(is_array($results->data))
                    {
                        foreach($results->data as $image)
                        {
                            if(property_exists($image,'id') && property_exists($image,'title') && property_exists($image,'description') && property_exists($image,'link'))
                            {
                                array_push(
                                    $images,
                                    array(
                                        'id' => $image->id,
                                        'title' => $image->title,
                                        'description' => $image->description,
                                        'link' => $image->link
                                    )
                                );
                            }
                        }
                    }
                }
            }
        }

        // Create cache store for this result.
        if(!$this->imgurCacheModel->createCacheStore($id, $type, $images))
            Log::error('Error while storing image cache for ID ' . $id);

        if(count($images) >= 1){
            Log::info('Imgur result',array('id' => $id, 'status' => 'GOOD', 'from' => 'api'));
            $response = array(
                "status" => 'GOOD',
                "from" => 'api',
                "images" => $images
            );
        } else $response = array("status" => 'FAIL');

        return Response::json($response);
    }
}