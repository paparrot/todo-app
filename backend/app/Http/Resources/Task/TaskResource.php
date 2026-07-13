<?php

declare(strict_types=1);

namespace App\Http\Resources\Task;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Attributes as OA;

/** @mixin Task */
#[
    OA\Schema(
        schema: 'Task',
        type: 'object',
        properties: [
            new OA\Property(property: 'id', type: 'integer', example: 1),
            new OA\Property(
                property: 'title',
                type: 'string',
                example: 'Buy milk',
            ),
            new OA\Property(
                property: 'description',
                type: 'string',
                nullable: true,
                example: 'From store',
            ),
            new OA\Property(
                property: 'due_date',
                type: 'string',
                format: 'date',
                nullable: true,
                example: '2026-07-15',
            ),
            new OA\Property(
                property: 'status',
                type: 'string',
                enum: ['pending', 'completed', 'in_progress'],
                example: 'pending',
            ),
            new OA\Property(property: 'user_id', type: 'integer', example: 1),
            new OA\Property(
                property: 'user_name',
                type: 'string',
                nullable: true,
                example: 'Jane Doe',
            ),
            new OA\Property(
                property: 'created_at',
                type: 'string',
                format: 'date-time',
                nullable: true,
                example: '2026-07-15T10:00:00Z',
            ),
            new OA\Property(
                property: 'updated_at',
                type: 'string',
                format: 'date-time',
                nullable: true,
                example: '2026-07-15T10:00:00Z',
            ),
        ],
    ),
]
final class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Task $task */
        $task = $this->resource;
        $task->loadMissing('user:id,name');

        /** @var User|null $user */
        $user = $task->user;

        return [
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'due_date' => $task->due_date?->toDateString(),
            'status' => $task->status->value,
            'user_id' => $task->user_id,
            'user_name' => $user?->name,
            'created_at' => $task->created_at?->toIso8601String(),
            'updated_at' => $task->updated_at?->toIso8601String(),
        ];
    }
}
