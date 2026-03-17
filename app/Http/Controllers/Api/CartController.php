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
        $userID = $request->userID;
        if (!$userID) return response()->json(['error' => 'UserID required'], 400);

        $cart = Cart::where('userID', $userID)->first();
        if (!$cart) return response()->json([]);

        $items = CartItem::where('cartID', $cart->cartID)->with('book')->get()->map(function($item) {
             $item->book->image = $this->fixImagePath($item->book->image);
             return [
                 'cartItemID' => $item->cartItemID,
                 'bookID' => $item->bookID,
                 'title' => $item->book->title,
                 'bookPrice' => $item->book->bookPrice,
                 'image' => $item->book->image,
                 'quantity' => $item->quantity,
                 'stock' => $item->book->stock, // Thêm stock để FE kiểm tra
             ];
        });

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $userID = $request->userID;
        $bookID = $request->bookID;
        $quantity = $request->quantity ?? 1;

        if (!$userID || !$bookID) return response()->json(['error' => 'Missing data'], 400);

        $cart = Cart::firstOrCreate(['userID' => $userID], ['created_at' => now()]);
        
        $book = Book::find($bookID);
        if (!$book) return response()->json(['error' => 'Sách không tồn tại'], 404);

        $cartItem = CartItem::where('cartID', $cart->cartID)->where('bookID', $bookID)->first();
        $totalRequested = ($cartItem ? $cartItem->quantity : 0) + $quantity;

        if ($totalRequested > $book->stock) {
            return response()->json(['error' => "Số lượng vượt quá tồn kho (Còn lại: {$book->stock})"], 400);
        }

        if ($cartItem) {
            $cartItem->quantity = $totalRequested;
            $cartItem->save();
        } else {
            $cartItem = CartItem::create([
                'cartID' => $cart->cartID,
                'bookID' => $bookID,
                'quantity' => $quantity
            ]);
        }

        return response()->json([
            'message' => 'Đã thêm vào giỏ hàng',
            'cartItemID' => $cartItem->cartItemID
        ]);
    }

    public function update(Request $request, $id)
    {
        $cartItem = CartItem::where('cartItemID', $id)->with('book')->first();
        if ($cartItem) {
            $newQuantity = (int)$request->quantity;
            
            // Kiểm tra tồn kho
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
         return response()->json(['error' => 'cartItemID required'], 400);
    }

}
