@extends('layouts.main')

@section('title', 'Sách đã mua - Book Lovers')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/book-list.css') }}">
    <style>
        .rating-stars {
            font-size: 2rem;
            color: #ccc;
            cursor: pointer;
        }
        .rating-stars .fa-star.checked {
            color: #ffc107;
        }
    </style>
@endsection

@section('content')
    <div class="container-fluid mt-5">
        <div class="container mt-3">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="{{ route('home') }}">Trang Chủ</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Sách đã mua</li>
                </ol>
            </nav>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="row book-list" id="purchased-book-list">
                    <div class="text-center mt-5">
                        <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Review Modal -->
    <div class="modal fade" id="reviewModal" tabindex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="reviewModalLabel">Đánh giá sách</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="reviewForm">
                        <input type="hidden" id="reviewBookID">
                        <div class="mb-3 text-center">
                            <label class="form-label d-block">Đánh giá của bạn</label>
                            <div class="rating-stars" id="ratingStars">
                                <i class="fa fa-star" data-value="1"></i>
                                <i class="fa fa-star" data-value="2"></i>
                                <i class="fa fa-star" data-value="3"></i>
                                <i class="fa fa-star" data-value="4"></i>
                                <i class="fa fa-star" data-value="5"></i>
                            </div>
                            <input type="hidden" id="reviewRating" value="0">
                        </div>
                        <div class="mb-3">
                            <label for="reviewComment" class="form-label">Nhận xét</label>
                            <textarea class="form-control" id="reviewComment" rows="3"
                                placeholder="Chia sẻ cảm nghĩ của bạn về cuốn sách..."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" id="submitReviewBtn">Gửi đánh giá</button>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script type="module">
        import { AddFooter, getUserId } from "{{ asset('js/common.js') }}";

        document.addEventListener('DOMContentLoaded', async () => {
            const userId = getUserId();
            const container = document.getElementById('purchased-book-list');
            const reviewModalElement = document.getElementById('reviewModal');
            const reviewModal = new bootstrap.Modal(reviewModalElement);
            const ratingStars = document.querySelectorAll('#ratingStars .fa-star');
            const reviewRatingInput = document.getElementById('reviewRating');
            let currentRating = 0;

            ratingStars.forEach(star => {
                star.addEventListener('click', function () {
                    currentRating = this.getAttribute('data-value');
                    reviewRatingInput.value = currentRating;
                    updateStars(currentRating);
                });
            });

            function updateStars(rating) {
                ratingStars.forEach(star => {
                    if (star.getAttribute('data-value') <= rating) {
                        star.classList.add('checked');
                    } else {
                        star.classList.remove('checked');
                    }
                });
            }

            document.getElementById('submitReviewBtn').addEventListener('click', async () => {
                const bookID = document.getElementById('reviewBookID').value;
                const comment = document.getElementById('reviewComment').value;
                const rating = reviewRatingInput.value;

                if (rating == 0) {
                    alert('Vui lòng chọn số sao đánh giá!');
                    return;
                }

                try {
                    const response = await fetch('{{ url('api/reviews') }}', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': '{{ csrf_token() }}'
                        },
                        body: JSON.stringify({ bookID, userID: userId, rating, comment })
                    });

                    const result = await response.json();
                    if (response.ok && !result.error) {
                        alert('Đánh giá của bạn đã được gửi thành công!');
                        reviewModal.hide();
                        document.getElementById('reviewForm').reset();
                        updateStars(0);
                        currentRating = 0;
                    } else {
                        alert('Lỗi: ' + (result.error || result.message || 'Không thể gửi đánh giá'));
                    }
                } catch (error) {
                    console.error('Error submitting review:', error);
                    alert('Đã xảy ra lỗi khi gửi đánh giá.');
                }
            });

            if (!userId) {
                container.innerHTML = `<div class="alert alert-warning text-center">Vui lòng <a href="{{ url('login') }}">đăng nhập</a> để xem sách đã mua.</div>`;
                return;
            }

            try {
                const response = await fetch(`{{ url('api/purchased-books') }}?userID=${userId}`);
                if (!response.ok) throw new Error('Failed to fetch purchased books');
                const books = await response.json();

                container.innerHTML = '';

                if (books.length === 0) {
                    container.innerHTML = '<div class="alert alert-info text-center">Bạn chưa mua cuốn sách nào.</div>';
                    return;
                }

                books.forEach(book => {
                    const bookCard = document.createElement('div');
                    bookCard.className = 'col-md-3 mb-4 book-card';
                    bookCard.innerHTML = `
                        <div class="card h-100 shadow-sm">
                            <img src="${book.image || '{{ asset('assets/images/default-book.png') }}'}" class="card-img-top" alt="${book.title}" style="height: 300px; object-fit: cover;">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title text-truncate" title="${book.title}">${book.title}</h5>
                                <p class="card-text text-muted small">${book.author || 'Unknown Author'}</p>
                                <p class="card-text fw-bold text-primary">${parseFloat(book.bookPrice).toLocaleString('vi-VN')} đ</p>
                                <div class="mt-auto d-flex gap-2">
                                    <a href="{{ url('book-details') }}?id=${book.bookID}" class="btn btn-outline-primary btn-sm flex-grow-1">Xem chi tiết</a>
                                    <button class="btn btn-warning btn-sm flex-grow-1 review-btn" data-bookid="${book.bookID}">Đánh giá</button>
                                </div>
                            </div>
                        </div>
                    `;
                    container.appendChild(bookCard);
                });

                document.querySelectorAll('.review-btn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        const bookID = this.getAttribute('data-bookid');
                        document.getElementById('reviewBookID').value = bookID;
                        reviewModal.show();
                    });
                });

            } catch (error) {
                console.error('Error fetching purchased books:', error);
                container.innerHTML = '<div class="alert alert-danger text-center">Đã xảy ra lỗi khi tải danh sách sách đã mua.</div>';
            }
        });
    </script>
@endsection
