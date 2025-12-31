@extends('layouts.main')

@section('title', 'Giỏ hàng - Book Lovers')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/cart.css') }}" />
@endsection

@section('content')
    <div class="container cart-container">
        <h1 class="cart-title">Giỏ hàng của bạn</h1>
        
        <!-- Mobile Select All Bar -->
        <div class="cart-mobile-controls d-lg-none mb-3">
            <div class="p-3 bg-white rounded shadow-sm d-flex align-items-center">
                <input type="checkbox" id="select-all-mobile" class="select-item me-2">
                <label for="select-all-mobile" class="fw-bold mb-0" style="font-size: 1.1rem;">Chọn tất cả</label>
            </div>
        </div>

        <div class="row g-4">
            <!-- Left Side: List of items -->
            <div class="col-lg-8">
                <div class="cart-table-wrapper">
                    <div class="table-responsive">
                        <table class="table cart-table" id="cart-table">
                            <thead>
                                <tr>
                                    <th style="width: 50px;"><input type="checkbox" id="select-all" class="select-item"></th>
                                    <th>Sản phẩm</th>
                                    <th>Giá</th>
                                    <th>Số lượng</th>
                                    <th>Tổng</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- JS will render items here -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Right Side: Order Summary -->
            <div class="col-lg-4">
                <div class="cart-summary-card">
                    <h3 class="summary-title">Tạm tính</h3>
                    <div class="summary-row">
                        <span>Số lượng sản phẩm:</span>
                        <span id="items-count">0</span>
                    </div>
                    <div class="summary-row">
                        <span>Giao hàng:</span>
                        <span class="text-success fw-bold">Miễn phí</span>
                    </div>
                    <div class="summary-row summary-total">
                        <span>Tổng tiền:</span>
                        <span id="cart-total">0 VNĐ</span>
                    </div>
                    
                    <button id="checkout-all-btn" class="btn btn-main btn-checkout-all">
                        THANH TOÁN TẤT CẢ
                    </button>
                    
                    <div class="mt-4 p-3 bg-light rounded" style="font-size: 0.9rem; color: #777;">
                        <p class="mb-1"><i class="fas fa-shield-alt me-2 text-primary"></i> Đảm bảo thanh toán an toàn</p>
                        <p class="mb-0"><i class="fas fa-undo me-2 text-warning"></i> Đổi trả dễ dàng trong 7 ngày</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script type="module" src="{{ asset('js/cart.js') }}"></script>
@endsection
