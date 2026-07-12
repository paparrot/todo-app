<?php

declare(strict_types=1);

namespace App\Http\Requests\Task;

use App\Enum\Task\TaskStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class ListTaskRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'per_page' => $this->input('per_page', 15),
            'sort' => $this->input('sort', 'created_at'),
            'direction' => $this->input('direction', 'desc'),
        ]);
    }

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
            'per_page' => ['required', 'integer', 'min:1', 'max:100'],
            'sort' => ['required', Rule::in(['created_at', 'due_date', 'status'])],
            'direction' => ['required', Rule::in(['asc', 'desc'])],
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::enum(TaskStatus::class)],
        ];
    }

    public function perPage(): int
    {
        return (int) $this->validated('per_page');
    }

    public function sortBy(): string
    {
        return (string) $this->validated('sort');
    }

    public function direction(): string
    {
        return (string) $this->validated('direction');
    }

    public function search(): ?string
    {
        $search = $this->validated('search');

        return is_string($search) && $search !== '' ? $search : null;
    }

    public function status(): ?TaskStatus
    {
        $status = $this->validated('status');

        return is_string($status) ? TaskStatus::from($status) : null;
    }
}
