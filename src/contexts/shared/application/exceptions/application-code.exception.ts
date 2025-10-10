export enum ApplicationExceptionCode {
    // Input data is syntactically valid but semantically incorrect for this use case
    INVALID_INPUT = 'INVALID_INPUT',

    // Required domain resource was not found during orchestration
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',

    // A dependent bounded context rejected the request
    DEPENDENCY_FAILURE = 'DEPENDENCY_FAILURE',

    // An external call timed out
    TIMEOUT = 'TIMEOUT',

    // A concurrent modification state occurred while executing the use case
    CONCURRENCY_CONFLICT = 'CONCURRENCY_CONFLICT',

    // A command or query failed validation before invoking domain logic
    VALIDATION_ERROR = 'VALIDATION_ERROR',

    // The use case cannot be executed due to the current application state or policy
    OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',

    // The operation was attempted multiple times or has already been processed
    DUPLICATE_REQUEST = 'DUPLICATE_REQUEST',

    // A generic error occurred within application orchestration
    INTERNAL_ERROR = 'INTERNAL_ERROR',
}
