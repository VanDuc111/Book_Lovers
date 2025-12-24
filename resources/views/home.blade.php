@extends('layouts.main')

@section('title', 'Book Lovers - Home')

@section('content')
    <!-- home section start -->
    <section class="home" id="home">
      <div class="row">
        <div class="content">
          <h3>Ưu đãi lên đến 30%!</h3>
          <p>Danh sách nổi bật</p>
          <a href="book-list.html" class="btn">Mua ngay!</a>
        </div>

        <div class="swiper home-books-list">
          <div class="swiper-wrapper" id="home-books-wrapper">
            <div class="swiper-slide loading-message">
              Đang tải danh sách nổi bật...
            </div>
          </div>
          <!-- Image removed as it is missing from assets -->
        </div>
      </div>
    </section>
    <!-- home section ends -->

    <!-- sach-van-hoc section start -->
    <section class="sach-van-hoc container" id="sach-van-hoc">
      <div class="heading"><span>Sách Thể Loại Văn Học</span></div>

      <div class="sach-van-hoc-list swiper">
        <div class="swiper-wrapper" id="sach-van-hoc-container">
          <div class="swiper-slide loading-message">
            Đang tải sách văn học...
          </div>
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </div>
    </section>
    <!-- sach-van-hoc section ends -->

    <!-- daily-recommended section start -->
    <section class="daily-recommended container" id="daily-recommended">
      <div class="heading"><span>Gợi Ý Hôm Nay</span></div>
      <div class="daily-recommended-list swiper">
        <div class="swiper-wrapper" id="daily-recommended-container">
          <div class="swiper-slide loading-message">Đang tải sách gợi ý...</div>
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </div>
    </section>
    <!-- daily-recommended section ends -->

    <!-- recent-reviews section starts -->
    <section class="reviews" id="recent-reviews">
      <h1 class="heading"><span>Đánh giá gần đây</span></h1>
      <div class="row" id="recent-reviews-row">
        <div class="col-12 text-center py-5">
           <div class="spinner-border text-primary" role="status">
             <span class="visually-hidden">Loading...</span>
           </div>
           <p class="mt-2 text-muted">Đang tải các đánh giá mới nhất...</p>
        </div>
      </div>
    </section>
    <!-- recent-reviews section ends -->
@endsection

@section('scripts')
    <script type="module" src="{{ asset('js/home.js') }}"></script>
    <script src="{{ asset('js/script.js') }}"></script>
    <script type="module">
        // Initial setup for common components if needed
        import { addHeader, addFooter } from "{{ asset('js/common.js') }}";
        // Header and Footer are already included via Blade, but we need to ensure their JS logic runs
        document.addEventListener('DOMContentLoaded', () => {
             // In Laravel, we skip addHeader/addFooter but we might need their init logic
             // For now, common.js DOMContentLoaded will handle updateCartIcon
        });
    </script>
@endsection
