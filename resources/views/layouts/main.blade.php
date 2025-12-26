<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Book Lovers')</title>

    <!-- Style Links -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="{{ asset('css/header.css') }}">
    <link rel="stylesheet" href="{{ asset('css/footer.css') }}">
    <link rel="stylesheet" href="{{ asset('css/book-list.css') }}">
    <link rel="stylesheet" href="{{ asset('css/toast.css') }}">
    
    <!-- Swiper CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">

    @yield('styles')
</head>
<body>

    <div id="site-header">
        <header class="header">
            <div class="header-1">
                <a href="{{ route('home') }}" class="logo-brand" id="logo" aria-label="BookLovers">
                    <img src="{{ asset('assets/images/logo-full.svg') }}" alt="BookLovers Logo" class="brand-logo">
                </a>

                <!-- Category -->
                <nav class="category">
                    <button class="category-bars btn" aria-label="Mở danh mục">
                        <img src="{{ asset('assets/icons/category.svg') }}" alt="Category" class="category-icon">
                    </button>
                    <div class="category-content">
                        <ul id="header-category-list" class="category-list"></ul>
                    </div>
                </nav>

                <form action="" class="form-box from-box" id="search-form" autocomplete="off" role="search" aria-label="Site search">
                    <input type="search" name="q" placeholder="Tìm kiếm sản phẩm..." id="search-input" autocomplete="off">
                </form>

                <div class="icons">
                    <a href="{{ url('cart') }}" class="cart-link">
                        <img src="{{ asset('assets/icons/shopping-cart.svg') }}" alt="Cart" class="navbar-icon">
                    </a>
                    <a href="{{ url('login') }}" id="login-btn" class="user-info">
                        <img src="{{ asset('assets/icons/user.svg') }}" alt="User" class="navbar-icon">
                        <span id="welcome-message"></span>
                    </a>
                    <button id="logout-btn" style="display: none">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>

            <div class="header-2">
                <div class="navbar">
                    <a href="{{ route('home') }}">Trang Chủ</a>
                    <a href="{{ url('purchased-books') }}">Sách đã mua</a>
                    <a href="{{ url('reviews') }}">Đánh giá</a>
                    <a href="{{ url('book-list') }}">Toàn bộ</a>
                </div>
            </div>
        </header>
    </div>

    <main>
        @yield('content')
    </main>

    <div id="site-footer">
        <div class="footer-section">
            <div class="container">
                <div class="row g-4">
                    <div class="col-md-4">
                        <div class="icons h-100">
                            <i class="fas fa-info"></i>
                            <div class="content">
                                <h3>Về website</h3>
                                <p>Giới thiệu</p>
                                <p>Điều khoản dịch vụ</p>
                                <p>Quy chế hoạt động</p>
                                <p>Blog</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="icons h-100">
                            <i class="fas fa-lock"></i>
                            <div class="content">
                                <h3>Chính sách</h3>
                                <p>Chính sách bảo mật</p>
                                <p>Chính sách đổi trả</p>
                                <p>Chính sách giao tiếp</p>
                                <p>Chính sách thanh toán</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="icons h-100">
                            <i class="fas fa-headset"></i>
                            <div class="content">
                                <h3>Hỗ trợ 24/7</h3>
                                <p>Hotline: 0934364007</p>
                                <p>Email: lienhe94@gmail.com</p>
                                <p>Địa chỉ: 207 Giải Phóng, phường Đồng Tâm, quận Hai Bà Trưng, Hà Nội</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <script type="module" src="{{ asset('js/common.js') }}"></script>
    <script src="{{ asset('js/login.js') }}"></script>
    <script src="{{ asset('js/toast.js') }}"></script>
    <div id="toast-container"></div>
    <script type="module">
        import { addHeader, addFooter } from "{{ asset('js/common.js') }}";
        addHeader();
        addFooter();
    </script>
    
    @yield('scripts')

</body>
</html>
