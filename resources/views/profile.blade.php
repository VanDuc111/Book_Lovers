@extends('layouts.main')

@section('title', 'Hồ Sơ Cá Nhân - Book Lovers')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/profile.css') }}">
@endsection

@section('content')
<profile-app :config="profileConfig"></profile-app>
@endsection

@section('scripts')
<script>
    window.profileConfig = {
        apiUrl: "{{ url('api/users') }}",
        loginUrl: "{{ url('login') }}",
        homeUrl: "{{ route('home') }}",
        csrfToken: "{{ csrf_token() }}"
    };
</script>
@endsection
