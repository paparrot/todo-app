<?php

declare(strict_types=1);

namespace App\Http\Resources\Auth;

use App\DTO\Auth\AuthUserDTO;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Attributes as OA;

#[
    OA\Schema(
        schema: 'AuthUser',
        type: 'object',
        properties: [
            new OA\Property(
                property: 'id',
                type: 'string',
                format: 'uuid',
                example: '00000000-0000-0000-0000-000000000000',
            ),
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
                property: 'role',
                type: 'string',
                enum: ['owner', 'admin'],
                example: 'owner',
            ),
        ],
    ),
]
final class AuthUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var AuthUserDTO $authUser */
        $authUser = $this->resource;

        return $authUser->toArray();
    }
}
