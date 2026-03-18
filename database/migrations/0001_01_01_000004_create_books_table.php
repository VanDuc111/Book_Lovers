<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('slug', 250)->unique();          // SEO-friendly URL
            $table->string('author', 100)->nullable();
            $table->string('publisher', 100)->nullable();
            $table->decimal('price', 12, 2)->default(0);    // bookPrice -> price
            $table->decimal('original_price', 12, 2)->nullable(); // Giá gốc (để hiển thị giảm giá)
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();   // Mô tả ngắn cho card
            $table->unsignedInteger('stock')->default(0);
            $table->unsignedInteger('sold_count')->default(0); // Đã bán bao nhiêu
            $table->string('image', 255)->nullable();
            $table->unsignedInteger('pages')->nullable();     // Số trang
            $table->string('language', 30)->default('Tiếng Việt');
            $table->string('isbn', 20)->nullable();
            $table->year('publish_year')->nullable();

            // Foreign key to categories
            $table->foreignId('category_id')                 // categoryID -> category_id
                  ->nullable()
                  ->constrained('categories')
                  ->nullOnDelete()
                  ->cascadeOnUpdate();

            $table->boolean('is_featured')->default(false);  // Sách nổi bật
            $table->boolean('is_active')->default(true);     // Ẩn/hiện sách

            $table->timestamps();

            // Indexes
            $table->index('title');
            $table->index('author');
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
