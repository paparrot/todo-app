<?php

declare(strict_types=1);

namespace App\Enum\Task;

enum TaskStatus: string
{
    case PENDING = 'pending';
    case COMPLETED = 'completed';
    case IN_PROGRESS = 'in_progress';
}
