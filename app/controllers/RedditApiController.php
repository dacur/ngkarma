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
                "&redirect_uri=" . $redirect_uri);

        $tokens = curl_exec($ch);
        curl_close($ch);

        return Response::json($tokens);
    }

    function getRefreshToken()
    {

    }

    function getUserData()
    {
        $token = Input::get('token');

        $url = "https://oauth.reddit.com/api/v1/me";

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, "Authorization: 'bearer " . $token . "'");
        curl_setopt($ch, CURLOPT_USERPWD, $this->client['id'] . ':' . $this->client['secret']);

        $user_data = curl_exec($ch);
        curl_close($ch);

        return Response::json($user_data);
    }
}