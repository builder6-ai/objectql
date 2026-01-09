import { useState, useEffect } from 'react';
import { Button, Modal, Spinner, AutoForm } from '@objectql/ui';
import { getHeaders } from '../../lib/api';

interface ObjectDetailViewProps {
    objectName: string;
    recordId: string;
    navigate: (path: string) => void;
    objectSchema: any;
}

export function ObjectDetailView({ objectName, recordId, navigate, objectSchema }: ObjectDetailViewProps) {
    const [data, setData] = useState<any>(null);
    const [schema, setSchema] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const label = objectSchema?.label || objectSchema?.title || objectName;

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch(`/api/object/${objectName}/${recordId}`, { headers: getHeaders() }).then(async r => {
                    if (!r.ok) throw new Error("Failed to load record");
                    return r.json();
            }),
            fetch(`/api/object/_schema/object/${objectName}`, { headers: getHeaders() }).then(r => r.json())
        ]).then(([record, schemaData]) => {
            setData(record);
            setSchema(schemaData);
        }).catch(console.error)
        .finally(() => setLoading(false));
    }, [objectName, recordId]);

    const handleDelete = () => {
            if (!confirm('Are you sure you want to delete this record?')) return;
            fetch(`/api/object/${objectName}/${recordId}`, {
            method: 'DELETE',
            headers: getHeaders()
        }).then(() => navigate(`/object/${objectName}`))
        .catch(e => alert(e.message));
    };
    
    const handleUpdate = (formData: any) => {
            fetch(`/api/object/${objectName}/${recordId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(formData)
        }).then(async res => {
            if(!res.ok) throw new Error(await res.text());
            return res.json();
        }).then(() => {
            setIsEditing(false);
            // Reload data
            fetch(`/api/object/${objectName}/${recordId}`, { headers: getHeaders() })
                .then(r => r.json())
                .then(setData);
        }).catch(e => alert(e.message));
    };

    if (loading) return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200/60 shadow-sm overflow-hidden p-8 items-center justify-center">
            <Spinner className="w-6 h-6 text-gray-400" />
        </div>
    );
    
    if (!data) return <div>Record not found</div>;

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200/60 shadow-sm overflow-hidden animate-[fadeIn_0.3s_ease-out]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(`/object/${objectName}`)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-medium tracking-wider mb-0.5">
                            {label}
                            <span className="text-gray-300">/</span>
                            <span className="text-gray-400">{recordId}</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">{data.name || data.title || recordId}</h1>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setIsEditing(true)} className="gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            Edit
                    </Button>
                    <Button variant="secondary" onClick={handleDelete} className="hover:bg-red-50 hover:text-red-600 gap-2 border-transparent">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Delete
                    </Button>
                </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-gray-50/50 p-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-4xl mx-auto">
                    {schema ? (
                        <AutoForm 
                            schema={schema} 
                            initialValues={data} 
                            readonly={true} 
                            onSubmit={() => {}}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            {Object.entries(data).map(([key, value]) => (
                                <div key={key} className="space-y-1.5 border-b border-gray-50 pb-2">
                                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">{key}</div>
                                    <div className="text-sm text-gray-900 font-medium break-words">
                                        {typeof value === 'object' ? JSON.stringify(value) : String(value ?? '-')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    </div>
                </div>

                {/* Edit Modal */}
                <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title={`Edit ${label}`}>
                    <AutoForm 
                        schema={schema}
                        initialValues={data}
                        onSubmit={handleUpdate}
                        onCancel={() => setIsEditing(false)}
                    />
                </Modal>
        </div>
    );
}
