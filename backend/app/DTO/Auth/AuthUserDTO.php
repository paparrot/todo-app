<?php

declare(strict_types=1);

namespace App\DTO\Auth;

use App\Enum\User\UserRole;
use App\Models\User;

final class AuthUserDTO
{
    public function __construct(
        public string $id,
        public string $name,
        public string $email,
        public string $role,
    ) {}

    public static function fromUser(User $user): self
    {
        $role =
            $user->role instanceof UserRole
                ? $user->role->value
                : (string) $user->role;

        return new self(
            id: (string) $user->id,
            name: $user->name,
            email: $user->email,
            role: $role,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
        ];
    }
}
