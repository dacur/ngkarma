@extends('layout.main.master')
@section('main')
<div id="sub-select">
    <form name="subForm" ng-submit="getSub()">
        <label>Enter a sub:</label><br />
        r/<input type="text" ng-model="sub" placeholder="pics" />
        <input type="submit">
    </form>
</div>
<hr />
<div id="brick-wall" masonry></div>
@stop