<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;

use App\Traits\ImageHelper;

class BookController extends Controller
{
    use ImageHelper;
    public function index(Request $request)
    {
        $query = Book::with('category');

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('author', 'LIKE', "%{$searchTerm}%");
            });
        }

        if ($request->has('category')) {
            $category = $request->category;
            if (is_numeric($category)) {
                $query->where('categoryID', $category);
            } else {
                $query->whereHas('category', function($q) use ($category) {
                    $q->where('categoryName', $category);
                });
            }
        }

        $books = $query->get()->map(function ($book) {
            $book->image = $this->fixImagePath($book->image);
            $book->categoryName = $book->category ? $book->category->categoryName : null;
            return $book;
        });

        return response()->json($books);
    }

    public function show($id)
    {
        $book = Book::with('category')->find($id);
        if ($book) {
            $book->image = $this->fixImagePath($book->image);
            $book->categoryName = $book->category ? $book->category->categoryName : null;
            return response()->json($book);
        }
        return response()->json(['error' => 'Book not found'], 404);
    }

    public function store(Request $request) 
    {
       // Implementation for create book
       // For brevity, assuming standard Model::create but would need category lookup logic like in legacy code
       // if we receive categoryName instead of ID.
       $data = $request->all();
       
       if ($request->hasFile('image')) {
           $file = $request->file('image');
           $filename = time() . '_' . $file->getClientOriginalName();
           $file->move(public_path('assets/images'), $filename);
           $data['image'] = $filename;
       }

       if (isset($data['categoryName']) && !isset($data['categoryID'])) {
           $cat = \App\Models\Category::where('categoryName', $data['categoryName'])->first();
           if ($cat) $data['categoryID'] = $cat->categoryID;
       }
       
       $book = Book::create($data);
       return response()->json(['message' => 'Book created', 'bookID' => $book->bookID]);
    }

    public function update(Request $request, $id)
    {
        $book = Book::find($id);
        if (!$book) return response()->json(['error' => 'Not found'], 404);

        $data = $request->all();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('assets/images'), $filename);
            $data['image'] = $filename;
        }

         if (isset($data['categoryName'])) {
           $cat = \App\Models\Category::where('categoryName', $data['categoryName'])->first();
           if ($cat) $data['categoryID'] = $cat->categoryID;
       }

        $book->update($data);
        return response()->json(['message' => 'Book updated']);
    }

    public function destroy($id)
    {
        Book::destroy($id);
        return response()->json(['message' => 'Book deleted']);
    }

}
