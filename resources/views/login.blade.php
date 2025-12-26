@extends('layouts.main')

@section('title', 'Đăng Nhập - Book Lovers')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/form.css') }}">
@endsection

@section('content')
    <div class="form-container">
        <h2>ĐĂNG NHẬP</h2>
        <form id="loginForm">
            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" autocapitalize="off" autocorrect="off" spellcheck="false"><br><br>
            <label for="password">Mật Khẩu:</label>
            <div class="password-wrapper">
                <input type="password" id="password" name="password">
            </div>
            
            <button type="submit">Đăng Nhập</button>
        </form>

        <p><a href="{{ url('register') }}">Chưa Có Tài Khoản? Click Đây</a></p>
    </div>
@endsection

@section('scripts')
    <script src="{{ asset('js/login.js') }}"></script>
@endsection
