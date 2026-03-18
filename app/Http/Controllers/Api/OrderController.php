<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Traits\ImageHelper;

class OrderController extends Controller
{
    use ImageHelper;

    // List orders (admin or user)
    public function index(Request $request)
    {
        $userId = $request->user_id;
        $query = Order::query()->with('user:id,name,email');
        if ($userId) {
            $query->where('user_id', $userId);
        }
        
        $orders = $query->orderBy('created_at', 'desc')->get();
        
        return response()->json($orders->map(function($order) {
            return [
                'id'               => $order->id,
                'order_code'       => $order->order_code,
                'user_id'          => $order->user_id,
                'created_at'       => $order->created_at,
                'total_amount'     => $order->total_amount,
                'shipping_fee'     => $order->shipping_fee,
                'discount_amount'  => $order->discount_amount,
                'shipping_address' => $order->shipping_address,
                'receiver_name'    => $order->receiver_name,
                'receiver_phone'   => $order->receiver_phone,
                'payment_method'   => $order->payment_method,
                'payment_status'   => $order->payment_status,
                'note'             => $order->note,
                'status'           => $order->status,
                'user'             => $order->user,
            ];
        }));
    }
    
    // Checkout (Create Order)
    public function checkout(Request $request)
    {
        $userId = $request->user_id;
        $cartItemIds = $request->cart_item_ids ?? [];
        
        if (!$userId || empty($cartItemIds)) {
             return response()->json(['error' => 'Invalid data'], 400);
        }

        $user = User::find($userId);
        if (!$user) return response()->json(['error' => 'User not found'], 404);

        // Calculate total and validate stock
        $items = CartItem::whereIn('id', $cartItemIds)->with('book')->get();
        $total = 0;
        
        foreach($items as $item) {
             if ($item->quantity > $item->book->stock) {
                 return response()->json(['error' => "Sản phẩm '{$item->book->title}' vượt quá tồn kho (Còn lại: {$item->book->stock})"], 400);
             }
             $total += $item->quantity * $item->book->price;
        }

        DB::beginTransaction();
        try {
            $order = Order::create([
                'user_id'          => $userId,
                'total_amount'     => $total,
                'shipping_fee'     => $request->shipping_fee ?? 0,
                'discount_amount'  => $request->discount_amount ?? 0,
                'shipping_address' => $request->shipping_address ?? $user->address,
                'receiver_name'    => $request->receiver_name ?? $user->name,
                'receiver_phone'   => $request->receiver_phone ?? $user->phone,
                'payment_method'   => $request->payment_method ?? 'cod',
                'note'             => $request->note,
                'status'           => 'pending',
            ]);

            // Insert order items and deduct stock
            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'book_id'  => $item->book_id,
                    'quantity' => $item->quantity,
                    'price'    => $item->book->price,
                ]);

                // Deduct stock & increment sold_count
                $item->book->decrement('stock', $item->quantity);
                $item->book->increment('sold_count', $item->quantity);
            }

            // Clear cart items
            CartItem::whereIn('id', $cartItemIds)->delete();

            DB::commit();
            return response()->json([
                'success'    => true,
                'message'    => 'Đặt hàng thành công!',
                'id'         => $order->id,
                'order_code' => $order->order_code,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'error' => 'Có lỗi xảy ra trong quá trình xử lý đơn hàng.'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if ($order) {
            $newStatus = $request->status;
            $order->status = $newStatus;

            // Auto-set timestamp for status changes
            match ($newStatus) {
                'confirmed'  => $order->confirmed_at = now(),
                'shipped'    => $order->shipped_at = now(),
                'delivered'  => $order->delivered_at = now(),
                'cancelled'  => $order->fill([
                    'cancelled_at' => now(),
                    'cancel_reason' => $request->cancel_reason,
                ]),
                default      => null,
            };

            $order->save();
            return response()->json(['message' => 'Status updated']);
        }
        return response()->json(['error' => 'Order not found'], 404);
    }

    public function destroy($id) {
         if ($id) {
             Order::destroy($id);
             return response()->json(['message' => 'Order deleted']);
         }
         return response()->json(['error' => 'ID required'], 400);
    }

    public function purchasedBooks(Request $request)
    {
        $userId = $request->user_id;
        if (!$userId) return response()->json(['error' => 'Missing user_id'], 400);

        $query = DB::table('orders')
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->join('books', 'order_items.book_id', '=', 'books.id')
            ->where('orders.user_id', $userId);
        
        if ($request->has('book_id')) {
            $query->where('books.id', $request->book_id);
        }
        
        $books = $query
            ->select(
                'books.id',
                'books.title',
                'books.author',
                'books.price',
                'books.image',
                'orders.created_at as order_date',
                'order_items.price as purchase_price'
            )
            ->distinct()
            ->orderBy('orders.created_at', 'desc')
            ->get();

        $books->map(function ($book) {
            $book->image = $this->fixImagePath($book->image);
            return $book;
        });

        return response()->json($books);
    }    
}
