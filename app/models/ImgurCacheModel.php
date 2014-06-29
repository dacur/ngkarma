<?php

class ImgurCacheModel{

    function getCacheStore($image_id, $type)
    {
        return DB::collection('imgur_cache')
            ->where("image_id", '=', $image_id)
            ->where("type", '=', $type)
            ->get();
    }

    function createCacheStore($image_id, $type, $images){
        return DB::collection('imgur_cache')
            ->where('image_id', '=', $image_id)
            ->update(
                array(
                    'type' => $type,
                    'images' => $images
                ),
                array('upsert' => true)
            );
    }
}