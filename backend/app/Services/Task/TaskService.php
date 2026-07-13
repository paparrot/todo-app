<?php

declare(strict_types=1);

namespace App\Services\Task;

use App\DTO\Task\CreateTaskDTO;
use App\DTO\Task\UpdateTaskDTO;
use App\Enum\Task\TaskStatus;
use App\Models\Task as TaskModel;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

final class TaskService
{
    /**
     * @return LengthAwarePaginator<int, TaskModel>
     */
    public function getAllTasks(
        User $user,
        int $perPage,
        string $sortBy,
        string $direction,
        ?string $search = null,
        ?TaskStatus $status = null,
    ): LengthAwarePaginator {
        /** @var Builder<TaskModel> $query */
        $query = $user->isAdmin()
            ? TaskModel::query()
            : $user->tasks()->getQuery();

        if ($search !== null) {
            /** @phpstan-ignore-next-line */
            $query->whereRaw('LOWER(title) LIKE ?', [
                '%'.Str::lower($search).'%',
            ]);
        }

        if ($status !== null) {
            $query->where('status', $status->value);
        }

        $query = $query->with('user:id,name');

        /** @phpstan-ignore-next-line */
        $query = $query->orderBy($sortBy, $direction);

        return $query->paginate($perPage)->withQueryString();
    }

    public function createTask(
        User $user,
        CreateTaskDTO $createTaskDTO,
    ): TaskModel {
        return $user->tasks()->create(
            array_merge($createTaskDTO->toArray(), [
                'status' => TaskStatus::PENDING,
            ]),
        );
    }

    public function updateTask(
        TaskModel $task,
        UpdateTaskDTO $updateTaskDTO,
    ): TaskModel {
        $task->update($updateTaskDTO->toArray());

        return $task->refresh();
    }

    public function deleteTask(TaskModel $task): void
    {
        $task->delete();
    }
}
