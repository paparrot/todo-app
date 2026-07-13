<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\DTO\Auth\AuthTokenResponseDTO;
use App\Enum\User\UserRole;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\Auth\AuthTokenResponseResource;
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
                    ref: '#/components/schemas/RegisterRequest',
                ),
            ),
            responses: [
                new OA\Response(
                    response: 200,
                    description: 'User registered successfully',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/AuthTokenResponse',
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
    public function register(
        RegisterRequest $request,
    ): AuthTokenResponseResource {
        $user = User::query()->create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => $request->input('password'),
            'role' => UserRole::OWNER->value,
        ]);

        $user->refresh();

        $token = $user->createToken('auth_token')->plainTextToken;

        return new AuthTokenResponseResource(
            AuthTokenResponseDTO::fromUser(
                $user,
                $token,
                'User registered successfully',
            ),
        );
    }

    #[
        OA\Post(
            path: '/login',
            summary: 'Authenticate user and return an access token',
            tags: ['Auth'],
            requestBody: new OA\RequestBody(
                required: true,
                content: new OA\JsonContent(
                    ref: '#/components/schemas/LoginRequest',
                ),
            ),
            responses: [
                new OA\Response(
                    response: 200,
                    description: 'Authentication successful',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/AuthTokenResponse',
                    ),
                ),
                new OA\Response(
                    response: 404,
                    description: 'User not found',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ErrorResponse',
                    ),
                ),
                new OA\Response(
                    response: 401,
                    description: 'Invalid credentials',
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/ErrorResponse',
                    ),
                ),
            ],
        ),
    ]
    public function login(
        LoginRequest $request,
    ): AuthTokenResponseResource|JsonResponse {
        $user = User::query()->where('email', $request->email)->first();
        if ($user === null) {
            return response()->json(
                ['message' => 'User not found'],
                Response::HTTP_NOT_FOUND,
            );
        }

        if (! Hash::check($request->password, $user->password)) {
            return response()->json(
                ['message' => 'Invalid credentials'],
                Response::HTTP_UNAUTHORIZED,
            );
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return new AuthTokenResponseResource(
            AuthTokenResponseDTO::fromUser($user, $token, 'Login successful'),
        );
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
                    content: new OA\JsonContent(
                        ref: '#/components/schemas/MessageResponse',
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
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user !== null) {
            foreach ($user->tokens as $token) {
                $token->delete();
            }
        }

        return response()->json(['message' => 'Logged out']);
    }
}
