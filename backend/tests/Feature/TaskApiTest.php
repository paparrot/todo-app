<?php

declare(strict_types=1);

use App\Enum\Task\TaskStatus;
use App\Models\Task;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('lists paginated tasks for the authenticated owner', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    Task::factory(16)->for($user)->create();
    Task::factory()->for(User::factory())->create();

    $this->getJson('/api/tasks')
        ->assertSuccessful()
        ->assertJsonCount(15, 'data')
        ->assertJsonPath('meta.current_page', 1)
        ->assertJsonPath('meta.per_page', 15)
        ->assertJsonPath('meta.total', 16)
        ->assertJsonPath('meta.last_page', 2);
});

it('lists paginated tasks for an admin', function () {
    $admin = User::factory()->admin()->create();
    $owner = User::factory()->create();
    Sanctum::actingAs($admin);

    Task::factory(16)->for($owner)->create();
    Task::factory(4)->for($admin)->create();

    $this->getJson('/api/tasks?per_page=10')
        ->assertSuccessful()
        ->assertJsonCount(10, 'data')
        ->assertJsonPath('meta.current_page', 1)
        ->assertJsonPath('meta.per_page', 10)
        ->assertJsonPath('meta.total', 20)
        ->assertJsonPath('meta.last_page', 2);
});

it('sorts tasks by title in ascending order', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    Task::factory()->for($user)->create(['title' => 'Zeta']);
    Task::factory()->for($user)->create(['title' => 'Alpha']);
    Task::factory()->for($user)->create(['title' => 'Beta']);

    $this->getJson('/api/tasks?sort=title&direction=asc&per_page=10')
        ->assertSuccessful()
        ->assertJsonPath('data.0.title', 'Alpha')
        ->assertJsonPath('data.1.title', 'Beta')
        ->assertJsonPath('data.2.title', 'Zeta');
});

it('filters tasks by status', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    Task::factory()->for($user)->create(['status' => TaskStatus::PENDING]);
    Task::factory()->for($user)->create(['status' => TaskStatus::COMPLETED]);
    Task::factory()->for($user)->create(['status' => TaskStatus::COMPLETED]);

    $this->getJson('/api/tasks?status=completed&per_page=10')
        ->assertSuccessful()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.status', 'completed')
        ->assertJsonPath('data.1.status', 'completed');
});

it('searches tasks by title', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    Task::factory()->for($user)->create(['title' => 'Buy milk']);
    Task::factory()->for($user)->create(['title' => 'Read a book']);
    Task::factory()->for($user)->create(['title' => 'Milk the cow']);

    $this->getJson('/api/tasks?search=milk&per_page=10&sort=title&direction=asc')
        ->assertSuccessful()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.title', 'Buy milk')
        ->assertJsonPath('data.1.title', 'Milk the cow');
});

it('shows a task owned by the authenticated user', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);
    $task = Task::factory()->for($user)->create();

    $this->getJson("/api/tasks/{$task->id}")
        ->assertSuccessful()
        ->assertJsonPath('data.id', $task->id);
});

it('forbids viewing another user task with a json 403 response', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Sanctum::actingAs($user);
    $task = Task::factory()->for($otherUser)->create();

    $this->getJson("/api/tasks/{$task->id}")
        ->assertForbidden()
        ->assertExactJson([
            'code' => 403,
            'message' => 'Forbidden',
        ]);
});

it('allows an admin to view any task', function () {
    $admin = User::factory()->admin()->create();
    $owner = User::factory()->create();
    Sanctum::actingAs($admin);
    $task = Task::factory()->for($owner)->create();

    $this->getJson("/api/tasks/{$task->id}")
        ->assertSuccessful()
        ->assertJsonPath('data.id', $task->id);
});

it('creates a task with valid payload for an owner', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $payload = [
        'title' => 'Buy milk',
        'description' => 'From store',
        'due_date' => '2026-07-15',
        'status' => TaskStatus::PENDING->value,
    ];

    $this->postJson('/api/tasks', $payload)
        ->assertSuccessful()
        ->assertJsonPath('data.title', 'Buy milk');

    $this->assertDatabaseHas('tasks', [
        'title' => 'Buy milk',
        'user_id' => $user->id,
    ]);
});

it('forbids admins from creating tasks', function () {
    $admin = User::factory()->admin()->create();
    Sanctum::actingAs($admin);

    $this->postJson('/api/tasks', [
        'title' => 'Forbidden task',
        'description' => 'Admins cannot create',
        'due_date' => '2026-07-15',
        'status' => TaskStatus::PENDING->value,
    ])->assertForbidden();
});

it('forbids updating another user task', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Sanctum::actingAs($user);
    $task = Task::factory()->for($otherUser)->create();

    $this->putJson("/api/tasks/{$task->id}", [
        'title' => 'Updated title',
        'description' => 'Updated description',
        'due_date' => '2026-07-16',
        'status' => TaskStatus::COMPLETED->value,
    ])->assertForbidden();
});

it('forbids deleting another user task', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Sanctum::actingAs($user);
    $task = Task::factory()->for($otherUser)->create();

    $this->deleteJson("/api/tasks/{$task->id}")
        ->assertForbidden();
});

it('validates required fields on create', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $this->postJson('/api/tasks', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'due_date', 'status']);
});

it('validates list filters', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $this->getJson('/api/tasks?status=invalid&search=' . str_repeat('a', 256))
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['status', 'search']);
});


it('rejects unauthenticated requests', function () {
    $this->getJson('/api/tasks')->assertUnauthorized();
});

it('serves the swagger documentation page', function () {
    $this->get('/api/documentation')->assertOk();
});

it('describes task list filters in the swagger spec', function () {
    $spec = json_decode(
        file_get_contents(storage_path('api-docs/api-docs.json')),
        true,
        512,
        JSON_THROW_ON_ERROR,
    );

    $parameters = collect($spec['paths']['/tasks']['get']['parameters'])
        ->pluck('name')
        ->all();

    expect($spec['components']['securitySchemes']['sanctum']['type'])
        ->toBe('http')
        ->and($spec['components']['securitySchemes']['sanctum']['scheme'])
        ->toBe('bearer')
        ->and($spec['paths']['/tasks']['get']['security'][0]['sanctum'])
        ->toBeArray()
        ->and($parameters)
        ->toEqual(['page', 'per_page', 'sort', 'direction', 'search', 'status'])
        ->and(array_keys($spec['paths']['/tasks']['get']['responses']['200']['content']['application/json']['schema']['properties']))
        ->toEqual(['data', 'links', 'meta']);
});
