<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name'        => 'Văn Học',
                'slug'        => 'van-hoc',
                'description' => 'Tiểu thuyết, truyện, sách văn học',
                'icon'        => 'bi-book',
                'sort_order'  => 1,
            ],
            [
                'name'        => 'Phát triển bản thân',
                'slug'        => 'phat-trien-ban-than',
                'description' => 'Sách phát triển, động lực, hướng nghiệp',
                'icon'        => 'bi-rocket-takeoff',
                'sort_order'  => 2,
            ],
            [
                'name'        => 'Kiến thức & Kinh tế',
                'slug'        => 'kien-thuc-kinh-te',
                'description' => 'Sách kinh tế, marketing, kinh doanh',
                'icon'        => 'bi-graph-up-arrow',
                'sort_order'  => 3,
            ],
            [
                'name'        => 'Thiếu nhi',
                'slug'        => 'thieu-nhi',
                'description' => 'Sách cho trẻ em, truyện tranh',
                'icon'        => 'bi-stars',
                'sort_order'  => 4,
            ],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}
