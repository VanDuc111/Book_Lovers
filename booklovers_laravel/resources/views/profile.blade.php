@extends('layouts.main')

@section('title', 'Hồ Sơ - Book Lovers')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/form.css') }}">
    <link rel="stylesheet" href="{{ asset('css/profile.css') }}">
@endsection

@section('content')
    <div class="container mt-5">
        <h2>Hồ sơ của tôi</h2>
        <div class="profile-container">
            <div class="profile-info">
                <div class="profile-details">
                    <label for="name">Tên đầy đủ:</label>
                    <input type="text" id="name" name="name" value="">

                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="" readonly autocapitalize="off" autocorrect="off" spellcheck="false">

                    <label for="password">Mật khẩu:</label>
                    <div class="password-wrapper">
                        <input type="password" id="password" name="password" value="">
                        <img src="{{ asset('assets/icons/eye.svg') }}" alt="Toggle Password" class="toggle-password" id="togglePassword">
                    </div>

                    <label for="address">Địa chỉ:</label>
                    <input type="text" id="address" name="address" value="">

                    <label for="phone">Số điện thoại:</label>
                    <input type="tel" id="phone" name="phone" value="">
                    <br>
                    <button type="submit" class="save-button btn btn-primary mt-3">Lưu chỉnh sửa</button>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const userID = urlParams.get('userID');
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const addressInput = document.getElementById('address');
            const phoneInput = document.getElementById('phone');
            const saveButton = document.querySelector('.save-button');
            let userRole = '';

            if (userID) {
                // GET user data
                fetch(`{{ url('api/users') }}/${userID}`)
                    .then(response => {
                         if (!response.ok) throw new Error('Network response was not ok');
                         return response.json();
                    })
                    .then(user => {
                        if (user) {
                            nameInput.value = user.name || '';
                            emailInput.value = user.email || '';
                            // password field usually explicitly empty for security, but preserving old logic if needed
                            passwordInput.value = ''; 
                            addressInput.value = user.address || '';
                            phoneInput.value = user.phone || '';
                            userRole = user.role || '';
                        }
                    })
                    .catch(error => console.error('Lỗi khi lấy thông tin:', error));

                // UPDATE user data
                saveButton.addEventListener('click', () => {
                    const updatedData = {
                        name: nameInput.value,
                        email: emailInput.value,
                        address: addressInput.value,
                        phone: phoneInput.value,
                        role: userRole
                    };
                    
                    // Only send password if user typed something
                    if (passwordInput.value) {
                        updatedData.password = passwordInput.value;
                    }

                    fetch(`{{ url('api/users') }}/${userID}`, {
                        method: 'PUT',
                        headers: { 
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': '{{ csrf_token() }}' // Good practice for Laravel, though API routes usually stateless, except if using sanctum/session.
                        },
                        body: JSON.stringify(updatedData)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success || data.message) {
                            alert('Cập nhật thành công!');
                        } else {
                            alert('Lỗi: ' + (data.error || 'Unknown error'));
                        }
                    })
                    .catch(error => {
                        console.error('Lỗi:', error);
                        alert('Đã xảy ra lỗi.');
                    });
                });
            }
        });
    </script>
@endsection
