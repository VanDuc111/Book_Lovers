<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $table = 'book';
    protected $primaryKey = 'bookID';
    public $timestamps = false; // Assuming no created_at/updated_at in legacy table

    protected $fillable = [
        'title',
        'author',
        'publisher',
        'categoryID',
        'bookPrice',
        'stock',
        'description',
        'image',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'categoryID', 'categoryID');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'bookID', 'bookID');
    }
}
