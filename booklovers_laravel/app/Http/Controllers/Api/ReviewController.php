<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Traits\ImageHelper;

class ReviewController extends Controller
{
    use ImageHelper;
    public function index(Request $request)
    {
        $bookID = $request->get('bookID');
        $summary = $request->get('summary');

        if ($summary) {
            $query = Review::select(
                'bookID',
                DB::raw('COUNT(*) as review_count'),
                DB::raw('ROUND(AVG(rating), 2) as avg_rating')
            )
            ->with(['book:bookID,title,image']) // Eager load book title/image
            ->groupBy('bookID');

            if ($bookID) {
                $query->where('bookID', $bookID);
                // Add distribution logic for specific book summary
                 // For now, let's keep it simple or implement specific logic if needed
            } else {
                $query->orderBy('review_count', 'desc');
            }

            $reviews = $query->get()->map(function($item) use ($bookID) {
                 $data = [
                    'bookID' => $item->bookID,
                    'review_count' => $item->review_count,
                    'avg_rating' => $item->avg_rating,
                    'title' => $item->book->title ?? null,
                    'image' => $this->fixImagePath($item->book->image ?? null),
                 ];

                 if ($bookID) {
                     // Calculate distribution only if specific book is requested to save performance
                     $distribution = Review::where('bookID', $item->bookID)
                         ->select('rating', DB::raw('count(*) as count'))
                         ->groupBy('rating')
                         ->pluck('count', 'rating')->toArray();
                     
                     $data['c1'] = $distribution[1] ?? 0;
                     $data['c2'] = $distribution[2] ?? 0;
                     $data['c3'] = $distribution[3] ?? 0;
                     $data['c4'] = $distribution[4] ?? 0;
                     $data['c5'] = $distribution[5] ?? 0;
                 }

                 return $data;
            });
            return response()->json($reviews);
        }

        $query = Review::with(['user:userID,name', 'book:bookID,title,image'])->orderBy('created_at', 'desc');
        if ($bookID) {
            $query->where('bookID', $bookID);
        }

        $reviews = $query->get()->map(function($review) {
            return [
                'reviewID' => $review->reviewID,
                'bookID' => $review->bookID,
                'userID' => $review->userID,
                'userName' => $review->user->name ?? 'Unknown',
                'bookTitle' => $review->book->title ?? 'Unknown', // Added
                'bookImage' => $this->fixImagePath($review->book->image ?? null), // Added
                'rating' => $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at,
            ];
        });

        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $request->validate([
            'bookID' => 'required|exists:book,bookID',
            'userID' => 'required|exists:user,userID',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $review = Review::create($request->all());
        return response()->json(['message' => 'Review created', 'reviewID' => $review->reviewID]);
    }

    public function destroy($id)
    {
        Review::destroy($id);
        return response()->json(['message' => 'Review deleted']);
    }

}
