<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $reviews = [
            [
                'book_id'              => 3,  // Bố Già
                'user_id'              => 1,  // Admin
                'rating'               => 3,
                'comment'              => 'Hay tuyệt cú mèo',
                'is_verified_purchase' => true,
            ],
            [
                'book_id'              => 6,  // Doraemon
                'user_id'              => 1,
                'rating'               => 4,
                'comment'              => 'okokok',
                'is_verified_purchase' => true,
            ],
            [
                'book_id'              => 10, // Nhà Giả Kim
                'user_id'              => 2,  // Client One
                'rating'               => 5,
                'title'                => 'Đáng đọc!',
                'comment'              => 'Cuốn sách rất hay, ai cũng nên đọc ít nhất một lần trong đời.',
                'is_verified_purchase' => true,
            ],
            [
                'book_id'              => 7,  // Harry Potter
                'user_id'              => 2,
                'rating'               => 5,
                'title'                => 'Huyền thoại tuổi thơ',
                'comment'              => 'Thế giới phép thuật quá cuốn hút!',
                'is_verified_purchase' => false,
            ],
            [
                'book_id'              => 14, // Tôi Thấy Hoa Vàng
                'user_id'              => 3,  // Client Two
                'rating'               => 4,
                'comment'              => 'Tuổi thơ hiện ra thật đẹp qua từng trang sách.',
                'is_verified_purchase' => false,
            ],
        ];

        foreach ($reviews as $review) {
            Review::create($review);
        }
    }
}
