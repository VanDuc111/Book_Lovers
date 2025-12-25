<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';
    protected $primaryKey = 'categoryID';
    public $timestamps = false;

    protected $fillable = [
        'categoryName',
        'description',
    ];

    public function books()
    {
        return $this->hasMany(Book::class, 'categoryID', 'categoryID');
    }
}
