@extends('layouts.main')

@section('title', 'Thanh toán - Book Lovers')

@section('content')
    <checkout-app></checkout-app>
@endsection

@section('scripts')
    <link rel="stylesheet" href="{{ asset('css/checkout.css') }}">
@endsection
