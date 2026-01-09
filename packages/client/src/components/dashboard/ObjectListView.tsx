import { useState, useEffect } from 'react';
import { Button, Badge, Modal, Spinner, GridView } from '@objectql/ui';
import { ObjectForm } from './ObjectForm';
import { cn } from '../../lib/utils';
// import { useRouter } from ... passed as prop

interface ObjectListViewProps {
    objectName: string;
    user: any;
    isCreating: boolean;
    navigate: (path: string) => void;
    objectSchema: any;
}

export function ObjectListView({ objectName, user, isCreating, navigate, objectSchema }: ObjectListViewProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    
    const label = objectSchema?.label || objectSchema?.title || objectName;
    
    const getFieldLabel = (key: string) => {
        if (!objectSchema || !objectSchema.fields) return key;
        const field = objectSchema.fields[key];
        return field ? (field.label || field.title || key) : key;
    };

    const getFieldType = (key: string) => {
        if (!objectSchema || !objectSchema.fields) return 'text';
        const field = objectSchema.fields[key];
        if (!field) return 'text';
        
        if (field.type === 'boolean') return 'boolean';
        if (field.type === 'date' || field.type === 'datetime') return 'date';
        if (field.type === 'number' || field.type === 'integer' || field.type === 'float') return 'number';
        if (field.type === 'select' && field.options) return 'badge';
        return 'text';
    };

    const getHeaders = () => {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        headers['x-user-id'] = 'admin'; 
        return headers;
    };

    const fetchData = () => {
        if (!objectName) return;
        setLoading(true);
        setError(null);
        
        fetch(`/api/object/${objectName}`, { headers: getHeaders() })
            .then(async res => {
                if (!res.ok) {
                    const contentType = res.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        const json = await res.json();
                        throw new Error(json.error || "Failed to load data");
                    }
                    throw new Error(await res.text() || res.statusText);
                }
                return res.json();
            })
            .then(result => {
                const items = Array.isArray(result) ? result : (result.list || []);
                setData(items);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setData([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (user && objectName) fetchData();
    }, [objectName, user]);

    const handleCreate = (formData: any) => {
        fetch(`/api/object/${objectName}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(formData)
        })
        .then(async res => {
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        })
        .then(() => {
            navigate(`/object/${objectName}`);
            fetchData();
        })
        .catch(err => alert(err.message));
    }

    const handleCellEdit = (rowIndex: number, columnId: string, value: any) => {
        const row = data[rowIndex];
        const id = row.id || row._id;
        
        fetch(`/api/object/${objectName}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ ...row, [columnId]: value })
        })
        .then(async res => {
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        })
        .then(() => {
            const newData = [...data];
            newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
            setData(newData);
        })
        .catch(err => alert(err.message));
    };

    const handleDelete = (row: any, index?: number) => {
        if (!confirm('Are you sure you want to delete this record?')) return;
        const id = row.id || row._id;
        
        fetch(`/api/object/${objectName}/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        })
        .then(async res => {
            if (!res.ok) throw new Error(await res.text());
            fetchData(); 
        })
        .catch(err => alert(err.message));
    }

    const generateColumns = () => {
        if (!data || data.length === 0) return [];
        
        const sampleRow = data[0];
        return Object.keys(sampleRow)
            .filter(key => !['_id', '__v', 'createdAt', 'updatedAt'].includes(key))
            .map(key => {
                const field = objectSchema?.fields?.[key];
                const type = getFieldType(key);
                
                return {
                    id: key,
                    label: getFieldLabel(key),
                    type: type,
                    width: type === 'boolean' ? 80 : type === 'date' ? 150 : type === 'number' ? 120 : 200,
                    editable: !['id', 'createdBy', 'updatedBy'].includes(key),
                    ...(type === 'badge' && field?.options ? {
                        options: field.options.map((opt: string) => ({
                            value: opt,
                            label: opt,
                            variant: 'default'
                        }))
                    } : {})
                };
            });
    };

    const columns = generateColumns();

    return (
        <div className="flex flex-col h-full bg-stone-50">
             <div className="bg-white border-b border-stone-200">
                 <div className="px-6 py-4 flex justify-between items-center">
                     <div>
                         <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
                            <i className={`ri-${objectSchema?.icon || 'file-list-2-line'} text-xl text-stone-400`} />
                            {label}
                            <Badge className="ml-2">{data.length} records</Badge>
                         </h3>
                     </div>
                     <div className="flex items-center gap-2">
                         <div className="inline-flex rounded-lg border border-stone-200 bg-stone-50 p-1">
                             <button
                                 onClick={() => setViewMode('table')}
                                 className={cn(
                                     "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                     viewMode === 'table'
                                         ? 'bg-white text-stone-900 shadow-sm'
                                         : 'text-stone-600 hover:text-stone-900'
                                 )}
                             >
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                 </svg>
                             </button>
                             <button
                                 onClick={() => setViewMode('grid')}
                                 className={cn(
                                     "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                     viewMode === 'grid'
                                         ? 'bg-white text-stone-900 shadow-sm'
                                         : 'text-stone-600 hover:text-stone-900'
                                 )}
                             >
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                 </svg>
                             </button>
                         </div>
                         
                         <Button onClick={fetchData} variant="secondary" className="h-9 text-sm px-3">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                            Refresh
                         </Button>
                         <Button variant="secondary" className="h-9 text-sm px-3">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                            Filter
                         </Button>
                         <Button onClick={() => navigate(`/object/${objectName}/new`)} className="h-9 text-sm px-3">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            New Record
                         </Button>
                     </div>
                 </div>
             </div>
            
            <div className="flex-1 overflow-auto p-6 relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <Spinner className="w-6 h-6 text-blue-500" />
                    </div>
                )}
                
                {error ? (
                     <div className="flex flex-col items-center justify-center h-full text-red-500 p-8 text-center bg-white rounded-xl border border-stone-200">
                        <i className="ri-alert-line text-4xl mb-4 opacity-50 block" />
                        <p className="font-medium">Error loading data</p>
                        <p className="text-sm opacity-75 max-w-md break-words">{error}</p>
                        <Button onClick={fetchData} variant="secondary" className="mt-4">Try Again</Button>
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-stone-400 p-8 bg-white rounded-xl border border-stone-200">
                        <i className={`ri-${objectSchema?.icon || 'database-2-line'} text-6xl mb-4 opacity-50`} />
                        <p className="text-sm font-medium">No records found for {label}</p>
                        <Button onClick={() => navigate(`/object/${objectName}/new`)} variant="secondary" className="mt-4">
                            Create First Record
                        </Button>
                    </div>
                ) : viewMode === 'grid' && columns.length > 0 ? (
                    <GridView
                        columns={columns}
                        data={data}
                        onRowClick={(row: any) => navigate(`/object/${objectName}/${row.id || row._id}`)}
                        onCellEdit={handleCellEdit}
                        onDelete={handleDelete}
                        emptyMessage={`No ${label.toLowerCase()} found`}
                    />
                ) : (
                    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead className="bg-stone-50 sticky top-0 z-10">
                                <tr>
                                    {Object.keys(data[0] || {}).map(key => (
                                        <th key={key} className="px-6 py-3 font-semibold text-stone-600 border-b border-stone-200 whitespace-nowrap text-xs uppercase tracking-wider">
                                            {getFieldLabel(key)}
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 font-semibold text-stone-600 border-b border-stone-200 whitespace-nowrap text-xs uppercase tracking-wider text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {data.map((row, idx) => (
                                    <tr 
                                        key={idx} 
                                        onClick={() => navigate(`/object/${objectName}/${row.id || row._id}`)}
                                        className="hover:bg-stone-50 transition-colors group cursor-pointer"
                                    >
                                        {Object.keys(data[0] || {}).map(key => (
                                            <td key={key} className="px-6 py-3.5 text-stone-700 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis font-normal">
                                                {typeof row[key] === 'object' ? 
                                                    <span className="font-mono text-xs text-stone-400">{JSON.stringify(row[key])}</span> : 
                                                    String(row[key])
                                                }
                                            </td>
                                        ))}
                                        <td className="px-6 py-3.5 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => { e.stopPropagation(); navigate(`/object/${objectName}/${row.id || row._id}`); }} className="p-1 text-stone-400 hover:text-blue-600 transition-colors" title="View/Edit">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(row, idx); }} className="p-1 text-stone-400 hover:text-red-600 transition-colors" title="Delete">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal 
                isOpen={isCreating} 
                onClose={() => navigate(`/object/${objectName}`)} 
                title={`New ${label}`}
            >
                <ObjectForm 
                    objectName={objectName} 
                    initialValues={ {} }
                    headers={getHeaders()}
                    onSubmit={handleCreate} 
                    onCancel={() => navigate(`/object/${objectName}`)} 
                />
            </Modal>
        </div>
    );
}

