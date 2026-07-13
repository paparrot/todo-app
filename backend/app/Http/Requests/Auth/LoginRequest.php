<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Attributes as OA;

#[
    OA\Schema(
        schema: 'LoginRequest',
        type: 'object',
        required: ['email', 'password'],
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
    ),
]
final class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to this request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255', 'exists:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ];
    }
}
