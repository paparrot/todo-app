<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

it('logs exception details and returns a generic api response', function (): void {
    Log::spy();

    Route::get('/api/exception-handling-test', function (): void {
        throw new RuntimeException('Boom');
    });

    $response = $this->getJson('/api/exception-handling-test');

    $response->assertStatus(500)
        ->assertExactJson([
            'message' => 'Something went wrong',
        ]);

    Log::shouldHaveReceived('error')
        ->once()
        ->withArgs(function (string $message, array $context): bool {
            return $message === 'Boom'
                && $context['exception'] === RuntimeException::class
                && is_string($context['file'])
                && basename($context['file']) === 'ExceptionHandlingTest.php'
                && is_int($context['line'])
                && is_string($context['trace'])
                && $context['trace'] !== '';
        });
});
