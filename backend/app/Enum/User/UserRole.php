<?php

declare(strict_types=1);

namespace App\Enum\User;

enum UserRole: string
{
    case OWNER = 'owner';
    case ADMIN = 'admin';
}
