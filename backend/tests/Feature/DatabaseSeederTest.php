<?php

declare(strict_types=1);

use App\Enum\Task\TaskStatus;
use App\Enum\User\UserRole;
use App\Models\Task;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Artisan;

it('seeds the default users and owner tasks', function (): void {
    Artisan::call('db:seed', [
        '--class' => DatabaseSeeder::class,
    ]);

    $owner = User::query()->where('email', config('seeders.users.owner.email'))->first();
    $admin = User::query()->where('email', config('seeders.users.admin.email'))->first();

    expect($owner)->not->toBeNull()
        ->and($owner?->role)->toBe(UserRole::OWNER)
        ->and($admin)->not->toBeNull()
        ->and($admin?->role)->toBe(UserRole::ADMIN)
        ->and(User::query()->count())->toBe(3)
        ->and(Task::query()->where('user_id', $owner?->id)->count())->toBe(3)
        ->and(Task::query()->where('user_id', $owner?->id)->where('status', TaskStatus::PENDING->value)->count())->toBe(3);
});
