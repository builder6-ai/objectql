# @objectos/preset-documents

Document library preset for ObjectOS providing comprehensive document management capabilities.

## Features

- **Hierarchical Folder Structure**: Organize documents in nested folders
- **Version Control**: Track document versions with change history
- **Document Status Workflow**: Draft → Review → Published → Archived
- **Access Control**: Public/private documents and folders
- **Rich Metadata**: Tags, descriptions, file information

## Objects

### `folder`
Hierarchical folder structure for organizing documents.

**Key Fields:**
- `name`: Folder name
- `parent_folder`: Reference to parent folder (for hierarchy)
- `path`: Auto-generated full path
- `is_public`: Public/private flag

### `document`
Main document object with file and content support.

**Key Fields:**
- `title`: Document title
- `content`: Text content (for text documents)
- `file_url`: URL to uploaded file
- `folder`: Reference to containing folder
- `status`: draft | review | published | archived
- `version`: Current version number
- `tags`: Categorization tags

### `documentVersion`
Version history tracking for documents.

**Key Fields:**
- `document`: Reference to main document
- `version_number`: Version number
- `content`: Content snapshot
- `file_url`: File snapshot
- `change_summary`: Description of changes

## Usage

In your ObjectQL configuration:

```typescript
import { getAllObjectDefinitionPaths } from '@objectos/preset-documents';

// Get all object definition file paths
const documentObjectPaths = getAllObjectDefinitionPaths();
// Use these paths to load objects into ObjectQL
```

Or load individual objects:

```typescript
import { 
  getFolderObjectPath, 
  getDocumentObjectPath, 
  getDocumentVersionObjectPath 
} from '@objectos/preset-documents';

const folderPath = getFolderObjectPath();
const documentPath = getDocumentObjectPath();
const versionPath = getDocumentVersionObjectPath();
```

## Workflow

1. **Create Folders**: Organize your document structure
2. **Upload Documents**: Add documents to folders
3. **Version Control**: Updates create new versions automatically
4. **Publish**: Move documents through workflow states
5. **Access Control**: Set public/private flags as needed

## Integration

This preset integrates with:
- `@objectos/preset-base` (uses `user` object for ownership)
- File storage systems (via `file_url` field)
- Search and indexing services (via `tags` and `content`)
