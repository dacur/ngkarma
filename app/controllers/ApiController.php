<?php

use SDKTools\reddit;

class ApiController extends BaseController{

    private $reddit;

    function postLogin(){
        $u = Input::get('username');
        $p = Input::get('password');

        $this->reddit = new reddit($u,$p);

        $user = $this->reddit->getUser();
        $subscriptions = $this->reddit->getSubscriptions();

        $data = array();
        if(property_exists($user,'data'))
        {
            if(property_exists($user->data,'name'))
            {
                Cookie::queue('username',$user->data->name);
                $data['name'] = $user->data->name;
                if(property_exists($subscriptions,'data'))
                {
                    if(property_exists($subscriptions->data,'children'))
                    {
                        $subs = array();
                        foreach($subscriptions->data->children as $child)
                        {
                            if(property_exists($child,'data'))
                                array_push($subs,$child->data->display_name);
                        }
                        if(sizeof($subs) > 0)
                        {
                            Cookie::queue('subs',join('+',$subs));
                            $data['status'] = 'win';
                            $data['subs'] = join('+',$subs);
                        }
                        else
                        {
                            $data['status'] = 'fail';
                            $data['message'] = 'NO_SUBS_FOUND';
                        }
                    }
                    else
                    {
                        $data['status'] = 'fail';
                        $data['message'] = 'INVALID_CHILDREN';
                    }
                }
                else
                {
                    $data['status'] = 'fail';
                    $data['message'] = 'INVALID_SUB_DATA';
                }
            }
            else
            {
                $data['status'] = 'fail';
                $data['message'] = 'USERNAME_NOT_FOUND';
            }
        }
        else
        {
            $data['status'] = 'fail';
            $data['message'] = 'INVALID_USER_DATA';
        }
        return Response::json($data);
    }

    function getLogout(){
        return Response::make()->withCookie(Cookie::forget('username'));
    }

}