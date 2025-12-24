<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserController;

class LegacyApiController extends Controller
{
    public function handle(Request $request)
    {
        $endpoint = $request->query('endpoint');
        $method = $request->method();

        switch ($endpoint) {
            case 'books':
                $controller = new BookController();
                if ($method === 'GET') {
                    if ($request->has('id')) return $controller->show($request->id);
                    return $controller->index($request);
                }
                if ($method === 'POST') return $controller->store($request);
                if ($method === 'PUT') return $controller->update($request, $request->bookID);
                if ($method === 'DELETE') return $controller->destroy($request->id);
                break;

            case 'categories':
                $controller = new CategoryController();
                if ($method === 'GET') return $controller->index();
                if ($method === 'POST') return $controller->store($request);
                if ($method === 'PUT') return $controller->update($request, $request->categoryID);
                if ($method === 'DELETE') return $controller->destroy($request->id);
                break;
            
            case 'users':
                $controller = new UserController();
                if ($method === 'GET' && $request->has('userID')) return $controller->show($request);
                if ($method === 'GET') return $controller->index();
                if ($method === 'POST') return $controller->store($request);
                if ($method === 'PUT') return $controller->update($request);
                if ($method === 'DELETE') return $controller->destroy($request->id);
                break;

            case 'review':
                $controller = new ReviewController();
                if ($method === 'GET') return $controller->index($request);
                if ($method === 'POST') return $controller->store($request);
                if ($method === 'DELETE') return $controller->destroy($request->id);
                break;

            case 'cart':
                $controller = new CartController();
                if ($method === 'GET') return $controller->index($request);
                if ($method === 'POST') return $controller->store($request);
                if ($method === 'DELETE') return $controller->destroy($request);
                break;

            case 'order':
                 $controller = new OrderController();
                 if ($method === 'GET') return $controller->index($request);
                 if ($method === 'PUT') return $controller->update($request);
                 if ($method === 'DELETE') return $controller->destroy($request);
                 break;

            case 'checkout':
                 $controller = new OrderController();
                 if ($method === 'POST') return $controller->checkout($request);
                 break;
                 
            default:
                return response()->json(['error' => 'Invalid endpoint'], 404);
        }
    }
}
