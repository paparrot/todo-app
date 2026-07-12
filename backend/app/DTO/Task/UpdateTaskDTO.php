<?php

declare(strict_types=1);

namespace App\DTO\Task;

use App\Enum\Task\TaskStatus;
use Carbon\CarbonImmutable;

final class UpdateTaskDTO
{
    public function __construct(
        public string $id,
        public string $title,
        public ?string $description,
        public ?CarbonImmutable $dueDate,
        public TaskStatus $status,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(string $id, array $data): self
    {
        return new self(
            id: $id,
            title: $data['title'],
            description: $data['description'] ?? null,
            dueDate: isset($data['due_date']) && $data['due_date'] !== null
                ? CarbonImmutable::parse($data['due_date'])
                : null,
            status: TaskStatus::from($data['status']),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'due_date' => $this->dueDate,
            'status' => $this->status,
        ];
    }
}
