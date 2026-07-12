<?php

declare(strict_types=1);

namespace App\DTO\Task;

use Carbon\CarbonImmutable;

final class CreateTaskDTO
{
    public function __construct(
        public string $title,
        public ?string $description,
        public ?CarbonImmutable $dueDate,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            title: $data['title'],
            description: $data['description'] ?? null,
            dueDate: filled($data['due_date'] ?? null)
                ? CarbonImmutable::parse((string) $data['due_date'])
                : null,
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
        ];
    }
}
