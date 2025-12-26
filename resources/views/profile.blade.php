@extends('layouts.main')

@section('title', 'Hồ Sơ Cá Nhân - Book Lovers')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/profile.css') }}">
    <style>
        /* Custom tweaks for this page */
        .profile-section {
            background: url('{{ asset('assets/icons/profile-background.avif') }}') center/cover no-repeat fixed;
            position: relative;
        }
        .profile-section::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(5px);
            z-index: 1;
        }
        .profile-wrapper {
            position: relative;
            z-index: 2;
        }
        .password-wrapper {
            position: relative;
        }
        .toggle-password {
            position: absolute;
            right: 1.5rem;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            width: 2rem;
            opacity: 0.6;
        }
    </style>
@endsection

@section('content')
<section class="profile-section">
    <div class="container profile-wrapper">
        <!-- Sidebar Navigation -->
        <aside class="profile-sidebar glass">
            <div class="user-profile-header">
                <div class="avatar-container">
                    <img src="https://ui-avatars.com/api/?name=User&background=ff6347&color=fff&size=128" id="profile-avatar-img" alt="Avatar">
                    <div class="edit-avatar">
                        <i class="fas fa-camera"></i>
                    </div>
                </div>
                <h3 id="sidebar-name">Người dùng</h3>
                <p id="sidebar-email">email@example.com</p>
            </div>

            <nav class="profile-nav">
                <div class="profile-nav-item active" data-target="profile-info">
                    <i class="fas fa-user-circle"></i>
                    <span>Thông tin cá nhân</span>
                </div>
                <div class="profile-nav-item" data-target="my-orders">
                    <i class="fas fa-box-open"></i>
                    <span>Đơn hàng của tôi</span>
                </div>
                <div class="profile-nav-item" data-target="purchased-books-pane">
                    <i class="fas fa-book"></i>
                    <span>Sách đã mua</span>
                </div>
                <div class="profile-nav-item" data-target="wishlist">
                    <i class="fas fa-heart"></i>
                    <span>Danh sách yêu thích</span>
                </div>
                <div class="profile-nav-item" data-target="change-password">
                    <i class="fas fa-shield-alt"></i>
                    <span>Đổi mật khẩu</span>
                </div>
                <a href="#" id="logout-sidebar" class="profile-nav-item" style="color: #e74c3c;">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Đăng xuất</span>
                </a>
            </nav>
        </aside>

        <!-- Main Content Area -->
        <main class="profile-content">
            <!-- Profile Info Pane -->
            <div id="profile-info" class="content-pane glass active">
                <div class="content-header">
                    <h2>Cài đặt hồ sơ</h2>
                    <p>Quản lý thông tin cá nhân và cài đặt tài khoản của bạn</p>
                </div>

                <div class="profile-form-grid">
                    <div class="form-group full-width">
                        <label for="name">Họ và tên</label>
                        <input type="text" id="name" placeholder="Nhập họ tên của bạn">
                    </div>

                    <div class="form-group">
                        <label for="email">Địa chỉ Email</label>
                        <input type="email" id="email" readonly>
                    </div>

                    <div class="form-group">
                        <label for="phone">Số điện thoại</label>
                        <input type="tel" id="phone" placeholder="Nhập số điện thoại">
                    </div>

                    <div class="form-group full-width">
                        <label for="address">Địa chỉ giao hàng</label>
                        <input type="text" id="address" placeholder="Nhập địa chỉ của bạn">
                    </div>
                </div>

                <button type="button" class="btn save-profile-btn mt-4">
                    <i class="fas fa-save me-2"></i> Lưu thay đổi
                </button>
            </div>

            <!-- Orders Pane (Placeholder) -->
            <div id="my-orders" class="content-pane glass">
                <div class="content-header">
                    <h2>Lịch sử đơn hàng</h2>
                    <p>Theo dõi trạng thái và quản lý các đơn hàng bạn đã đặt</p>
                </div>
                <div class="text-center py-5">
                    <i class="fas fa-shopping-bag fa-4x mb-3 text-muted" style="opacity: 0.3;"></i>
                    <p class="text-muted">Bạn chưa có đơn hàng nào.</p>
                    <a href="{{ url('book-list') }}" class="btn mt-3">Mua sắm ngay</a>
                </div>
            </div>

             <!-- Purchased Books Pane (Redirect/Preview) -->
             <div id="purchased-books-pane" class="content-pane glass">
                <div class="content-header">
                    <h2>Thư viện của tôi</h2>
                    <p>Xem toàn bộ các cuốn sách bạn đã mua và sở hữu</p>
                </div>
                <div class="text-center py-5">
                    <i class="fas fa-book-reader fa-4x mb-3 text-muted" style="opacity: 0.3;"></i>
                    <p class="text-muted">Xem tủ sách cá nhân của bạn để bắt đầu đọc.</p>
                    <a href="{{ url('purchased-books') }}" class="btn mt-3">Đi tới thư viện</a>
                </div>
            </div>

            <!-- Wishlist Pane (Placeholder) -->
            <div id="wishlist" class="content-pane glass">
                <div class="content-header">
                    <h2>Danh sách yêu thích</h2>
                    <p>Những cuốn sách bạn đã lưu để xem sau</p>
                </div>
                <div class="text-center py-5">
                    <i class="fas fa-heart fa-4x mb-3 text-muted" style="opacity: 0.3;"></i>
                    <p class="text-muted">Danh sách yêu thích của bạn đang trống.</p>
                </div>
            </div>

            <!-- Change Password Pane -->
            <div id="change-password" class="content-pane glass">
                <div class="content-header">
                    <h2>Đổi mật khẩu</h2>
                    <p>Đảm bảo an toàn cho tài khoản của bạn</p>
                </div>

                <div style="max-width: 45rem;">
                    <div class="form-group">
                        <label for="current_password">Mật khẩu hiện tại</label>
                        <div class="password-wrapper">
                            <input type="password" id="current_password" placeholder="Nhập mật khẩu hiện tại">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="new_password">Mật khẩu mới</label>
                        <div class="password-wrapper">
                            <input type="password" id="new_password" placeholder="Nhập mật khẩu mới">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="new_password_confirmation">Xác nhận mật khẩu mới</label>
                        <input type="password" id="new_password_confirmation" placeholder="Xác nhận mật khẩu mới">
                    </div>

                    <button type="button" class="btn save-password-btn mt-3">
                        <i class="fas fa-key me-2"></i> Cập nhật mật khẩu
                    </button>
                </div>
            </div>
        </main>
    </div>
</section>
@endsection

@section('scripts')
<script>
    window.profileConfig = {
        apiUrl: "{{ url('api/users') }}",
        loginUrl: "{{ url('login') }}",
        homeUrl: "{{ route('home') }}",
        csrfToken: "{{ csrf_token() }}"
    };
</script>
<script src="{{ asset('js/profile.js') }}"></script>
@endsection
