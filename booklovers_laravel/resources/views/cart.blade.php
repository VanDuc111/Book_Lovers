@extends('layouts.main')

@section('title', 'Giỏ hàng - Book Lovers')

@section('content')
    <div class="container mt-5">
        <h1>Giỏ hàng của bạn</h1>
        <table class="table" id="cart-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Sản phẩm</th>
                    <th>Tên</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Tổng cộng</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <div class="text-end">
            <strong class="cart-total">Tổng tiền: <span id="cart-total">0</span> VND</strong>
            <button id="checkout-all-btn" class="btn btn-success ms-3">Thanh toán tất cả</button>
        </div>
    </div>
@endsection

@section('scripts')
    <script type="module" src="{{ asset('js/cart.js') }}"></script>
@endsection
