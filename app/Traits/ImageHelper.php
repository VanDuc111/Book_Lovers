<?php

namespace App\Traits;

trait ImageHelper
{
    public function fixImagePath($image)
    {
        if (empty($image)) return null;
        if (preg_match('#^https?://#i', $image)) return $image;
        if (strpos($image, '/') === 0) return $image;
        if (strpos($image, '/') !== false) return $image; // Relative path with slash
        return '/assets/images/' . $image;
    }
}
