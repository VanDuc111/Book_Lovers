<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Trang Quản Trị - BookLovers</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
      integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
      crossorigin="anonymous"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
    />
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}" />
  </head>

  <body>
    <script>
      function isAdminLoggedIn() {
        const user = localStorage.getItem("user");
        if (user) {
          try {
            const parsedUser = JSON.parse(user);
            return parsedUser.role === "admin";
          } catch (error) {
            console.error("Lỗi khi parse JSON từ localStorage:", error);
            return false;
          }
        }
        return false;
      }

      if (!isAdminLoggedIn()) {
        window.location.href = "{{ url('login') }}";
      }
    </script>

    <div class="admin-wrapper">
        <!-- Sidebar Overlay for mobile -->
        <div id="sidebar-overlay"></div>

        <!-- Sidebar -->
        <nav id="sidebar">
            <div class="sidebar-header">
                <a href="{{ route('home') }}" class="logo">
                    <img src="{{ asset('assets/icons/book-1.svg') }}" class="logo-icon" alt="Logo" style="filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(341deg) brightness(102%) contrast(101%); width: 3.5rem; height: 3.5rem;">
                    <span class="logo-text">Book<span class="logo-accent">Lovers</span></span>
                </a>
            </div>

            <ul class="nav-list">
                <li class="nav-item">
                    <a class="nav-link active" href="#" data-section="dashboard">
                        <img src="{{ asset('assets/icons/dashboard.svg') }}" class="nav-icon" alt="Dashboard">
                        <span>Dashboard</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-section="manage-books">
                        <img src="{{ asset('assets/icons/book-1.svg') }}" class="nav-icon" alt="Books">
                        <span>Quản lý Sách</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-section="manage-users">
                        <img src="{{ asset('assets/icons/people.svg') }}" class="nav-icon" alt="Users">
                        <span>Quản lý Người dùng</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-section="manage-categories">
                        <img src="{{ asset('assets/icons/category.svg') }}" class="nav-icon" alt="Categories">
                        <span>Quản lý Thể loại</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-section="manage-orders">
                        <img src="{{ asset('assets/icons/shopping-cart.svg') }}" class="nav-icon" alt="Orders">
                        <span>Quản lý Đơn hàng</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-section="manage-reviews">
                        <img src="{{ asset('assets/icons/star.svg') }}" class="nav-icon" alt="Reviews">
                        <span>Quản lý Đánh giá</span>
                    </a>
                </li>
            </ul>

            <div class="sidebar-footer">
                <button id="admin-logout-btn" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Đăng xuất</span>
                </button>
            </div>
        </nav>

        <!-- Main Content -->
        <div id="main-content">
            <header class="admin-topbar">
                <div class="topbar-left">
                    <button id="sidebar-toggle" class="sidebar-toggle">
                        <i class="fas fa-bars"></i>
                    </button>
                    <h1 id="section-title">Dashboard</h1>
                </div>
                <div class="admin-profile">
                    <span class="admin-name">Admin</span>
                    <img src="https://ui-avatars.com/api/?name=Admin&background=ff6347&color=fff" alt="Admin" class="admin-avatar">
                </div>
            </header>

            <div class="container-fluid py-4">
                <div id="content-area">
                    <p>Chào mừng đến với trang quản trị.</p>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
      crossorigin="anonymous"
    ></script>
    <script src="{{ asset('js/login.js') }}"></script>
    <script src="{{ asset('js/admin.js') }}"></script>
    <script>
        const loginUrl = "{{ url('login') }}";
    </script>

  </body>
</html>
