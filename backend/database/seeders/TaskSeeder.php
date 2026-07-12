<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enum\Task\TaskStatus;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

final class TaskSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ownerEmail = config('seeders.users.owner.email');
        $owner = User::query()->where('email', $ownerEmail)->firstOrFail();
        $taskCount = (int) config('seeders.tasks.owner.count', 3);

        for ($index = 1; $index <= $taskCount; $index++) {
            Task::updateOrCreate(
                [
                    'user_id' => $owner->id,
                    'title' => sprintf('Owner task %d', $index),
                ],
                [
                    'description' => sprintf('Default seeded task %d for the owner.', $index),
                    'due_date' => Carbon::today()->addDays($index),
                    'status' => TaskStatus::PENDING->value,
                ]
            );
        }

        User::factory()->create()->tasks()->createMany(
            Task::factory()->count(200)->make()->toArray()
        );
    }
}
