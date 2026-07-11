<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/tasks', [TaskController::class, 'list'])->can('viewAny', Task::class);
    Route::get('/tasks/{task}', [TaskController::class, 'show'])->can('view', 'task');
    Route::post('/tasks', [TaskController::class, 'create'])->can('create', Task::class);
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->can('update', 'task');
    Route::delete('/tasks/{task}', [TaskController::class, 'delete'])->can('delete', 'task');
});
