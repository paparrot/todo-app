<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(title: 'Todo API', version: '1.0.0', description: 'API for managing tasks')]
#[OA\Server(url: '/api')]
#[OA\SecurityScheme(securityScheme: 'sanctum', type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Enter token in format (Bearer <token>)')]
#[OA\Schema(
    schema: 'Task',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'title', type: 'string', example: 'Buy milk'),
        new OA\Property(property: 'description', type: 'string', nullable: true, example: 'From store'),
        new OA\Property(property: 'due_date', type: 'string', format: 'date', nullable: true, example: '2026-07-15'),
        new OA\Property(property: 'status', type: 'string', enum: ['pending', 'completed', 'in_progress'], example: 'pending'),
        new OA\Property(property: 'user_id', type: 'integer', example: 1),
    ]
)]
#[OA\Schema(
    schema: 'CreateTaskRequest',
    type: 'object',
    required: ['title'],
    properties: [
        new OA\Property(property: 'title', type: 'string', example: 'Buy milk'),
        new OA\Property(property: 'description', type: 'string', nullable: true, example: 'From store'),
        new OA\Property(property: 'due_date', type: 'string', format: 'date', nullable: true, example: '2026-07-15'),
        new OA\Property(property: 'status', type: 'string', enum: ['pending'], example: 'pending'),
    ]
)]
#[OA\Schema(
    schema: 'UpdateTaskRequest',
    type: 'object',
    required: ['title', 'status'],
    properties: [
        new OA\Property(property: 'title', type: 'string', example: 'Buy milk'),
        new OA\Property(property: 'description', type: 'string', nullable: true, example: 'From store'),
        new OA\Property(property: 'due_date', type: 'string', format: 'date', nullable: true, example: '2026-07-15'),
        new OA\Property(property: 'status', type: 'string', enum: ['pending', 'in_progress', 'completed'], example: 'pending'),
    ]
)]
final class SwaggerSchemes {}
