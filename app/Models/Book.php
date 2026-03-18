<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Book extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'author',
        'publisher',
        'price',
        'original_price',
        'description',
        'short_description',
        'stock',
        'sold_count',
        'image',
        'pages',
        'language',
        'isbn',
        'publish_year',
        'category_id',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'price'          => 'decimal:2',
        'original_price' => 'decimal:2',
        'is_featured'    => 'boolean',
        'is_active'      => 'boolean',
    ];

    /**
     * Auto-generate slug from title when creating.
     */
    protected static function booted(): void
    {
        static::creating(function (Book $book) {
            if (empty($book->slug)) {
                $book->slug = Str::slug($book->title);
            }
        });
    }

    // ── Accessors ──────────────────────────────────

    /**
     * Tính % giảm giá nếu có original_price.
     */
    public function getDiscountPercentAttribute(): ?int
    {
        if ($this->original_price && $this->original_price > $this->price) {
            return (int) round((1 - $this->price / $this->original_price) * 100);
        }
        return null;
    }

    // ── Relationships ──────────────────────────────

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
