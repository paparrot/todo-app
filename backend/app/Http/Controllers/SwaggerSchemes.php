<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[
    OA\Info(
        title: 'Todo API',
        version: '1.0.0',
        description: 'API for managing tasks',
    ),
]
#[OA\Server(url: '/api')]
#[
    OA\SecurityScheme(
        securityScheme: 'sanctum',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter token in format (Bearer <token>)',
    ),
]
#[
    OA\Schema(
        schema: 'ErrorResponse',
        type: 'object',
        properties: [
            new OA\Property(
                property: 'message',
                type: 'string',
                example: 'User not found',
            ),
        ],
    ),
]
#[
    OA\Schema(
        schema: 'ValidationErrorResponse',
        type: 'object',
        properties: [
            new OA\Property(
                property: 'message',
                type: 'string',
                example: 'The given data was invalid.',
            ),
            new OA\Property(
                property: 'errors',
                type: 'object',
                description: 'Validation errors keyed by field name',
            ),
        ],
    ),
]
#[
    OA\Schema(
        schema: 'MessageResponse',
        type: 'object',
        properties: [
            new OA\Property(
                property: 'message',
                type: 'string',
                example: 'Logged out',
            ),
        ],
    ),
]
#[
    OA\Schema(
        schema: 'PaginatedTaskResponse',
        type: 'object',
        properties: [
            new OA\Property(
                property: 'data',
                type: 'array',
                items: new OA\Items(ref: '#/components/schemas/Task'),
            ),
            new OA\Property(
                property: 'links',
                type: 'object',
                properties: [
                    new OA\Property(
                        property: 'first',
                        type: 'string',
                        nullable: true,
                    ),
                    new OA\Property(
                        property: 'last',
                        type: 'string',
                        nullable: true,
                    ),
                    new OA\Property(
                        property: 'prev',
                        type: 'string',
                        nullable: true,
                    ),
                    new OA\Property(
                        property: 'next',
                        type: 'string',
                        nullable: true,
                    ),
                ],
            ),
            new OA\Property(
                property: 'meta',
                type: 'object',
                properties: [
                    new OA\Property(property: 'current_page', type: 'integer'),
                    new OA\Property(
                        property: 'from',
                        type: 'integer',
                        nullable: true,
                    ),
                    new OA\Property(property: 'last_page', type: 'integer'),
                    new OA\Property(property: 'path', type: 'string'),
                    new OA\Property(property: 'per_page', type: 'integer'),
                    new OA\Property(
                        property: 'to',
                        type: 'integer',
                        nullable: true,
                    ),
                    new OA\Property(property: 'total', type: 'integer'),
                ],
            ),
        ],
    ),
]
final class SwaggerSchemes {}
