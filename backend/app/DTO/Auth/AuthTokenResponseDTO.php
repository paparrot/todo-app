<?php

declare(strict_types=1);

namespace App\DTO\Auth;

use App\Models\User;

final class AuthTokenResponseDTO
{
    public function __construct(
        public string $message,
        public string $token,
        public AuthUserDTO $user,
    ) {}

    public static function fromUser(
        User $user,
        string $token,
        string $message,
    ): self {
        return new self(
            message: $message,
            token: $token,
            user: AuthUserDTO::fromUser($user),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'message' => $this->message,
            'token' => $this->token,
            'user' => $this->user->toArray(),
        ];
    }
}
