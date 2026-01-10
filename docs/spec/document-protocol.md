# Document Library Protocol

The Document Library Protocol defines the API specifications for managing documents, folders, and versions in ObjectOS.

## Base URL

All document library endpoints are accessed via the ObjectOS Data API:

```
/api/v6/data/{objectName}
```

## Objects

- `folder` - Folder management
- `document` - Document management  
- `documentVersion` - Version history

## Common Headers

```http
Authorization: Bearer {token}
Content-Type: application/json
```

## Folder Operations

### Create Folder

Create a new folder for organizing documents.

**Request:**
```http
POST /api/v6/data/folder
Content-Type: application/json

{
  "name": "Project Documents",
  "description": "Documents for the Alpha project",
  "parent_folder": "folder_id_123",
  "is_public": false
}
```

**Response:**
```json
{
  "_id": "folder_id_456",
  "name": "Project Documents",
  "description": "Documents for the Alpha project",
  "parent_folder": "folder_id_123",
  "path": "/root/Project Documents",
  "is_public": false,
  "created_at": "2026-01-10T12:00:00Z",
  "created_by": "user_id_789"
}
```

### List Folders

Get folders with optional filtering and hierarchy expansion.

**Request:**
```http
GET /api/v6/data/folder?expand=parent_folder&sort=name:asc
```

**Response:**
```json
[
  {
    "_id": "folder_id_456",
    "name": "Project Documents",
    "parent_folder": {
      "_id": "folder_id_123",
      "name": "root"
    },
    "path": "/root/Project Documents"
  }
]
```

### Get Folder Hierarchy

Retrieve folder with all parent folders expanded.

**Request:**
```http
GET /api/v6/data/folder/folder_id_456?expand=parent_folder
```

## Document Operations

### Create Document

Upload a new document to the library.

**Request:**
```http
POST /api/v6/data/document
Content-Type: application/json

{
  "title": "Project Plan",
  "description": "2026 Q1 Project Plan",
  "folder": "folder_id_456",
  "content": "# Project Plan\n\nObjectives...",
  "file_url": "https://storage.example.com/files/plan.pdf",
  "file_name": "plan.pdf",
  "file_size": 102400,
  "file_type": "application/pdf",
  "status": "draft",
  "tags": "planning,2026,q1",
  "is_public": false
}
```

**Response:**
```json
{
  "_id": "doc_id_789",
  "title": "Project Plan",
  "description": "2026 Q1 Project Plan",
  "folder": "folder_id_456",
  "status": "draft",
  "version": 1,
  "created_at": "2026-01-10T12:00:00Z",
  "created_by": "user_id_789"
}
```

### Update Document

Update a document and optionally create a new version.

**Request:**
```http
PUT /api/v6/data/document/doc_id_789
Content-Type: application/json

{
  "title": "Project Plan - Updated",
  "content": "# Updated Project Plan\n\nRevised objectives...",
  "status": "review"
}
```

**Response:**
```json
{
  "_id": "doc_id_789",
  "title": "Project Plan - Updated",
  "status": "review",
  "version": 2,
  "updated_at": "2026-01-10T13:00:00Z"
}
```

### Search Documents

Search documents by title, content, or tags.

**Request:**
```http
GET /api/v6/data/document?filters=[["tags","contains","planning"]]&expand=folder
```

**Response:**
```json
[
  {
    "_id": "doc_id_789",
    "title": "Project Plan",
    "folder": {
      "_id": "folder_id_456",
      "name": "Project Documents"
    },
    "status": "review",
    "tags": "planning,2026,q1"
  }
]
```

### Publish Document

Change document status to published.

**Request:**
```http
PUT /api/v6/data/document/doc_id_789
Content-Type: application/json

{
  "status": "published",
  "published_at": "2026-01-10T14:00:00Z"
}
```

### Archive Document

Archive a document (soft delete).

**Request:**
```http
PUT /api/v6/data/document/doc_id_789
Content-Type: application/json

{
  "status": "archived"
}
```

### Delete Document

Permanently delete a document.

**Request:**
```http
DELETE /api/v6/data/document/doc_id_789
```

## Version Operations

### Create Version

Create a new version snapshot of a document.

**Request:**
```http
POST /api/v6/data/documentVersion
Content-Type: application/json

{
  "document": "doc_id_789",
  "version_number": 2,
  "title": "Project Plan - Updated",
  "content": "# Updated Project Plan\n\nRevised objectives...",
  "file_url": "https://storage.example.com/files/plan_v2.pdf",
  "file_name": "plan_v2.pdf",
  "file_size": 105600,
  "change_summary": "Updated Q1 objectives and timeline"
}
```

**Response:**
```json
{
  "_id": "version_id_001",
  "document": "doc_id_789",
  "version_number": 2,
  "title": "Project Plan - Updated",
  "change_summary": "Updated Q1 objectives and timeline",
  "created_at": "2026-01-10T13:00:00Z",
  "created_by": "user_id_789"
}
```

### Get Version History

Retrieve all versions of a document.

**Request:**
```http
GET /api/v6/data/documentVersion?filters=[["document","=","doc_id_789"]]&sort=version_number:desc
```

**Response:**
```json
[
  {
    "_id": "version_id_001",
    "document": "doc_id_789",
    "version_number": 2,
    "title": "Project Plan - Updated",
    "created_at": "2026-01-10T13:00:00Z"
  },
  {
    "_id": "version_id_000",
    "document": "doc_id_789",
    "version_number": 1,
    "title": "Project Plan",
    "created_at": "2026-01-10T12:00:00Z"
  }
]
```

### Restore Version

Restore a document to a previous version.

**Request:**
```http
PUT /api/v6/data/document/doc_id_789
Content-Type: application/json

{
  "title": "Project Plan",
  "content": "# Project Plan\n\nObjectives...",
  "file_url": "https://storage.example.com/files/plan.pdf",
  "version": 3
}
```

## Filter Syntax

The Document Library Protocol supports ObjectQL filter syntax:

### Basic Filters

```javascript
// Equal
filters: [["status", "=", "published"]]

// Not equal
filters: [["status", "!=", "archived"]]

// Contains (for text search)
filters: [["tags", "contains", "planning"]]

// Date range
filters: [["created_at", ">=", "2026-01-01"], ["created_at", "<=", "2026-12-31"]]
```

### Complex Filters

```javascript
// AND conditions
filters: [
  ["status", "=", "published"],
  ["is_public", "=", true]
]

// OR conditions (using array of filter arrays)
filters: [
  [["status", "=", "published"], "or", ["status", "=", "review"]]
]
```

## Sorting

```
sort=title:asc          // Sort by title ascending
sort=created_at:desc    // Sort by creation date descending
sort=version:desc       // Sort by version number
```

## Pagination

```
limit=20&skip=0         // First page (20 items)
limit=20&skip=20        // Second page
```

## Expansion

Expand related objects in the response:

```
expand=folder,author    // Expand folder and author references
expand=document         // Expand document reference (for versions)
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid filters format"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Record not found"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Access denied"
}
```

## Best Practices

1. **Use Versions**: Always create version snapshots for important changes
2. **Organize with Folders**: Use hierarchical folder structure for better organization
3. **Tag Liberally**: Use tags for flexible categorization and search
4. **Status Workflow**: Follow the draft → review → published workflow
5. **Access Control**: Set `is_public` appropriately for security
6. **Expand Wisely**: Only expand relationships you need to reduce payload size

## File Upload Flow

The protocol doesn't handle file uploads directly. Follow this pattern:

1. Upload file to storage service (S3, etc.)
2. Get file URL from storage service
3. Create document with `file_url`, `file_name`, `file_size`, `file_type`

Example:
```javascript
// 1. Upload to storage
const fileUrl = await uploadToS3(file);

// 2. Create document
await fetch('/api/v6/data/document', {
  method: 'POST',
  body: JSON.stringify({
    title: file.name,
    file_url: fileUrl,
    file_name: file.name,
    file_size: file.size,
    file_type: file.type
  })
});
```

## Integration Examples

### TypeScript SDK

```typescript
import { ObjectQLClient } from '@objectos/sdk';

const client = new ObjectQLClient({ 
  baseUrl: 'http://localhost:3000/api/v6' 
});

// Create folder
const folder = await client.object('folder').create({
  name: 'Project Docs',
  is_public: false
});

// Create document
const doc = await client.object('document').create({
  title: 'Specification',
  folder: folder._id,
  status: 'draft'
});

// Update to published
await client.object('document').update(doc._id, {
  status: 'published',
  published_at: new Date()
});

// Search documents
const results = await client.object('document').find({
  filters: [['status', '=', 'published']],
  expand: ['folder']
});
```

### React Hook

```typescript
import { useObject } from '@objectos/react';

function DocumentList() {
  const { data: documents, loading } = useObject('document', {
    filters: [['status', '=', 'published']],
    expand: ['folder', 'author'],
    sort: 'created_at:desc'
  });

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {documents.map(doc => (
        <li key={doc._id}>
          {doc.title} - {doc.folder?.name}
        </li>
      ))}
    </ul>
  );
}
```
