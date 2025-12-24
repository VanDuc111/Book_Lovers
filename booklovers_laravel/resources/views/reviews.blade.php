@extends('layouts.main')

@section('title', 'Đánh giá - Book Lovers')

@section('content')
    <div class="container mt-4 mb-5">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a href="{{ route('home') }}">Trang Chủ</a>
          </li>
          <li class="breadcrumb-item active" aria-current="page">Đánh giá</li>
        </ol>
      </nav>

      <h3 class="mb-3">Tất cả đánh giá</h3>

      <div class="table-responsive">
        <table class="table table-striped reviews-table" id="reviews-table">
          <thead class="table-dark">
            <tr>
              <th scope="col">Sách</th>
              <th scope="col">Người dùng</th>
              <th scope="col">Rating</th>
              <th scope="col">Review</th>
              <th scope="col">Ngày</th>
            </tr>
          </thead>
          <tbody>
            <tr id="reviews-loading">
              <td colspan="5" class="text-center py-4">Đang tải đánh giá...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
@endsection

@section('scripts')
    <script type="module">


      async function fetchJson(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }

      async function loadReviews() {
        try {
          // New API returns reviews with book and user info included
          const reviews = await fetchJson("{{ url('api/reviews') }}");

          const tbody = document.querySelector("#reviews-table tbody");
          tbody.innerHTML = "";

          if (!Array.isArray(reviews) || reviews.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Chưa có đánh giá nào.</td></tr>`;
            return;
          }

          reviews.forEach((r) => {
            // Data now comes directly from the review object
            const bookTitle = r.bookTitle || r.title || "Unknown Book";
            const userName = r.userName || "Khách";
            const date = r.created_at
              ? new Date(r.created_at).toLocaleString('vi-VN')
              : "";

            function renderStars(rating) {
              rating = parseInt(rating) || 0;
              let html = '<span class="rating-stars static" aria-hidden="true" style="color:#ffc107;">';
              for (let i = 1; i <= 5; i++) {
                const cls = i <= rating ? "fas fa-star" : "far fa-star";
                html += `<i class="${cls}"></i>`;
              }
              html += "</span>";
              return html;
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
                        <td>${escapeHtml(bookTitle)}</td>
                        <td>${escapeHtml(userName)}</td>
                        <td>${renderStars(r.rating || 0)}</td>
                        <td>${escapeHtml(r.comment || "")}</td>
                        <td>${escapeHtml(date)}</td>
                    `;
            tbody.appendChild(tr);
          });
        } catch (err) {
          const tbody = document.querySelector("#reviews-table tbody");
          tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-danger">Lỗi khi tải đánh giá: ${err.message}</td></tr>`;
          console.error(err);
        }
      }

      function escapeHtml(str) {
        return String(str)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
      }

      loadReviews();
    </script>
@endsection
