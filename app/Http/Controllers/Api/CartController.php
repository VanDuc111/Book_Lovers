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
        
        $cartItem = CartItem::where('cartID', $cart->cartID)->where('bookID', $bookID)->first();
        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            CartItem::create([
                'cartID' => $cart->cartID,
                'bookID' => $bookID,
                'quantity' => $quantity
            ]);
        }

        return response()->json(['message' => 'Item added to cart']);
    }

    public function update(Request $request, $id)
    {
        $cartItem = CartItem::find($id);
        if ($cartItem) {
            $cartItem->quantity = $request->quantity;
            $cartItem->save();
            return response()->json(['message' => 'Cart updated']);
        }
        return response()->json(['error' => 'Item not found'], 404);
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
