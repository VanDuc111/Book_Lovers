@extends('layouts.main')

@section('title', request('search') ? 'Kết quả tìm kiếm - Book Lovers' : 'Sách - Book Lovers')

@section('content')
    <book-list-app></book-list-app>
@endsection

@section('scripts')
    <!-- Logic handled by Vue in app.js -->
@endsection
