<?php

class RedditApiController extends BaseController{

    private $client;

    function __construct()
    {
        $this->client = array(
            "id" => "dKiLKnbGc8ufQw",
            "secret" => "pv7a-GBMBtVzbKekEg46WkRQ1tA"
        );
    }

    function getTokens()
    {
        $code = Input::get('code');
        $redirect_uri = Input::get('redirect_uri');

        $url = "https://ssl.reddit.com/api/v1/access_token";

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_USERPWD, $this->client['id'] . ':' . $this->client['secret']);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS,
                "code=" . $code .
                "&grant_type=authorization_code" .
                "&redirect_uri=" . $redirect_uri
        );

        $tokens = curl_exec($ch);
        curl_close($ch);

        return Response::json($tokens);
    }

    function getRefreshToken()
    {
        //TODO: Implement this.
    }

    function getUserData()
    {
        $token = Input::get('token');

        // Get User Account details
        $url = "https://oauth.reddit.com/api/v1/me";
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Authorization: bearer " . $token
        ));

        $result = json_decode(curl_exec($ch));
        curl_close($ch);

        $response = array();
        if(!empty($result))
            $response['user'] = $result;

        // Get subscribed subreddits
        $url = "https://oauth.reddit.com/subreddits/mine/subscriber";
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Authorization: bearer " . $token
        ));

        $result = json_decode(curl_exec($ch));
        curl_close($ch);

        $subs = array();
        if(!empty($result))
            if(is_object($result) && property_exists($result,'data'))
                if(is_object($result->data) && property_exists($result->data,'children'))
                    foreach($result->data->children as $child)
                        if(is_object($child->data))
                        {
                            if(property_exists($child->data,'user_is_banned') && $child->data->user_is_banned)
                                continue;
                            if(property_exists($child->data,'display_name'))
                                array_push($subs,$child->data->display_name);
                        }

        $response['subs'] = $subs;

        return Response::json($response);
    }

    function getSubreddit()
    {
        $token = Input::get('token');
        $sub = Input::get('sub');
        $after = Input::get('after');

        $url = "https://oauth.reddit.com/r/" . $sub . "/hot.json?after=" . $after;
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Authorization: bearer " . $token
        ));

        $result = json_decode(curl_exec($ch));
        curl_close($ch);

        return Response::json($result);
    }

    function getSubmitVote()
    {
        $id = Input::get('id');
        $dir = Input::get('dir'); // Vote direction (up = 1, down = -1)
        $token = Input::get('token');

        $url = "https://oauth.reddit.com/api/vote";
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Authorization: bearer " . $token
        ));
        curl_setopt($ch, CURLOPT_POSTFIELDS,
            "id=" . $id .
            "&dir=" . $dir
        );

        $result = curl_exec($ch);
        curl_close($ch);

        return Response::json($result);
    }
}