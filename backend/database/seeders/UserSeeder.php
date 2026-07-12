<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

final class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (config('seeders.users') as $userConfig) {
            User::updateOrCreate(
                ['email' => $userConfig['email']],
                [
                    'name' => $userConfig['name'],
                    'password' => $userConfig['password'],
                    'role' => $userConfig['role'],
                ]
            );
        }
    }
}
