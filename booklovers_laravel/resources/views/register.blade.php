@extends('layouts.main')

@section('title', 'Đăng Ký - Book Lovers')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/form.css') }}">
@endsection

@section('content')
    <div class="form-container">
        <h2>ĐĂNG KÝ</h2>
        <form id="registerForm">
            <label for="username">Tên Người Dùng:</label><br>
            <input type="text" id="username" name="username"><br><br>
            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" autocapitalize="off" autocorrect="off" spellcheck="false"><br><br>
            <label for="password">Mật Khẩu:</label>
            <div class="password-wrapper">
                <input type="password" id="password" name="password">
                <img src="{{ asset('assets/icons/eye.svg') }}" alt="Toggle Password" class="toggle-password" id="togglePassword">
            </div>
            <label for="confirmPassword">Xác Nhận Mật Khẩu:</label>
            <div class="password-wrapper">
                <input type="password" id="confirmPassword" name="confirmPassword">
                <img src="{{ asset('assets/icons/eye.svg') }}" alt="Toggle Password" class="toggle-password" id="toggleConfirmPassword">
            </div>
            <button type="submit">Đăng Ký</button>
        </form>
        <p><a href="{{ url('login') }}">Đã Có Tài Khoản? Đăng Nhập</a></p>
    </div>
@endsection

@section('scripts')
    <script src="{{ asset('js/register.js') }}"></script>
@endsection
