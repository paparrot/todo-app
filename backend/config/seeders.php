<?php

declare(strict_types=1);

use App\Enum\User\UserRole;

return [
    'users' => [
        'owner' => [
            'name' => env('SEED_OWNER_NAME', 'Owner'),
            'email' => env('SEED_OWNER_EMAIL', 'owner@example.com'),
            'password' => env('SEED_OWNER_PASSWORD', 'owner123'),
            'role' => UserRole::OWNER->value,
        ],
        'admin' => [
            'name' => env('SEED_ADMIN_NAME', 'Admin'),
            'email' => env('SEED_ADMIN_EMAIL', 'admin@example.com'),
            'password' => env('SEED_ADMIN_PASSWORD', 'admin123'),
            'role' => UserRole::ADMIN->value,
        ],
    ],
    'tasks' => [
        'owner' => [
            'count' => (int) env('SEED_OWNER_TASK_COUNT', 3),
        ],
    ],
];
