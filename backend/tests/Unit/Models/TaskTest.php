<?php

declare(strict_types=1);

use App\Enum\Task\TaskStatus;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Carbon;

it('belongs to a user', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();

    expect($task->user)->toBeInstanceOf(User::class)
        ->and($task->user->is($user))->toBeTrue();
});

it('casts status to TaskStatus enum', function () {
    $task = Task::factory()->create(['status' => TaskStatus::IN_PROGRESS]);

    expect($task->status)->toBe(TaskStatus::IN_PROGRESS);
});

it('casts due_date to date', function () {
    $task = Task::factory()->create(['due_date' => '2026-07-10']);

    expect($task->due_date)->toBeInstanceOf(Carbon::class);
});
