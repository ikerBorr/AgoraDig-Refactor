# API Documentation

> Comprehensive REST API reference for AgoraDig backend services

**Base URL:** `http://localhost:3000/api`  
**Version:** `1.0.0`  
**Content-Type:** `application/json`

---

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
    - [Authentication API](#authentication-api)

---

## Overview

The AgoraDig API follows RESTful principles and uses JSON for request and response payloads. All endpoints return standardized response structures with appropriate HTTP status codes.

---

## Authentication

### Authentication Methods

Currently, the API uses **session-based authentication** with the following flow:

1. Client sends credentials to `/auth/login`
2. Server validates and creates a cookie session
3. Cookie session token returned in response
4. Subsequent requests include cookie session token

---

## Error Handling

The API implements a layered error handling strategy that maps errors to their architectural origin, providing clear insight into where issues occur.

### Error Response Structure

All error responses follow this format:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable error description"
}
```

### Status Code Strategy

| Status Code | Layer | Description |
|-------------|-------|-------------|
| **400** | Schema Validation | Request failed input validation (Zod) |
| **401** | Application | Authentication or authorization failure |
| **409** | Application | Business logic or policy conflict |
| **422** | Domain | Domain validation rules violated |
| **500** | Infrastructure | Unexpected server or system error |

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body validation failed |
| `INVALID_CREDENTIALS` | 401 | Authentication failed |
| `USER_BANNED` | 409 | Account suspended or restricted |
| `EMAIL_TLD_INVALID` | 422 | Domain-level email validation failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Rate Limiting

**Status:** 🟡 Planned (Redis-based implementation)

Rate limits will be enforced on sensitive endpoints to prevent abuse:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/auth/login` | 5 requests | 15 minutes |
| `/auth/register` | 3 requests | 1 hour |

**Rate Limit Exceeded Response:**
```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please try again in 10 minutes.",
  "retryAfter": 600
}
```

---

## Endpoints

---

## Authentication API

Handles user authentication, session management, and credential verification.

### Login

Authenticates a user using their identifier (email or username) and password. Returns authentication status and creates a session on success.

---

#### `POST /auth/login`

**Description:** Authenticate user and create session

**Authentication Required:** No

**Rate Limited:** Yes (5 requests per 15 minutes)

---

#### Request

##### Headers

```http
Content-Type: application/json
```

##### Body Parameters

| Parameter | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| `identifier` | `string` | ✓ | 3-255 chars | Valid email address or username |
| `password` | `string` | ✓ | 8-128 chars | User password (case-sensitive) |

##### Request Example

```json
{
  "identifier": "john.doe@example.com",
  "password": "Str0ngP@ssw0rd!"
}
```

**Alternative with Username:**
```json
{
  "identifier": "johndoe",
  "password": "Str0ngP@ssw0rd!"
}
```

---

#### Response

##### Success Response

**Status Code:** `200 OK`

**Description:** Authentication successful, session created

```json
{
  "code": "SUCCESS",
  "message": "Login successful"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `code` | `string` | Success status code |
| `message` | `string` | Human-readable success message |

**Headers:**
```http
Set-Cookie: token=abc123...; HttpOnly; Secure; SameSite=Strict
```

---

##### Error Responses

###### 400 Bad Request

**Scenario:** Request body failed schema validation

**Layer:** Schema Validation (Zod)

```json
{
  "code": "VALIDATION_ERROR",
  "message": "The password is invalid input."
}
```

**Common Causes:**
- Missing required fields (`identifier` or `password`)
- Invalid data types (non-string values)
- Empty string values
- Password length constraints violated
- Malformed JSON body

**Example Scenarios:**

```json
// Missing password
{
  "code": "VALIDATION_ERROR",
  "message": "Required field 'password' is missing."
}
```

```json
// Password too short
{
  "code": "VALIDATION_ERROR",
  "message": "Password must be at least 8 characters."
}
```

---

###### 401 Unauthorized

**Scenario:** Invalid credentials provided

**Layer:** Application

```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid credentials"
}
```

**Common Causes:**
- Incorrect password for existing user
- Identifier does not match any account
- Case-sensitive password mismatch
- Account exists but authentication failed

**Security Note:** The generic message prevents user enumeration attacks by not revealing whether the identifier exists.

---

###### 409 Conflict

**Scenario:** Application-level policy violation

**Layer:** Application

```json
{
  "code": "USER_BANNED",
  "message": "User has been banned"
}
```

**Common Causes:**
- Account suspended or banned by administrator
- Account pending verification
- Temporary account restriction
- Policy violation enforcement

**Additional Examples:**

```json
{
  "code": "ACCOUNT_LOCKED",
  "message": "Account locked due to multiple failed login attempts"
}
```

```json
{
  "code": "EMAIL_NOT_VERIFIED",
  "message": "Please verify your email before logging in"
}
```

---

###### 422 Unprocessable Entity

**Scenario:** Domain validation rules violated

**Layer:** Domain

```json
{
  "code": "EMAIL_TLD_INVALID",
  "message": "Top-level domain must be at least 2 letters."
}
```

**Common Causes:**
- Invalid email format (domain rules)
- Invalid username format (domain rules)
- Domain-level business rule violations
- Value object instantiation failures

**Additional Examples:**

```json
{
  "code": "EMAIL_INVALID_FORMAT",
  "message": "Email address format is invalid."
}
```

```json
{
  "code": "PASSWORD_TOO_SHORT",
  "message": "Password must be at least 8 characters long."
}
```

---

###### 500 Internal Server Error

**Scenario:** Unexpected server or infrastructure error

**Layer:** Infrastructure

```json
{
  "code": "INTERNAL_ERROR",
  "message": "An unexpected error occurred. Please try again later."
}
```

**Common Causes:**
- Database connection failure
- Redis cache unavailable
- Unhandled exception in business logic
- Infrastructure service outage
- Memory or resource exhaustion

> **Note:** Detailed error information is logged server-side but not exposed to clients for security reasons.

---

## Appendix

### Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-08 | Initial API documentation |

### Related Resources

- [OpenAPI Specification](./openapi.yaml)

### Support

For API-related questions or issues:
- **GitHub Issues:** [Report a bug](https://github.com/CPV05/AgoraDig-refactor/issues)
- **Discussions:** [Ask a question](https://github.com/CPV05/AgoraDig-refactor/discussions)

---

<div align="center">

**Last Updated:** October 8, 2025

</div>