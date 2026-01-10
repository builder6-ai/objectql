# Document Library Setup Wizard

This wizard will guide you through setting up and using the Document Library in ObjectOS.

## Prerequisites

- ObjectOS installed and running
- `@objectos/preset-base` installed (for user management)
- Database configured (PostgreSQL, MongoDB, or SQLite)

## Step 1: Install Document Library Preset

Install the document library preset package:

```bash
npm install @objectos/preset-documents
```

Or add to your `package.json`:

```json
{
  "dependencies": {
    "@objectos/preset-documents": "^0.1.0"
  }
}
```

## Step 2: Configure ObjectQL

Load the document library objects in your ObjectQL configuration.

### Option A: TypeScript Configuration

Create or update `src/objectql.config.ts`:

```typescript
import { ObjectQL } from '@objectql/core';
import { getAllObjectDefinitionPaths } from '@objectos/preset-documents';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

// Initialize ObjectQL
const objectql = new ObjectQL({
  driver: yourDatabaseDriver
});

// Load document library objects
const documentObjectPaths = getAllObjectDefinitionPaths();
documentObjectPaths.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const objectDef = yaml.load(content);
  objectql.registerObject(objectDef);
});

export default objectql;
```

### Option B: Direct Registration

If you prefer registering objects individually:

```typescript
import { ObjectQL } from '@objectql/core';
import { 
  getFolderObjectPath, 
  getDocumentObjectPath, 
  getDocumentVersionObjectPath 
} from '@objectos/preset-documents';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

const objectql = new ObjectQL({ driver: yourDatabaseDriver });

// Load and register each object
const loadObject = (filePath: string) => {
  const content = fs.readFileSync(filePath, 'utf8');
  return yaml.load(content);
};

objectql.registerObject(loadObject(getFolderObjectPath()));
objectql.registerObject(loadObject(getDocumentObjectPath()));
objectql.registerObject(loadObject(getDocumentVersionObjectPath()));
```

## Step 3: Initialize Database Schema

Run the schema migration to create the necessary tables:

```bash
npm run migrate
```

Or programmatically:

```typescript
await objectql.syncSchema();
```

This will create three tables:
- `folder` - For organizing documents
- `document` - For storing document metadata
- `documentVersion` - For version history

## Step 4: Create Your First Folder

Using the API or SDK, create a root folder:

### Via API (cURL)

```bash
curl -X POST http://localhost:3000/api/v6/data/folder \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Root",
    "description": "Root folder for all documents",
    "is_public": false
  }'
```

### Via TypeScript SDK

```typescript
import { ObjectQLClient } from '@objectos/sdk';

const client = new ObjectQLClient({
  baseUrl: 'http://localhost:3000/api/v6',
  token: 'YOUR_TOKEN'
});

const rootFolder = await client.object('folder').create({
  name: 'Root',
  description: 'Root folder for all documents',
  is_public: false
});

console.log('Created folder:', rootFolder._id);
```

### Via React Component

```typescript
import { useObjectMutation } from '@objectos/react';

function CreateRootFolder() {
  const { mutate, loading } = useObjectMutation('folder');

  const handleCreate = async () => {
    const result = await mutate({
      name: 'Root',
      description: 'Root folder for all documents',
      is_public: false
    });
    console.log('Created:', result);
  };

  return (
    <button onClick={handleCreate} disabled={loading}>
      Create Root Folder
    </button>
  );
}
```

## Step 5: Create Nested Folders

Build your folder hierarchy:

```typescript
// Create parent folder
const projectsFolder = await client.object('folder').create({
  name: 'Projects',
  description: 'Project documentation',
  parent_folder: rootFolder._id,
  is_public: false
});

// Create child folder
const alphaProject = await client.object('folder').create({
  name: 'Project Alpha',
  description: 'Alpha project documentation',
  parent_folder: projectsFolder._id,
  is_public: false
});
```

## Step 6: Upload Your First Document

### With File Storage (Recommended)

If you have file storage (S3, etc.) set up:

```typescript
// 1. Upload file to storage
const file = document.getElementById('fileInput').files[0];
const formData = new FormData();
formData.append('file', file);

const uploadResponse = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
const { url } = await uploadResponse.json();

// 2. Create document record
const document = await client.object('document').create({
  title: file.name,
  description: 'Project specification document',
  folder: alphaProject._id,
  file_url: url,
  file_name: file.name,
  file_size: file.size,
  file_type: file.type,
  status: 'draft',
  tags: 'specification,alpha,project',
  is_public: false
});
```

### Without File Storage (Text Only)

For text documents:

```typescript
const document = await client.object('document').create({
  title: 'Meeting Notes',
  description: 'Weekly team meeting notes',
  folder: alphaProject._id,
  content: `# Meeting Notes - Week 1

## Attendees
- Alice
- Bob

## Discussion
...
  `,
  status: 'draft',
  tags: 'meeting,notes,weekly',
  is_public: false
});
```

## Step 7: Implement Version Control

When updating a document, create a version snapshot:

```typescript
// Get current document
const currentDoc = await client.object('document').findOne(document._id);

// Create version snapshot BEFORE updating
await client.object('documentVersion').create({
  document: currentDoc._id,
  version_number: currentDoc.version,
  title: currentDoc.title,
  content: currentDoc.content,
  file_url: currentDoc.file_url,
  file_name: currentDoc.file_name,
  file_size: currentDoc.file_size,
  change_summary: 'Initial version'
});

// Now update the document
await client.object('document').update(document._id, {
  content: 'Updated content...',
  version: currentDoc.version + 1
});
```

### Automatic Version Creation (Hook)

For automatic versioning, implement a `beforeUpdate` hook:

```typescript
objectql.on('beforeUpdate', async (ctx) => {
  if (ctx.objectName === 'document') {
    const current = await ctx.object('document').findOne(ctx.id);
    
    // Create version snapshot
    await ctx.object('documentVersion').create({
      document: ctx.id,
      version_number: current.version,
      title: current.title,
      content: current.content,
      file_url: current.file_url,
      file_name: current.file_name,
      file_size: current.file_size,
      change_summary: 'Auto-saved version'
    });
    
    // Increment version
    ctx.data.version = (current.version || 1) + 1;
  }
});
```

## Step 8: Implement Document Workflow

Move documents through the workflow:

```typescript
// Draft → Review
await client.object('document').update(document._id, {
  status: 'review'
});

// Review → Published
await client.object('document').update(document._id, {
  status: 'published',
  published_at: new Date().toISOString()
});

// Published → Archived
await client.object('document').update(document._id, {
  status: 'archived'
});
```

## Step 9: Implement Search

Search across documents:

```typescript
// Search by title
const results = await client.object('document').find({
  filters: [['title', 'contains', 'specification']],
  expand: ['folder', 'author']
});

// Search by tags
const taggedDocs = await client.object('document').find({
  filters: [['tags', 'contains', 'meeting']],
  sort: 'created_at:desc'
});

// Search by status and folder
const publishedInFolder = await client.object('document').find({
  filters: [
    ['status', '=', 'published'],
    ['folder', '=', alphaProject._id]
  ]
});

// Full-text search (if supported by database)
const searchResults = await client.object('document').find({
  filters: [
    [['title', 'contains', 'alpha'], 'or', ['content', 'contains', 'alpha']]
  ]
});
```

## Step 10: Build UI Components

### Document List Component

```typescript
import { useObject } from '@objectos/react';

function DocumentList({ folderId }: { folderId: string }) {
  const { data: documents, loading, error } = useObject('document', {
    filters: [['folder', '=', folderId]],
    expand: ['folder', 'author'],
    sort: 'updated_at:desc'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Documents</h2>
      <ul>
        {documents.map(doc => (
          <li key={doc._id}>
            <a href={doc.file_url}>
              {doc.title}
            </a>
            <span className="status">{doc.status}</span>
            <span className="version">v{doc.version}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Folder Tree Component

```typescript
function FolderTree({ parentId = null }: { parentId?: string | null }) {
  const { data: folders } = useObject('folder', {
    filters: parentId 
      ? [['parent_folder', '=', parentId]]
      : [['parent_folder', '=', null]],
    sort: 'name:asc'
  });

  return (
    <ul>
      {folders?.map(folder => (
        <li key={folder._id}>
          📁 {folder.name}
          <FolderTree parentId={folder._id} />
        </li>
      ))}
    </ul>
  );
}
```

### Version History Component

```typescript
function VersionHistory({ documentId }: { documentId: string }) {
  const { data: versions } = useObject('documentVersion', {
    filters: [['document', '=', documentId]],
    sort: 'version_number:desc'
  });

  const handleRestore = async (version) => {
    await client.object('document').update(documentId, {
      content: version.content,
      file_url: version.file_url,
      title: version.title
    });
  };

  return (
    <div>
      <h3>Version History</h3>
      {versions?.map(ver => (
        <div key={ver._id}>
          <strong>v{ver.version_number}</strong> - {ver.change_summary}
          <button onClick={() => handleRestore(ver)}>Restore</button>
        </div>
      ))}
    </div>
  );
}
```

## Common Use Cases

### Use Case 1: Company Wiki

```typescript
// Create wiki structure
const wikiRoot = await client.object('folder').create({
  name: 'Company Wiki',
  is_public: true
});

const departments = await client.object('folder').create({
  name: 'Departments',
  parent_folder: wikiRoot._id,
  is_public: true
});

// Create department-specific folders
const engineering = await client.object('folder').create({
  name: 'Engineering',
  parent_folder: departments._id,
  is_public: true
});

// Add wiki pages
await client.object('document').create({
  title: 'Engineering Onboarding',
  content: '# Welcome to Engineering...',
  folder: engineering._id,
  status: 'published',
  is_public: true,
  tags: 'onboarding,engineering,guide'
});
```

### Use Case 2: Project Documentation

```typescript
// Create project structure
const projects = await client.object('folder').create({
  name: 'Projects',
  is_public: false
});

const projectAlpha = await client.object('folder').create({
  name: 'Project Alpha',
  parent_folder: projects._id,
  is_public: false
});

// Create specification document
const spec = await client.object('document').create({
  title: 'Alpha Specification',
  description: 'Technical specification for Project Alpha',
  folder: projectAlpha._id,
  status: 'draft',
  tags: 'specification,alpha'
});
```

### Use Case 3: Knowledge Base with Versioning

```typescript
// Create KB article
const article = await client.object('document').create({
  title: 'How to Deploy',
  content: '# Deployment Guide\n\nSteps...',
  status: 'published',
  is_public: true,
  tags: 'deployment,guide,devops'
});

// Update article (version will be created automatically if hook is set up)
await client.object('document').update(article._id, {
  content: '# Deployment Guide (Updated)\n\nNew steps...',
  // Version auto-incremented by hook
});

// View history
const history = await client.object('documentVersion').find({
  filters: [['document', '=', article._id]],
  sort: 'version_number:desc'
});
```

## Troubleshooting

### Issue: Documents not appearing

**Solution:** Check folder filters and ensure `is_public` flag is set correctly.

```typescript
// Debug: List all documents regardless of folder
const allDocs = await client.object('document').find({});
console.log('Total documents:', allDocs.length);
```

### Issue: Version history not working

**Solution:** Ensure `beforeUpdate` hook is registered before ObjectQL starts.

### Issue: File uploads failing

**Solution:** Implement proper file storage first, then save file URLs to documents.

## Best Practices

1. **Folder Hierarchy**: Keep folder nesting to 3-4 levels max
2. **Tagging**: Use consistent tag naming (lowercase, hyphenated)
3. **Versioning**: Always version before major updates
4. **Status Workflow**: Enforce workflow in UI/hooks
5. **Access Control**: Set `is_public` based on sensitivity
6. **Search**: Index `title`, `content`, and `tags` fields
7. **Performance**: Use pagination for large document sets

## Next Steps

- Set up file storage integration (S3, etc.)
- Implement full-text search
- Add document permissions (field-level security)
- Create document templates
- Implement document approval workflow
- Add document sharing and collaboration features

## Additional Resources

- [Document Library Protocol](/spec/document-protocol.md)
- [ObjectQL Query Language](/spec/query-language.md)
- [Writing Hooks](/guide/logic-hooks.md)
- [Security Guide](/guide/security-guide.md)
