<?php

declare(strict_types=1);

use App\Enum\Task\TaskStatus;
use App\Http\Resources\Task\TaskResource;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

it('transforms task to expected array shape', function () {
    $user = User::factory()->create();
    $task = Task::factory()
        ->for($user)
        ->create([
            'title' => 'Test task',
            'description' => 'Test description',
            'due_date' => '2026-07-10',
            'status' => TaskStatus::PENDING,
        ]);

    $payload = new TaskResource($task)->toArray(Request::create('/'));

    expect($payload)
        ->toMatchArray([
            'id' => $task->id,
            'title' => 'Test task',
            'description' => 'Test description',
            'user_id' => $user->id,
            'user_name' => $user->name,
        ])
        ->and($payload['status'])
        ->toBe(TaskStatus::PENDING->value);
});
