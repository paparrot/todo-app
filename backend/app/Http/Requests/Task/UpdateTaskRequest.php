<?php

declare(strict_types=1);

namespace App\Http\Requests\Task;

use App\Enum\Task\TaskStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use OpenApi\Attributes as OA;

#[
    OA\Schema(
        schema: 'UpdateTaskRequest',
        type: 'object',
        required: ['title', 'status'],
        properties: [
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
                enum: ['pending', 'in_progress', 'completed'],
                example: 'pending',
            ),
        ],
    ),
]
final class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to this request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255', 'min:3'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'status' => ['required', Rule::enum(TaskStatus::class)],
        ];
    }
}
