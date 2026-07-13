<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Mockery\MockInterface;
use Mockery\VerificationDirector;
use Tests\TestCase;

it('logs exception details and returns a generic api response', function (): void {
    /** @var MockInterface $log */
    $log = Log::spy();

    Route::get('/api/exception-handling-test', function (): void {
        throw new RuntimeException('Boom');
    });

    /** @var TestCase $this */
    $response = $this->getJson('/api/exception-handling-test');

    $response->assertStatus(500)
        ->assertExactJson([
            'message' => 'Something went wrong',
        ]);

    /** @var VerificationDirector $errorLog */
    $errorLog = $log->shouldHaveReceived('error');

    $errorLog->once()->withArgs(function (string $message, array $context): bool {
        return $message === 'Boom'
            && $context['exception'] === RuntimeException::class
            && is_string($context['file'])
            && basename($context['file']) === 'ExceptionHandlingTest.php'
            && is_int($context['line'])
            && is_string($context['trace'])
            && $context['trace'] !== '';
    });
});
