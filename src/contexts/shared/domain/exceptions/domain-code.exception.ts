export enum DomainExceptionCode {
    // Breaking a Value Object / Entity / Aggregate invariant
    INVARIANT_VIOLATION = 'INVARIANT_VIOLATION',

    // Violation a business rule
    BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',

    // Invalid state transition within an Aggregate
    STATE_CONFLICT = 'STATE_CONFLICT',

    // Domain-level uniqueness violation
    ALREADY_EXISTS = 'ALREADY_EXISTS',

    // The requested Aggregate does not exist
    NOT_FOUND = 'NOT_FOUND',

    // Aggregate version mismatch
    CONCURRENCY_CONFLICT = 'CONCURRENCY_CONFLICT',

    // Business limit exceeded
    LIMIT_EXCEEDED = 'LIMIT_EXCEEDED',

    // A precondition for a use case or domain service is not met
    PRECONDITION_FAILED = 'PRECONDITION_FAILED',

    // A domain specification is not satisfied
    SPECIFICATION_NOT_SATISFIED = 'SPECIFICATION_NOT_SATISFIED',
}
