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
        return response()->json($query->orderBy('order_date', 'desc')->get());
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

        // Calculate total
        $items = CartItem::whereIn('cartItemID', $cartItemIDs)->with('book')->get();
        $total = 0;
        foreach($items as $item) {
             $total += $item->quantity * $item->book->bookPrice;
        }

        DB::beginTransaction();
        try {
            $order = Order::create([
                'userID' => $userID,
                'order_date' => now(),
                'total_amount' => $total,
                'shipping_address' => $user->address ?? 'Default Address',
                'order_status' => 'Pending'
            ]);

            // Insert order items
            foreach ($items as $item) {
                DB::table('order_item')->insert([
                    'orderID' => $order->orderID,
                    'bookID' => $item->bookID,
                    'quantity' => $item->quantity,
                    'price' => $item->book->bookPrice
                ]);
            }

            // Clear cart items
            CartItem::whereIn('cartItemID', $cartItemIDs)->delete();

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Order placed successfully', 'orderID' => $order->orderID]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
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
        
        $books = DB::table('order')
            ->join('order_item', 'order.orderID', '=', 'order_item.orderID')
            ->join('book', 'order_item.bookID', '=', 'book.bookID')
            ->where('order.userID', $userID)
            ->select('book.bookID', 'book.title', 'book.author', 'book.bookPrice', 'book.image', 'order.order_date')
            ->distinct()
            ->orderBy('order.order_date', 'desc')
            ->get();

        $books->map(function ($book) {
            $book->image = $this->fixImagePath($book->image);
            return $book;
        });

        return response()->json($books);
    }
    
}
