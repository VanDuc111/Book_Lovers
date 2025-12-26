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

    <div class="container-fluid">
      <div class="row">
        <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
          <div class="sidebar-sticky">
            <div class="py-4 text-center sidebar">
                <a href="{{ route('home') }}" class="logo">
                     <i class="fas fa-book-open logo-icon"></i>
                     <span class="logo-text">Book<span class="logo-accent">Lovers</span></span>
                </a>
            </div>
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" href="#" data-section="dashboard">
                  <i class="fas fa-tachometer-alt"></i> Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" data-section="manage-books">
                  <i class="fas fa-book"></i> Quản lý Sách
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" data-section="manage-users">
                  <i class="fas fa-users"></i> Quản lý Người dùng
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" data-section="manage-categories">
                  <i class="fas fa-list"></i> Quản lý Thể loại
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" data-section="manage-orders">
                  <i class="fas fa-shopping-cart"></i> Quản lý Đơn hàng
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" data-section="manage-reviews">
                  <i class="fas fa-star"></i> Quản lý Đánh giá
                </a>
              </li>
            </ul>
            <div class="mt-5 px-3">
                <button id="admin-logout-btn" class="btn btn-outline-danger w-100">Đăng xuất</button>
            </div>
          </div>
        </nav>

        <main role="main" class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div
            class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
          >
            <h1 class="h2" id="section-title">Dashboard</h1>
          </div>

          <div id="content-area">
            <p>Chào mừng đến với trang quản trị.</p>
          </div>
        </main>
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
        // Update section title based on click
        document.querySelectorAll('#sidebar .nav-link').forEach(link => {
            link.addEventListener('click', function() {
                document.getElementById('section-title').textContent = this.textContent.trim();
            });
        });
        
        // Admin logout
        document.getElementById('admin-logout-btn').addEventListener('click', () => {
             localStorage.removeItem('user');
             window.location.href = "{{ url('login') }}";
        });
    </script>
  </body>
</html>
