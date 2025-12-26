@extends('layouts.main')

@section('title', 'Chi tiết sách - Book Lovers')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/book-list.css') }}" />
    <link rel="stylesheet" href="{{ asset('css/book-details.css') }}" />
@endsection

@section('content')
    <div id="book-details-container" class="container mt-4">
        <!-- Breadcrumb skeleton -->
        <nav aria-label="breadcrumb" class="mb-4 fade-in-up">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
            <li class="breadcrumb-item"><a href="/book-list">Sách</a></li>
            <li class="breadcrumb-item active" aria-current="page" id="breadcrumb-category">Đang tải...</li>
          </ol>
        </nav>

        <div id="book-details-content" class="row g-4">
          <!-- Left: Image Section -->
          <div class="col-lg-4 col-md-5 fade-in-up delay-1">
            <div class="book-details-image-section bg-white p-3 rounded shadow-sm text-center">
              <img id="book-image" src="{{ asset('assets/images/placeholder.png') }}" 
                   class="img-fluid rounded" 
                   alt="Book Image"
                   style="max-height: 450px; width: auto; object-fit: contain;">
            </div>
          </div>

          <!-- Right: Info Section -->
          <div class="col-lg-8 col-md-7 fade-in-up delay-2">
            <div class="book-details-info-section bg-white p-4 rounded shadow-sm">
              <h1 id="book-title" class="book-title mb-3">Đang tải tên sách...</h1>
              
              <div class="row mb-3" style="font-size: 1.4rem;">
                <div class="col-sm-6">
                  <p class="mb-1 text-muted">Tác giả: <span id="book-author" class="text-dark fw-bold">...</span></p>
                  <p class="mb-1 text-muted">Nhà xuất bản: <span id="book-publisher" class="text-dark fw-bold">...</span></p>
                </div>
                <div class="col-sm-6">
                  <p class="mb-1 text-muted">Thể loại: <span id="book-category" class="text-dark fw-bold">...</span></p>
                  <p class="mb-1 text-muted">Trạng thái: <span id="book-stock-status" class="fw-bold">...</span></p>
                </div>
              </div>

              <div class="price-section py-3 px-4 rounded mb-4" style="background: #fbfbfb;">
                <div class="d-flex align-items-center flex-wrap gap-3">
                  <span id="book-price" class="current-price text-danger fw-bold" style="font-size: 3.2rem;">0₫</span>
                </div>
              </div>

              <div class="shipping-info mb-4 p-3 border rounded" style="font-size: 1.4rem; border-color: #eee !important;">
                <p class="mb-2 fw-bold text-uppercase" style="font-size: 1.2rem; color: #777;">Thông tin vận chuyển</p>
                <div class="d-flex align-items-center gap-2">
                  <i class="fas fa-truck text-muted"></i>
                  <span>Giao hàng tiêu chuẩn - Dự kiến giao hàng sau 2-3 ngày</span>
                </div>
              </div>

              <div class="description-section mb-4">
                <h3 class="fw-bold mb-2" style="font-size: 1.6rem;">Mô tả chi tiết:</h3>
                <p id="book-description" class="text-muted" style="font-size: 1.4rem; line-height: 1.8;">Đang tải mô tả...</p>
              </div>

              <div class="action-section border-top pt-4">
                <div class="d-flex align-items-center gap-3 mb-4">
                  <label class="fw-bold me-2">Số lượng:</label>
                  <div class="quantity-selector d-flex align-items-center">
                    <button class="btn btn-link text-dark text-decoration-none decrease-quantity">-</button>
                    <input type="number" id="quantity" class="form-control text-center quantity-input" value="1" min="1" max="1" style="width: 60px; font-weight: 600;">
                    <button class="btn btn-link text-dark text-decoration-none increase-quantity">+</button>
                  </div>
                  <span id="book-stock-count" class="text-muted ms-2">0 sản phẩm có sẵn</span>
                </div>

                <div class="row g-3">
                  <div class="col-md-6 col-lg-5">
                    <button id="addToCartBtn" class="btn btn-outline-danger w-100 py-3 fw-bold" style="font-size: 1.6rem; border-width: 2px;">
                      <i class="fas fa-cart-plus me-2"></i>Thêm vào giỏ hàng
                    </button>
                  </div>
                  <div class="col-md-6 col-lg-5">
                    <button id="buyNowBtn" class="btn btn-danger w-100 py-3 fw-bold" style="font-size: 1.6rem;">
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- Reviews section -->
    <section class="container mt-4 mb-5">
      <div class="reviews-section">
        <h3 style="margin-bottom: 1rem">Đánh giá sản phẩm</h3>
        <div class="row">
          <div class="col-md-3 text-center">
            <div id="avg-rating-number" style="font-weight: 700">
              0<span
                id="avg-rating-suffix"
                style="font-size: 1.4rem; font-weight: 400"
                >/5</span
              >
            </div>
            <div
              id="avg-stars"
              class="rating-stars static"
              aria-hidden="true"
              style="margin: 0.6rem 0; font-size: 1.4rem; color: #f4b400"
            >
              <i class="fa fa-star"></i><i class="fa fa-star"></i
              ><i class="fa fa-star"></i><i class="fa fa-star"></i
              ><i class="fa fa-star"></i>
            </div>
            <div id="avg-count" style="color: #999">(0 đánh giá)</div>
          </div>

          <div class="col-md-9 d-flex align-items-start justify-content-end">
            <div id="review-auth-note" style="color: #666; text-align: right">
              Chỉ có thành viên mới có thể viết nhận xét. Vui lòng
              <a href="{{ url('login') }}">đăng nhập</a> hoặc
              <a href="{{ url('register') }}">đăng ký</a>.
            </div>
          </div>
        </div>

        <!-- Tabs and reviews list (inside the same visual box) -->
        <hr style="margin: 1.25rem 0; border-color: #eee" />
        <ul class="nav nav-tabs mb-3" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#tab-new"
              type="button"
              role="tab"
            >
              Mới nhất
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#tab-top"
              type="button"
              role="tab"
            >
              Yêu thích nhất
            </button>
          </li>
        </ul>

        <div class="tab-content">
          <div class="tab-pane fade show active" id="tab-new" role="tabpanel">
            <div id="reviews-list">
              <!-- Reviews will be loaded here -->
            </div>
          </div>
          <div class="tab-pane fade" id="tab-top" role="tabpanel">
            <div class="text-muted">Chưa có đánh giá được yêu thích.</div>
          </div>
        </div>
      </div>
    </section>
@endsection

@section('scripts')
    <script type="module" src="{{ asset('js/book-details.js') }}"></script>
    <script src="{{ asset('js/login.js') }}"></script>
@endsection
