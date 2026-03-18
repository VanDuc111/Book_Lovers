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
        $bookId = $request->get('book_id');
        $summary = $request->get('summary');

        if ($summary) {
            $query = Review::select(
                'book_id',
                DB::raw('COUNT(*) as review_count'),
                DB::raw('ROUND(AVG(rating), 2) as avg_rating')
            )
            ->with(['book:id,title,image'])
            ->groupBy('book_id');

            if ($bookId) {
                $query->where('book_id', $bookId);
            } else {
                $query->orderBy('review_count', 'desc');
            }

            $reviews = $query->get()->map(function($item) use ($bookId) {
                 $data = [
                    'book_id'      => $item->book_id,
                    'review_count' => $item->review_count,
                    'avg_rating'   => $item->avg_rating,
                    'title'        => $item->book->title ?? null,
                    'image'        => $this->fixImagePath($item->book->image ?? null),
                 ];

                 if ($bookId) {
                     $distribution = Review::where('book_id', $item->book_id)
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

        $query = Review::with(['user:id,name,avatar', 'book:id,title,image'])->orderBy('created_at', 'desc');
        if ($bookId) {
            $query->where('book_id', $bookId);
        }

        $reviews = $query->get()->map(function($review) {
            return [
                'id'                   => $review->id,
                'book_id'              => $review->book_id,
                'user_id'              => $review->user_id,
                'userName'             => $review->user->name ?? 'Unknown',
                'userAvatar'           => $review->user->avatar ?? null,
                'bookTitle'            => $review->book->title ?? 'Unknown',
                'bookImage'            => $this->fixImagePath($review->book->image ?? null),
                'rating'               => $review->rating,
                'title'                => $review->title,
                'comment'              => $review->comment,
                'is_verified_purchase' => $review->is_verified_purchase,
                'created_at'           => $review->created_at,
            ];
        });

        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'user_id' => 'required|exists:users,id',
            'rating'  => 'required|integer|min:1|max:5',
        ]);

        $review = Review::create($request->all());
        return response()->json(['success' => true, 'message' => 'Review created', 'id' => $review->id]);
    }

    public function destroy($id)
    {
        Review::destroy($id);
        return response()->json(['message' => 'Review deleted']);
    }

}
