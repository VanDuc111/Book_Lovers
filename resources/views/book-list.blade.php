@extends('layouts.main')

@section('title', 'Sách - Book Lovers')

@section('content')
    <div class="container mt-3">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('home') }}">Trang Chủ</a></li>
                <li class="breadcrumb-item"><a href="{{ url('book-list') }}">Sách</a></li>
                <li class="breadcrumb-item active" id="breadcrumb-current-category" aria-current="page"></li>
            </ol>
        </nav>
    </div>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-2">
                <!-- Sidebar for categories could go here if needed, currently book-list.js handles it? -->
            </div>
            <div class="col-md-10">
                <div class="row book-list"> </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script type="module" src="{{ asset('js/book-list.js') }}"></script>
@endsection
