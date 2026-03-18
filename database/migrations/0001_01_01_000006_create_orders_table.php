<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')         // userID -> user_id
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete()
                  ->cascadeOnUpdate();

            $table->string('order_code', 20)->unique();      // Mã đơn hàng dễ đọc: BL-20260318-001
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->decimal('shipping_fee', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);

            // Thông tin giao hàng
            $table->string('receiver_name', 100)->nullable();
            $table->string('receiver_phone', 20)->nullable();
            $table->string('shipping_address', 500)->nullable();
            $table->text('note')->nullable();

            // Thanh toán
            $table->string('payment_method', 30)->default('cod'); // cod, bank_transfer, momo, vnpay
            $table->enum('payment_status', ['unpaid', 'paid', 'refunded'])->default('unpaid');

            // Trạng thái đơn hàng
            $table->enum('status', [
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
                'returned'
            ])->default('pending');

            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancel_reason', 255)->nullable();

            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'created_at']);
            $table->index('status');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')        // orderID -> order_id
                  ->constrained('orders')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();

            $table->foreignId('book_id')         // bookID -> book_id
                  ->constrained('books')
                  ->restrictOnDelete()
                  ->cascadeOnUpdate();

            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('price', 12, 2)->default(0); // Giá tại thời điểm mua
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
