<?php

declare(strict_types=1);

use App\Models\User;

it('rejects duplicate emails during registration', function () {
    User::factory()->create(['email' => 'existing@example.com']);

    $this->postJson('/api/register', [
        'name' => 'Jane Doe',
        'email' => 'existing@example.com',
        'password' => 'password123',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

it('registers new users as owners by default', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'password' => 'password',
        'role' => 'admin',
    ]);

    $response
        ->assertSuccessful()
        ->assertJsonPath('user.role', 'owner');

    $this->assertDatabaseHas('users', [
        'email' => 'jane@example.com',
        'role' => 'owner',
    ]);
});
