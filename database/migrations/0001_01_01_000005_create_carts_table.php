<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')        // userID -> user_id
                  ->constrained('users')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();

            $table->timestamps();

            // One cart per user
            $table->unique('user_id');
        });

        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('cart_id')         // cartID -> cart_id
                  ->constrained('carts')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();

            $table->foreignId('book_id')         // bookID -> book_id
                  ->constrained('books')
                  ->restrictOnDelete()
                  ->cascadeOnUpdate();

            $table->unsignedInteger('quantity')->default(1);
            $table->timestamps();

            // Prevent duplicate book in the same cart
            $table->unique(['cart_id', 'book_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('carts');
    }
};
