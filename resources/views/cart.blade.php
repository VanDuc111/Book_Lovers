@extends('layouts.main')

@section('title', 'Giỏ hàng - Book Lovers')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/cart.css') }}" />
@endsection

@section('content')
    <cart-app></cart-app>
@endsection

@section('scripts')
    <!-- Logic handled by Vue in app.js -->
@endsection
