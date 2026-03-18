<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     * Thứ tự: Users -> Categories -> Books -> Reviews
     */
    public function run(): void
    {
        // ── 1. Users ───────────────────────────────────
        User::create([
            'name'     => 'Admin',
            'email'    => 'admin@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
            'role'     => 'admin',
        ]);

        User::create([
            'name'     => 'Client One',
            'email'    => 'client1@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'address'  => 'Hanoi',
            'phone'    => '0987654321',
            'role'     => 'client',
        ]);

        User::create([
            'name'     => 'Client Two',
            'email'    => 'client2@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role'     => 'client',
        ]);

        // ── 2. Categories -> Books -> Reviews ──────────
        $this->call([
            CategorySeeder::class,
            BookSeeder::class,
            ReviewSeeder::class,
        ]);
    }
}
