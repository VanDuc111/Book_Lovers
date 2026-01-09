@extends('layouts.main')

@section('title', 'Thanh toán - Book Lovers')

@section('content')
    <div class="checkout-container">
        <div class="checkout-wrapper">
            <!-- Left Column: Form -->
            <div class="checkout-form-section">
                <div class="checkout-header">
                    <h1>Thanh toán</h1>
                    <p class="text-muted">Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng</p>
                </div>

                <!-- Shipping Address -->
                <div class="checkout-card">
                    <div class="card-header">
                        <i class="fas fa-map-marker-alt"></i>
                        <h3>Địa chỉ giao hàng</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label for="fullName">Họ và tên <span class="required">*</span></label>
                            <input type="text" id="fullName" class="form-control" placeholder="Nguyễn Văn A">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="phone">Số điện thoại <span class="required">*</span></label>
                                <input type="tel" id="phone" class="form-control" placeholder="0912345678">
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" class="form-control" placeholder="example@email.com">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="province">Tỉnh/Thành phố <span class="required">*</span></label>
                            <select id="province" class="form-control">
                                <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                <option value="hanoi">Hà Nội</option>
                                <option value="hcm">TP. Hồ Chí Minh</option>
                                <option value="danang">Đà Nẵng</option>
                                <option value="haiphong">Hải Phòng</option>
                                <option value="cantho">Cần Thơ</option>
                            </select>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="district">Quận/Huyện <span class="required">*</span></label>
                                <select id="district" class="form-control">
                                    <option value="">-- Chọn Quận/Huyện --</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="ward">Phường/Xã <span class="required">*</span></label>
                                <select id="ward" class="form-control">
                                    <option value="">-- Chọn Phường/Xã --</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="address">Địa chỉ cụ thể <span class="required">*</span></label>
                            <input type="text" id="address" class="form-control" placeholder="Số nhà, tên đường...">
                        </div>

                        <div class="form-group">
                            <label for="note">Ghi chú đơn hàng</label>
                            <textarea id="note" class="form-control" rows="3" placeholder="Ghi chú thêm (tùy chọn)..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- Payment Method -->
                <div class="checkout-card">
                    <div class="card-header">
                        <i class="fas fa-credit-card"></i>
                        <h3>Phương thức thanh toán</h3>
                    </div>
                    <div class="card-body">
                        <div class="payment-methods">
                            <label class="payment-option">
                                <input type="radio" name="payment" value="cod" checked>
                                <div class="payment-content">
                                    <div class="payment-icon">
                                        <i class="fas fa-money-bill-wave"></i>
                                    </div>
                                    <div class="payment-info">
                                        <h4>Thanh toán khi nhận hàng (COD)</h4>
                                        <p>Thanh toán bằng tiền mặt khi nhận hàng</p>
                                    </div>
                                </div>
                            </label>

                            <label class="payment-option">
                                <input type="radio" name="payment" value="bank">
                                <div class="payment-content">
                                    <div class="payment-icon">
                                        <i class="fas fa-university"></i>
                                    </div>
                                    <div class="payment-info">
                                        <h4>Chuyển khoản ngân hàng</h4>
                                        <p>Chuyển khoản qua VietQR hoặc số tài khoản</p>
                                    </div>
                                </div>
                            </label>

                            <label class="payment-option">
                                <input type="radio" name="payment" value="momo">
                                <div class="payment-content">
                                    <div class="payment-icon">
                                        <i class="fas fa-wallet"></i>
                                    </div>
                                    <div class="payment-info">
                                        <h4>Ví điện tử MoMo</h4>
                                        <p>Thanh toán qua ví MoMo</p>
                                    </div>
                                </div>
                            </label>

                            <label class="payment-option">
                                <input type="radio" name="payment" value="card">
                                <div class="payment-content">
                                    <div class="payment-icon">
                                        <i class="fas fa-credit-card"></i>
                                    </div>
                                    <div class="payment-info">
                                        <h4>Thẻ tín dụng/Ghi nợ</h4>
                                        <p>Visa, Mastercard, JCB</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Order Summary -->
            <div class="checkout-summary-section">
                <div class="summary-sticky">
                    <div class="checkout-card">
                        <div class="card-header">
                            <i class="fas fa-shopping-bag"></i>
                            <h3>Đơn hàng của bạn</h3>
                        </div>
                        <div class="card-body">
                            <div id="order-items" class="order-items">
                                <!-- Items will be loaded here -->
                                <div class="loading-skeleton">
                                    <div class="skeleton-item"></div>
                                    <div class="skeleton-item"></div>
                                </div>
                            </div>

                            <div class="order-summary">
                                <div class="summary-row">
                                    <span>Tạm tính</span>
                                    <span id="subtotal">0 ₫</span>
                                </div>
                                <div class="summary-row">
                                    <span>Phí vận chuyển</span>
                                    <span id="shipping-fee">30.000 ₫</span>
                                </div>
                                <div class="summary-row discount">
                                    <span>Giảm giá</span>
                                    <span id="discount">- 0 ₫</span>
                                </div>
                                <div class="summary-divider"></div>
                                <div class="summary-row total">
                                    <span>Tổng cộng</span>
                                    <span id="total-amount">0 ₫</span>
                                </div>
                            </div>

                            <button class="btn-checkout" id="place-order-btn">
                                <i class="fas fa-lock"></i>
                                Đặt hàng
                            </button>

                            <div class="security-badges">
                                <div class="badge-item">
                                    <i class="fas fa-shield-alt"></i>
                                    <span>Bảo mật thanh toán</span>
                                </div>
                                <div class="badge-item">
                                    <i class="fas fa-truck"></i>
                                    <span>Giao hàng toàn quốc</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <a href="{{ url('cart') }}" class="back-to-cart">
                        <i class="fas fa-arrow-left"></i>
                        Quay lại giỏ hàng
                    </a>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <link rel="stylesheet" href="{{ asset('css/checkout.css') }}">
    <script type="module" src="{{ asset('js/checkout.js') }}"></script>
@endsection
