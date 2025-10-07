# API Documentation

## Authentication API

### Login

Authenticates a user using their identifier (email or username) and password. Returns a minimal user data transfer object on successful authentication.

---

#### Endpoint

```http
POST /auth/login
```

---

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `identifier` | `string` | ✓ | Valid email address or username |
| `password` | `string` | ✓ | User password (validated against stored hash) |

**Example Request**

```json
{
  "identifier": "john.doe@example.com",
  "password": "Str0ngP@ss!"
}
```

---

#### Response

##### Success Response

**Status Code:** `200 OK`

```json
{
  "uuid": "2b7e2b65-9c9f-4f22-8f7d-8f6f7e5b6f11",
  "identifier": "john.doe@example.com"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | `string` | Unique user identifier (UUID v4) |
| `identifier` | `string` | User's email or username |

---

##### Error Responses

The API uses different status codes to indicate the layer where the error occurred:

| Status Code | Error Type | Layer | Description |
|-------------|------------|-------|-------------|
| `400` | Validation Error | Schema | Request body failed schema validation |
| `401` | Invalid Credentials | Application | Authentication failed |
| `409` | Application Error | Application | Business logic or policy violation |
| `422` | Domain Error | Domain | Domain validation rules violated |
| `500` | Server Error | Infrastructure | Unexpected server error |

---

###### 400 Bad Request

**Scenario:** Request body validation failed (Zod schema)

```json
{
  "code": "VALIDATION_ERROR",
  "message": [
    {
      "code": "invalid_type",
      "path": ["identifier"],
      "message": "Expected string, received null"
    }
  ]
}
```

**Common Causes:**
- Missing required fields
- Invalid data types
- Malformed request body

---

###### 401 Unauthorized

**Scenario:** Invalid credentials provided

```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid credentials"
}
```

**Common Causes:**
- Incorrect password
- Non-existent user
- Identifier does not match any account

---

###### 409 Conflict

**Scenario:** Application-level policy violation

```json
{
  "code": "USER_BANNED",
  "message": "User has been banned"
}
```

**Common Causes:**
- Account suspended or banned

---

###### 422 Unprocessable Entity

**Scenario:** Domain validation rules violated

```json
{
  "code": "EMAIL_TLD_INVALID",
  "message": "Top-level domain must be at least 2 letters."
}
```

**Common Causes:**
- Invalid email format (domain layer)
---

###### 500 Internal Server Error

**Scenario:** Unexpected server error

```json
{
  "code": 500,
  "message": "Internal Server Error"
}
```

**Common Causes:**
- Database connection failure
- Unhandled exception
- Infrastructure issue

---