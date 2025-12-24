<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $table = 'cart_item';
    protected $primaryKey = 'cartItemID';
    public $timestamps = false;

    protected $fillable = [
        'cartID',
        'bookID',
        'quantity',
    ];

    public function cart()
    {
        return $this->belongsTo(Cart::class, 'cartID', 'cartID');
    }

    public function book()
    {
        return $this->belongsTo(Book::class, 'bookID', 'bookID');
    }
}
