@extends('layouts.main')

@section('title', 'Kết quả tìm kiếm - Book Lovers')

@section('content')
    <div class="container mt-5 mb-5">
        <h1>Kết quả tìm kiếm</h1>
        <div id="results" class="row book-list mt-4">
             <div class="text-center py-5">
                 <div class="spinner-border text-primary" role="status"></div>
                 <p class="mt-2">Đang tìm kiếm...</p>
             </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const searchTerm = urlParams.get('search');
            const resultsDiv = document.getElementById('results');

            if (searchTerm) {
                fetch(`{{ url('api/books') }}?search=${encodeURIComponent(searchTerm)}`)
                    .then(response => response.json())
                    .then(books => {
                        resultsDiv.innerHTML = '';

                        if (Array.isArray(books) && books.length > 0) {
                            books.forEach(book => {
                                const col = document.createElement('div');
                                col.className = 'col-md-3 mb-4';
                                col.innerHTML = `
                                    <div class="card h-100 shadow-sm" style="cursor: pointer;" onclick="window.location.href='{{ url('book-details') }}?id=${book.bookID}'">
                                        <img src="${book.image || '{{ asset('assets/images/default-book.png') }}'}" class="card-img-top" alt="${book.title}" style="height: 250px; object-fit: cover;">
                                        <div class="card-body">
                                            <h5 class="card-title text-truncate">${book.title}</h5>
                                            <p class="card-text text-muted small">${book.author || ''}</p>
                                            <p class="card-text fw-bold text-primary">${parseFloat(book.bookPrice).toLocaleString('vi-VN')} đ</p>
                                        </div>
                                    </div>
                                `;
                                resultsDiv.appendChild(col);
                            });
                        } else {
                            resultsDiv.innerHTML = '<div class="col-12 text-center py-5"><h3>Không tìm thấy sách nào cho từ khóa "' + searchTerm + '".</h3><a href="{{ url('book-list') }}" class="btn btn-primary mt-3">Quay lại danh sách sách</a></div>';
                        }
                    })
                    .catch(error => {
                        console.error('Lỗi khi tìm kiếm sách:', error);
                        resultsDiv.innerHTML = '<div class="col-12 text-center py-5 text-danger">Có lỗi xảy ra khi tìm kiếm.</div>';
                    });
            } else {
                resultsDiv.innerHTML = '<div class="col-12 text-center py-5">Vui lòng nhập từ khóa tìm kiếm.</div>';
            }
        });
    </script>
@endsection
