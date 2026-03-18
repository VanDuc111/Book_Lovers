<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            $table->foreignId('book_id')         // bookID -> book_id
                  ->constrained('books')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();

            $table->foreignId('user_id')         // userID -> user_id
                  ->constrained('users')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();

            $table->tinyInteger('rating')->unsigned()->default(5); // 1-5
            $table->string('title', 200)->nullable();              // Tiêu đề review
            $table->text('comment')->nullable();
            $table->boolean('is_verified_purchase')->default(false); // Đã mua mới review
            $table->timestamps();

            // One review per user per book
            $table->unique(['book_id', 'user_id']);

            // Indexes
            $table->index('rating');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
