<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enum\User\UserRole;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\Response;

final class AuthController extends Controller
{
    #[
        OA\Post(
            path: '/register',
            summary: 'Register a new user',
            tags: ['Auth'],
            requestBody: new OA\RequestBody(
                required: true,
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'name',
                            type: 'string',
                            example: 'John Doe',
                        ),
                        new OA\Property(
                            property: 'email',
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com',
                        ),
                        new OA\Property(
                            property: 'password',
                            type: 'string',
                            format: 'password',
                            example: 'secret123',
                        ),
                    ],
                    type: 'object',
                ),
            ),
            responses: [
                new OA\Response(
                    response: 200,
                    description: 'User registered successfully',
                ),
                new OA\Response(response: 422, description: 'Validation error'),
            ],
        ),
    ]
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => $request->input('password'),
            'role' => UserRole::OWNER->value,
        ]);

        $user->refresh();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'token' => $token,
            'user' => $user,
        ]);
    }

    #[
        OA\Post(
            path: '/login',
            summary: 'Authenticate user and return an access token',
            tags: ['Auth'],
            requestBody: new OA\RequestBody(
                required: true,
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'email',
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com',
                        ),
                        new OA\Property(
                            property: 'password',
                            type: 'string',
                            format: 'password',
                            example: 'secret123',
                        ),
                    ],
                    type: 'object',
                ),
            ),
            responses: [
                new OA\Response(
                    response: 200,
                    description: 'Authentication successful',
                    content: new OA\JsonContent(
                        properties: [
                            new OA\Property(
                                property: 'token',
                                type: 'string',
                                example: '1|abcdef1234567890',
                            ),
                        ],
                        type: 'object',
                    ),
                ),
                new OA\Response(response: 404, description: 'User not found'),
                new OA\Response(
                    response: 401,
                    description: 'Invalid credentials',
                ),
            ],
        ),
    ]
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();
        if (! $user) {
            return response()->json(data: ['message' => 'User not found'], status: Response::HTTP_NOT_FOUND);
        }
        if (! Hash::check($request->password, $user->password)) {
            return response()->json(data: ['message' => 'Invalid credentials'],
                status: Response::HTTP_UNAUTHORIZED
            );
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(data: [
            'token' => $token,
            'user' => $user,
            'message' => 'Login successful',
        ]);
    }

    #[
        OA\Post(
            path: '/logout',
            summary: 'Invalidate access token',
            security: [['sanctum' => []]],
            tags: ['Auth'],
            responses: [
                new OA\Response(
                    response: 200,
                    description: 'Logged out successfully',
                ),
                new OA\Response(response: 401, description: 'Unauthenticated'),
            ],
        ),
    ]
    public function logout(Request $request): JsonResponse
    {
        $request->user()?->tokens()?->delete();

        return response()->json(data: ['message' => 'Logged out']);
    }
}
