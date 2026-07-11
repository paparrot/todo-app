<?php

declare(strict_types=1);

namespace App\DTO\Task;

use App\Enum\Task\TaskStatus;
use Carbon\CarbonImmutable;

final class CreateTaskDTO
{
    public function __construct(
        public string $title,
        public string $description,
        public CarbonImmutable $dueDate,
        public TaskStatus $status,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            title: $data["title"],
            description: $data["description"] ?? "",
            dueDate: CarbonImmutable::parse($data["due_date"]),
            status: TaskStatus::from($data["status"]),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            "title" => $this->title,
            "description" => $this->description,
            "due_date" => $this->dueDate,
            "status" => $this->status,
        ];
    }
}
