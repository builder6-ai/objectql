# HTTP Protocol

The Server exposes a RESTful API following these conventions.

## Headers

- `Content-Type: application/json`
- `Authorization: Bearer <token>`

## Response Envelope

```json
{
  "code": 200,
  "data": { ... },
  "message": "Success"
}
```

## Standard Endpoints

- `GET /api/v4/{object}/query`
- `POST /api/v4/{object}`
- `PUT /api/v4/{object}/{id}`
- `DELETE /api/v4/{object}/{id}`
