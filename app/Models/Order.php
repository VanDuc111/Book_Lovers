<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'order_code',
        'total_amount',
        'shipping_fee',
        'discount_amount',
        'receiver_name',
        'receiver_phone',
        'shipping_address',
        'note',
        'payment_method',
        'payment_status',
        'status',
        'confirmed_at',
        'shipped_at',
        'delivered_at',
        'cancelled_at',
        'cancel_reason',
    ];

    protected $casts = [
        'total_amount'    => 'decimal:2',
        'shipping_fee'    => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'confirmed_at'    => 'datetime',
        'shipped_at'      => 'datetime',
        'delivered_at'    => 'datetime',
        'cancelled_at'    => 'datetime',
    ];

    /**
     * Auto-generate order_code when creating.
     */
    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->order_code)) {
                $date = now()->format('Ymd');
                $count = self::whereDate('created_at', today())->count() + 1;
                $order->order_code = 'BL-' . $date . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    // ── Relationships ──────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
