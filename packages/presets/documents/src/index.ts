/**
 * @objectos/preset-documents
 * 
 * Document library preset for ObjectOS
 * Provides object definitions for document management including:
 * - Documents
 * - Folders (hierarchical organization)
 * - Document Versions (version control)
 */

import * as path from 'path';

export const DocumentLibraryPackage = {
    name: '@objectos/preset-documents',
    path: __dirname
};

/**
 * List of object definition files provided by this package
 */
export const objectDefinitions = [
    'folder.object.yml',
    'document.object.yml',
    'documentVersion.object.yml'
];

/**
 * Get the full path to an object definition file
 * @param filename The object definition filename
 * @returns Full path to the file
 */
export function getObjectDefinitionPath(filename: string): string {
    return path.join(__dirname, filename);
}

/**
 * Get all object definition paths
 * @returns Array of full paths to all object definition files
 */
export function getAllObjectDefinitionPaths(): string[] {
    return objectDefinitions.map(f => getObjectDefinitionPath(f));
}

/**
 * Get individual object definition paths
 */
export function getFolderObjectPath(): string {
    return getObjectDefinitionPath('folder.object.yml');
}

export function getDocumentObjectPath(): string {
    return getObjectDefinitionPath('document.object.yml');
}

export function getDocumentVersionObjectPath(): string {
    return getObjectDefinitionPath('documentVersion.object.yml');
}

