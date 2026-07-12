<?php

declare(strict_types=1);

use App\DTO\Task\CreateTaskDTO;
use App\DTO\Task\UpdateTaskDTO;
use App\Enum\Task\TaskStatus;
use App\Models\Task;
use App\Models\User;
use App\Services\Task\TaskService;
use Carbon\CarbonImmutable;

it('returns paginated tasks for an owner', function () {
    $service = new TaskService();
    $user = User::factory()->create();

    Task::factory(3)->for($user)->create();

    $tasks = $service->getAllTasks($user, 15, 'due_date', 'desc');

    expect($tasks->total())->toBe(3)
        ->and($tasks->count())->toBe(3)
        ->and($tasks->currentPage())->toBe(1);
});

it('returns paginated tasks for an admin', function () {
    $service = new TaskService();
    $admin = User::factory()->admin()->create();
    $owner = User::factory()->create();

    Task::factory(3)->for($owner)->create();
    Task::factory()->for($admin)->create();

    $tasks = $service->getAllTasks($admin, 15, 'due_date', 'desc');

    expect($tasks->total())->toBe(4)
        ->and($tasks->count())->toBe(4)
        ->and($tasks->currentPage())->toBe(1);
});

it('filters tasks by status', function () {
    $service = new TaskService();
    $user = User::factory()->create();

    Task::factory()->for($user)->create(['status' => TaskStatus::PENDING]);
    Task::factory()->for($user)->create(['status' => TaskStatus::COMPLETED]);

    $tasks = $service->getAllTasks($user, 15, 'status', 'desc', null, TaskStatus::COMPLETED);

    expect($tasks->total())->toBe(1)
        ->and($tasks->first()->status)->toBe(TaskStatus::COMPLETED);
});

it('searches tasks by title', function () {
    $service = new TaskService();
    $user = User::factory()->create();

    Task::factory()->for($user)->create(['title' => 'Buy milk', 'due_date' => '2026-07-15']);
    Task::factory()->for($user)->create(['title' => 'Read a book', 'due_date' => '2026-07-12']);
    Task::factory()->for($user)->create(['title' => 'Milk the cow', 'due_date' => '2026-07-10']);

    $tasks = $service->getAllTasks($user, 15, 'due_date', 'desc', 'milk');

    expect($tasks->total())->toBe(2)
        ->and($tasks->getCollection()->pluck('title')->all())
        ->toBe(['Buy milk', 'Milk the cow']);
});

it('creates a task from dto', function () {
    $service = new TaskService();
    $user = User::factory()->create();

    $dto = new CreateTaskDTO(
        title: 'New task',
        description: 'Description',
        dueDate: null,
    );

    $task = $service->createTask($user, $dto);

    expect($task)
        ->toBeInstanceOf(Task::class)
        ->and($task->title)
        ->toBe('New task')
        ->and($task->status)
        ->toBe(TaskStatus::PENDING)
        ->and($task->due_date)
        ->toBeNull();
});

it('updates a task', function () {
    $service = new TaskService();
    $user = User::factory()->create();
    $task = Task::factory()
        ->for($user)
        ->create(['title' => 'Old title', 'status' => TaskStatus::PENDING]);

    $dto = new UpdateTaskDTO(
        id: $task->id,
        title: 'Updated title',
        description: $task->description,
        dueDate: CarbonImmutable::parse($task->due_date ?? '2026-01-01'),
        status: TaskStatus::COMPLETED,
    );

    $updated = $service->updateTask($task, $dto);

    expect($updated)
        ->toBeInstanceOf(Task::class)
        ->and($updated->title)
        ->toBe('Updated title')
        ->and($updated->status)
        ->toBe(TaskStatus::COMPLETED);
});

it('deletes a task', function () {
    $service = new TaskService();
    $task = Task::factory()->create();

    $service->deleteTask($task);

    expect(Task::find($task->id))->toBeNull();
});
