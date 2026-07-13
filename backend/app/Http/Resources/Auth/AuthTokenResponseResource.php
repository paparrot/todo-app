<?php

declare(strict_types=1);

namespace App\Http\Resources\Auth;

use App\DTO\Auth\AuthTokenResponseDTO;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Attributes as OA;

#[
    OA\Schema(
        schema: 'AuthTokenResponse',
        type: 'object',
        properties: [
            new OA\Property(
                property: 'message',
                type: 'string',
                example: 'Login successful',
            ),
            new OA\Property(
                property: 'token',
                type: 'string',
                example: '1|abcdef1234567890',
            ),
            new OA\Property(
                property: 'user',
                ref: '#/components/schemas/AuthUser',
            ),
        ],
    ),
]
final class AuthTokenResponseResource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var AuthTokenResponseDTO $authTokenResponse */
        $authTokenResponse = $this->resource;

        return [
            'message' => $authTokenResponse->message,
            'token' => $authTokenResponse->token,
            'user' => $authTokenResponse->user->toArray(),
        ];
    }
}
