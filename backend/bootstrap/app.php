<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions
            ->report(function (Throwable $e): void {
                Log::error($e->getMessage() ?: $e::class, [
                    'exception' => $e::class,
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString(),
                ]);
            })
            ->stop();

        $exceptions->shouldRenderJsonWhen(function (Request $request): bool {
            return $request->is('api/*') || $request->expectsJson();
        });

        $exceptions->respond(function (Response $response): Response {
            if (! request()->is('api/*')) {
                return $response;
            }

            if ($response->getStatusCode() === Response::HTTP_FORBIDDEN) {
                return response()->json(
                    data: [
                        'code' => Response::HTTP_FORBIDDEN,
                        'message' => 'Forbidden',
                    ],
                    status: Response::HTTP_FORBIDDEN,
                );
            }

            if ($response->getStatusCode() === Response::HTTP_INTERNAL_SERVER_ERROR) {
                return response()->json(
                    data: [
                        'message' => 'Something went wrong',
                    ],
                    status: Response::HTTP_INTERNAL_SERVER_ERROR,
                );
            }

            return $response;
        });
    })
    ->create();
