<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\DTO\Task\CreateTaskDTO;
use App\DTO\Task\UpdateTaskDTO;
use App\Http\Requests\Task\CreateTaskRequest;
use App\Http\Requests\Task\ListTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\Task\TaskResource;
use App\Models\Task;
use App\Models\User;
use App\Services\Task\TaskService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\Response;

final class TaskController extends Controller
{
    public function __construct(private TaskService $taskService) {}

    #[
        OA\Get(
            path: '/tasks',
            summary: 'List tasks',
            security: [['sanctum' => []]],
            tags: ['Tasks'],
            parameters: [
                new OA\Parameter(
                    name: 'page',
                    in: 'query',
                    required: false,
                    description: 'The page number to retrieve.',
                    schema: new OA\Schema(
                        type: 'integer',
                        minimum: 1,
                        example: 1,
                    ),
                ),
                new OA\Parameter(
                    name: 'per_page',
                    in: 'query',
                    required: false,
                    description: 'Number of tasks per page.',
                    schema: new OA\Schema(
                        type: 'integer',
                        minimum: 1,
                        maximum: 100,
                        example: 15,
                    ),
                ),
                new OA\Parameter(
                    name: 'sort',
                    in: 'query',
                    required: false,
                    description: 'Field used to sort tasks.',
                    schema: new OA\Schema(
                        type: 'string',
                        enum: [
                            'updated_at',
                            'created_at',
                            'due_date',
                            'status',
                        ],
                        example: 'updated_at',
                    ),
                ),
                new OA\Parameter(
                    name: 'direction',
                    in: 'query',
                    required: false,
                    description: 'Sort direction.',
                    schema: new OA\Schema(
                        type: 'string',
                        enum: ['asc', 'desc'],
                        example: 'desc',
                    ),
                ),
                new OA\Parameter(
                    name: 'search',
                    in: 'query',
                    required: false,
                    description: 'Search tasks by title.',
                    schema: new OA\Schema(type: 'string', example: 'milk'),
                ),
                new OA\Parameter(
                    name: 'status',
                    in: 'query',
                    required: false,
                    description: 'Filter tasks by status.',
                    schema: new OA\Schema(
                        type: 'string',
                        enum: ['pending', 'completed', 'in_progress'],
                        example: 'pending',
                    ),
                ),
            ],
            responses: [
                new OA\Response(
                    response: 200,
                    description: 'Paginated list of tasks',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/PaginatedTaskResponse',
                    ),
                ),
                new OA\Response(
                    response: 401,
                    description: 'Unauthenticated',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ErrorResponse',
                    ),
                ),
                new OA\Response(
                    response: 422,
                    description: 'Validation error',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ValidationErrorResponse',
                    ),
                ),
            ],
        ),
    ]
    public function list(ListTaskRequest $request): AnonymousResourceCollection
    {
        /** @var User $user */
        $user = $request->user();

        $tasks = $this->taskService->getAllTasks(
            user: $user,
            perPage: $request->perPage(),
            sortBy: $request->sortBy(),
            direction: $request->direction(),
            search: $request->search(),
            status: $request->status(),
        );

        return TaskResource::collection($tasks);
    }

    #[
        OA\Get(
            path: '/tasks/{task}',
            summary: 'Show task',
            security: [['sanctum' => []]],
            tags: ['Tasks'],
            parameters: [
                new OA\Parameter(
                    name: 'task',
                    in: 'path',
                    required: true,
                    schema: new OA\Schema(type: 'string'),
                ),
            ],
            responses: [
                new OA\Response(
                    response: 200,
                    description: 'Task details',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/Task',
                    ),
                ),
                new OA\Response(
                    response: 403,
                    description: 'Forbidden',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ErrorResponse',
                    ),
                ),
                new OA\Response(
                    response: 404,
                    description: 'Task not found',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ErrorResponse',
                    ),
                ),
                new OA\Response(
                    response: 401,
                    description: 'Unauthenticated',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ErrorResponse',
                    ),
                ),
            ],
        ),
    ]
    public function show(Task $task): TaskResource
    {
        return new TaskResource($task);
    }

    #[
        OA\Post(
            path: '/tasks',
            summary: 'Create task',
            security: [['sanctum' => []]],
            tags: ['Tasks'],
            requestBody: new OA\RequestBody(
                required: true,
                content: new OA\JsonContent(
                    ref: '#/components/schemas/CreateTaskRequest',
                ),
            ),
            responses: [
                new OA\Response(
                    response: 200,
                    description: 'Created task',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/Task',
                    ),
                ),
                new OA\Response(
                    response: 403,
                    description: 'Forbidden',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ErrorResponse',
                    ),
                ),
                new OA\Response(
                    response: 422,
                    description: 'Validation error',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ValidationErrorResponse',
                    ),
                ),
                new OA\Response(
                    response: 401,
                    description: 'Unauthenticated',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ErrorResponse',
                    ),
                ),
            ],
        ),
    ]
    public function create(CreateTaskRequest $request): TaskResource
    {
        /** @var User $user */
        $user = $request->user();

        $task = $this->taskService->createTask(
            user: $user,
            createTaskDTO: CreateTaskDTO::fromArray($request->validated()),
        );

        return new TaskResource($task);
    }

    #[
        OA\Patch(
            path: '/tasks/{task}',
            summary: 'Update task',
            security: [['sanctum' => []]],
            tags: ['Tasks'],
            parameters: [
                new OA\Parameter(
                    name: 'task',
                    in: 'path',
                    required: true,
                    schema: new OA\Schema(type: 'string'),
                ),
            ],
            requestBody: new OA\RequestBody(
                required: true,
                content: new OA\JsonContent(
                    ref: '#/components/schemas/UpdateTaskRequest',
                ),
            ),
            responses: [
                new OA\Response(
                    response: 200,
                    description: 'Updated task',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/Task',
                    ),
                ),
                new OA\Response(
                    response: 403,
                    description: 'Forbidden',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ErrorResponse',
                    ),
                ),
                new OA\Response(
                    response: 404,
                    description: 'Task not found',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ErrorResponse',
                    ),
                ),
                new OA\Response(
                    response: 422,
                    description: 'Validation error',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ValidationErrorResponse',
                    ),
                ),
                new OA\Response(
                    response: 401,
                    description: 'Unauthenticated',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ErrorResponse',
                    ),
                ),
            ],
        ),
    ]
    public function update(UpdateTaskRequest $request, Task $task): TaskResource
    {
        $task = $this->taskService->updateTask(
            task: $task,
            updateTaskDTO: UpdateTaskDTO::fromArray(
                $task->id,
                $request->validated(),
            ),
        );

        return new TaskResource($task);
    }

    #[
        OA\Delete(
            path: '/tasks/{task}',
            summary: 'Delete task',
            security: [['sanctum' => []]],
            tags: ['Tasks'],
            parameters: [
                new OA\Parameter(
                    name: 'task',
                    in: 'path',
                    required: true,
                    schema: new OA\Schema(type: 'string'),
                ),
            ],
            responses: [
                new OA\Response(response: 204, description: 'Task deleted'),
                new OA\Response(
                    response: 403,
                    description: 'Forbidden',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ErrorResponse',
                    ),
                ),
                new OA\Response(
                    response: 404,
                    description: 'Task not found',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ErrorResponse',
                    ),
                ),
                new OA\Response(
                    response: 401,
                    description: 'Unauthenticated',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ErrorResponse',
                    ),
                ),
            ],
        ),
    ]
    public function delete(Task $task): Response
    {
        $this->taskService->deleteTask($task);

        return response()->noContent();
    }
}
