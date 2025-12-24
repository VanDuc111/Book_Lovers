@extends('layouts.main')

@section('title', 'Chi tiết sách - Book Lovers')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/book-list.css') }}" />
    <style>
      /* Reviews block tweaks */
      #avg-rating-number {
        line-height: 1;
        font-size: 4.4rem;
      }
      #avg-stars i {
        font-size: 1.6rem;
        color: #f4b400;
      }
      #reviews-list {
        font-size: 1.15rem;
        line-height: 1.7;
      }
      #reviews-list .d-flex > div {
        min-height: 1px;
      }
      /* Make reviews container visually distinct and enforce two-column layout */
      .reviews-section {
        padding: 1.5rem;
        background: #fafafa;
        border: 1px solid #e9e9e9;
        border-radius: 8px;
      }
      /* Ensure tabs and reviews list are inside the visual box */
      .reviews-section .nav-tabs {
        margin-top: 0.5rem;
      }
      .reviews-section .tab-content {
        padding-top: 0.75rem;
      }
      .reviews-section .row {
        margin: 0;
      }
      .reviews-section .col-md-3,
      .reviews-section .col-md-9 {
        padding-left: 0;
        padding-right: 0;
      }
      /* make auth note visually aligned and smaller on wide screens */
      #review-auth-note {
        font-size: 0.95rem;
      }
      /* Review item columns: left fixed, right flexible and wrapping */
      #reviews-list .d-flex {
        align-items: flex-start;
      }
      #reviews-list .d-flex > div:first-child {
        width: 130px;
        min-width: 110px;
        padding-right: 1rem;
        box-sizing: border-box;
        font-size: 0.95rem;
      }
      #reviews-list .d-flex > div:last-child {
        flex: 1 1 auto;
        max-width: calc(100% - 150px);
        word-break: break-word;
        font-size: 1.15rem;
      }
      @media (max-width: 768px) {
        #avg-rating-number {
          font-size: 2.6rem !important;
        }
        #avg-stars i {
          font-size: 1.1rem;
        }
        #reviews-list .d-flex > div:first-child {
          width: 100px;
          min-width: 100px;
        }
        #reviews-list .d-flex > div:last-child {
          max-width: calc(100% - 110px);
        }
      }
    </style>
@endsection

@section('content')
    <div id="book-details-container" class="container mt-4"></div>

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
