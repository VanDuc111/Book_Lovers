<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Book;
use Illuminate\Http\Request;

use App\Traits\ImageHelper;

class CartController extends Controller
{
    use ImageHelper;

    public function index(Request $request)
    {
        $userId = $request->user_id;
        if (!$userId) return response()->json(['error' => 'user_id required'], 400);

        $cart = Cart::where('user_id', $userId)->first();
        if (!$cart) return response()->json([]);

        $items = CartItem::where('cart_id', $cart->id)->with('book')->get()->map(function($item) {
             $item->book->image = $this->fixImagePath($item->book->image);
             return [
                 'id'       => $item->id,
                 'book_id'  => $item->book_id,
                 'title'    => $item->book->title,
                 'price'    => $item->book->price,
                 'image'    => $item->book->image,
                 'quantity' => $item->quantity,
                 'stock'    => $item->book->stock,
             ];
        });

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $userId = $request->user_id;
        $bookId = $request->book_id;
        $quantity = $request->quantity ?? 1;

        if (!$userId || !$bookId) return response()->json(['error' => 'Missing data'], 400);

        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        
        $book = Book::find($bookId);
        if (!$book) return response()->json(['error' => 'Sách không tồn tại'], 404);

        $cartItem = CartItem::where('cart_id', $cart->id)->where('book_id', $bookId)->first();
        $totalRequested = ($cartItem ? $cartItem->quantity : 0) + $quantity;

        if ($totalRequested > $book->stock) {
            return response()->json(['error' => "Số lượng vượt quá tồn kho (Còn lại: {$book->stock})"], 400);
        }

        if ($cartItem) {
            $cartItem->quantity = $totalRequested;
            $cartItem->save();
        } else {
            $cartItem = CartItem::create([
                'cart_id'  => $cart->id,
                'book_id'  => $bookId,
                'quantity' => $quantity
            ]);
        }

        return response()->json([
            'message' => 'Đã thêm vào giỏ hàng',
            'id'      => $cartItem->id
        ]);
    }

    public function update(Request $request, $id)
    {
        $cartItem = CartItem::with('book')->find($id);
        if ($cartItem) {
            $newQuantity = (int)$request->quantity;
            
            if ($newQuantity > $cartItem->book->stock) {
                return response()->json([
                    'error' => "Số lượng vượt quá tồn kho (Còn lại: {$cartItem->book->stock})",
                    'stock' => $cartItem->book->stock
                ], 400);
            }

            $cartItem->quantity = $newQuantity;
            $cartItem->save();
            return response()->json(['message' => 'Cập nhật giỏ hàng thành công']);
        }
        return response()->json(['error' => 'Không tìm thấy sản phẩm trong giỏ'], 404);
    }

    public function destroy($id) 
    {
         if ($id) {
             CartItem::destroy($id);
             return response()->json(['message' => 'Item deleted']);
         }
         return response()->json(['error' => 'ID required'], 400);
    }

}
