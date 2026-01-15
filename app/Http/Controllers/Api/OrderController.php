<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
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
        $userID = $request->userID;
        $query = Order::query()->with('user:userID,name,email');
        if ($userID) {
            $query->where('userID', $userID);
        }
        
        // Get all orders with complete information
        $orders = $query->orderBy('order_date', 'desc')->get();
        
        return response()->json($orders->map(function($order) {
            return [
                'orderID' => $order->orderID,
                'userID' => $order->userID,
                'order_date' => $order->order_date,
                'total_amount' => $order->total_amount,
                'shipping_address' => $order->shipping_address,
                'receiver_name' => $order->receiver_name,
                'receiver_phone' => $order->receiver_phone,
                'payment_method' => $order->payment_method,
                'note' => $order->note,
                'order_status' => $order->order_status,
                'user' => $order->user
            ];
        }));
    }
    
    // Checkout (Create Order)
    public function checkout(Request $request)
    {
        // Route is typically /api/checkout mapped here OR handled via standard store
        $userID = $request->userID;
        $cartItemIDs = $request->cartItemIDs ?? [];
        
        if (!$userID || empty($cartItemIDs)) {
             return response()->json(['error' => 'Invalid data'], 400);
        }

        $user = User::find($userID);
        if (!$user) return response()->json(['error' => 'User not found'], 404);

        // Calculate total and validate stock
        $items = CartItem::whereIn('cartItemID', $cartItemIDs)->with('book')->get();
        $total = 0;
        
        foreach($items as $item) {
             if ($item->quantity > $item->book->stock) {
                 return response()->json(['error' => "Sản phẩm '{$item->book->title}' vượt quá tồn kho (Còn lại: {$item->book->stock})"], 400);
             }
             $total += $item->quantity * $item->book->bookPrice;
        }

        DB::beginTransaction();
        try {
            $order = Order::create([
                'userID' => $userID,
                'order_date' => now(),
                'total_amount' => $total,
                'shipping_address' => $request->shipping_address ?? $user->address,
                'receiver_name' => $request->receiver_name ?? $user->name,
                'receiver_phone' => $request->receiver_phone ?? $user->phone,
                'payment_method' => $request->payment_method ?? 'cod',
                'note' => $request->note,
                'order_status' => 'Pending'
            ]);

            // Insert order items and deduct stock
            foreach ($items as $item) {
                DB::table('order_items')->insert([
                    'orderID' => $order->orderID,
                    'bookID' => $item->bookID,
                    'quantity' => $item->quantity,
                    'price' => $item->book->bookPrice
                ]);

                // Deduct stock
                DB::table('books')->where('bookID', $item->bookID)->decrement('stock', $item->quantity);
            }

            // Clear cart items
            CartItem::whereIn('cartItemID', $cartItemIDs)->delete();

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Đặt hàng thành công!', 'orderID' => $order->orderID]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'error' => 'Có lỗi xảy ra trong quá trình xử lý đơn hàng.'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if ($order) {
            $order->order_status = $request->order_status ?? $request->status; // accept both
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
    $userID = $request->userID;
    if (!$userID) return response()->json(['error' => 'Missing userID'], 400);

    // We need to join orders -> items -> books
    // Assuming models are set up: Order hasMany items, Item belongsTo Book
    // Or using DB facade for direct performance/simplicity matching legacy query
    
    $query = DB::table('orders')
        ->join('order_items', 'orders.orderID', '=', 'order_items.orderID')
        ->join('books', 'order_items.bookID', '=', 'books.bookID')
        ->where('orders.userID', $userID);
    
    // Filter by specific bookID if provided (for checking if user purchased a specific book)
    if ($request->has('bookID')) {
        $query->where('books.bookID', $request->bookID);
    }
    
    $books = $query
        ->select('books.bookID', 'books.title', 'books.author', 'books.bookPrice', 'books.image', 'orders.order_date', 'order_items.price as purchase_price')
        ->distinct()
        ->orderBy('orders.order_date', 'desc')
        ->get();

    $books->map(function ($book) {
        $book->image = $this->fixImagePath($book->image);
        return $book;
    });

    return response()->json($books);
}    
}
