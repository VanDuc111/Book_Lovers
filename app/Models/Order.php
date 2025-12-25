<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';
    protected $primaryKey = 'orderID';
    public $timestamps = false;

    protected $fillable = [
        'userID',
        'order_date',
        'total_amount',
        'shipping_address',
        'order_status',
    ];

    protected $casts = [
        'order_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'userID', 'userID');
    }
    
    // In a full implementation, you might have OrderItems aka OrderDetail
}
