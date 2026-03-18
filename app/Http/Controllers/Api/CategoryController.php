<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('books')->orderBy('sort_order')->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $category = Category::create($request->all());
        return response()->json(['message' => 'Created successfully', 'id' => $category->id]);
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if ($category) {
            $category->update($request->all());
            return response()->json(['message' => 'Updated successfully']);
        }
        return response()->json(['error' => 'Category not found'], 404);
    }

    public function destroy($id)
    {
        $category = Category::find($id);
        if ($category) {
            $category->delete();
            return response()->json(['message' => 'Deleted successfully']);
        }
        return response()->json(['error' => 'Category not found'], 404);
    }
}
