<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'reviews';
    protected $primaryKey = 'reviewID';
    
    // Legacy schema usually expects 'created_at' but not 'updated_at' automatically managed unless defined
    // If your table has 'created_at' but no 'updated_at', we disable timestamps and handle created_at manually or strictly.
    // For now assuming standard behavior or existing columns.
    public $timestamps = false; 

    protected $fillable = [
        'bookID',
        'userID',
        'rating',
        'comment',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function book()
    {
        return $this->belongsTo(Book::class, 'bookID', 'bookID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userID', 'userID');
    }
}
