import { useState, useEffect, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { 
  ColDef, 
  GridReadyEvent,
  GridApi,
  ValueFormatterParams,
  ICellRendererParams
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { 
    Button, 
    Badge, 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    Spinner, 
    Input,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
    Checkbox
} from '@objectos/ui';
import { ObjectForm } from './ObjectForm';
import { Plus, RefreshCw, Grid, List as ListIcon, Filter, MoreHorizontal, FileText, Trash, Pencil } from 'lucide-react';

interface ObjectListViewProps {
    objectName: string;
    user: any;
    isCreating: boolean;
    navigate: (path: string) => void;
    objectSchema: any;
}

interface SortConfig {
    columnId: string;
    direction: 'asc' | 'desc';
}

// Custom checkbox cell renderer
const CheckboxCellRenderer = (props: ICellRendererParams) => {
    const onChange = (checked: boolean) => {
        props.node.setSelected(checked);
    };

    return (
        <div className="flex items-center justify-center h-full">
            <Checkbox
                checked={props.node.isSelected()}
                onCheckedChange={onChange}
                aria-label="Select row"
            />
        </div>
    );
};

// Header checkbox renderer
const HeaderCheckboxRenderer = (props: any) => {
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);

    useEffect(() => {
        const updateCheckboxState = () => {
            const selectedCount = props.api.getSelectedNodes().length;
            const totalCount = props.api.getDisplayedRowCount();
            setChecked(selectedCount === totalCount && totalCount > 0);
            setIndeterminate(selectedCount > 0 && selectedCount < totalCount);
        };

        props.api.addEventListener('selectionChanged', updateCheckboxState);
        return () => {
            props.api.removeEventListener('selectionChanged', updateCheckboxState);
        };
    }, [props.api]);

    const onChange = (value: boolean) => {
        if (value) {
            props.api.selectAll();
        } else {
            props.api.deselectAll();
        }
    };

    return (
        <div className="flex items-center justify-center h-full">
            <Checkbox
                checked={indeterminate ? "indeterminate" : checked}
                onCheckedChange={onChange}
                aria-label="Select all"
            />
        </div>
    );
};

// Actions cell renderer
const ActionsCellRenderer = (props: ICellRendererParams & { 
    onEdit: (id: string) => void; 
    onDelete: (id: string) => void;
}) => {
    const rowId = props.data.id || props.data._id;
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => props.onEdit(rowId)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => props.onDelete(rowId)}
                >
                    <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export function ObjectListViewAgGrid({ objectName, user, isCreating, navigate, objectSchema }: ObjectListViewProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [sortConfig] = useState<SortConfig[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const gridRef = useRef<AgGridReact>(null);
    
    const label = objectSchema?.label || objectSchema?.title || objectName;

    // Debounce search term
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);
    
    const getFieldLabel = (key: string) => {
        if (!objectSchema || !objectSchema.fields) return key;
        const field = objectSchema.fields[key];
        return field ? (field.label || field.title || key) : key;
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
        
        const params = new URLSearchParams();
        if (sortConfig.length > 0) {
             const sortParam = sortConfig.map(s => `${s.columnId}:${s.direction}`).join(',');
             params.append('sort', sortParam);
        }
        
        if (debouncedSearch) {
            const textFields = objectSchema?.fields ? 
                Object.entries(objectSchema.fields)
                    .filter(([_, field]: [string, any]) => !field.type || field.type === 'string')
                    .map(([key]) => key) 
                : ['name', 'title', 'description', 'email'];
                
            if (textFields.length > 0) {
                 const searchFilters: any[] = [];
                 textFields.forEach((field, index) => {
                     if (index > 0) searchFilters.push('or');
                     searchFilters.push([field, 'contains', debouncedSearch]);
                 });
                 params.append('filters', JSON.stringify(searchFilters));
            }
        }
        
        fetch(`/api/data/${objectName}?${params.toString()}`, { headers: getHeaders() })
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
        if (objectName) fetchData();
    }, [objectName, user, sortConfig, debouncedSearch]);

    const handleCreate = (formData: any) => {
        fetch(`/api/data/${objectName}`, {
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

    const handleDelete = (rowId: string) => {
        if (!confirm('Are you sure you want to delete this record?')) return;
        
        fetch(`/api/data/${objectName}/${rowId}`, {
            method: 'DELETE',
            headers: getHeaders()
        })
        .then(async res => {
            if (!res.ok) throw new Error(await res.text());
            fetchData(); 
        })
        .catch(err => alert(err.message));
    }

    const handleEdit = (rowId: string) => {
        navigate(`/object/${objectName}/${rowId}`);
    };

    const getColumns = (): ColDef[] => {
        let fields: string[] = [];
        if (objectSchema && objectSchema.fields) {
            fields = Object.keys(objectSchema.fields);
            if (!fields.includes('createdAt')) fields.push('createdAt');
            if (!fields.includes('updatedAt')) fields.push('updatedAt');
        } else if (data && data.length > 0) {
            fields = Object.keys(data[0]).filter(key => !['_id', '__v'].includes(key));
        }

        const columns: ColDef[] = [
            {
                field: 'select',
                headerName: '',
                width: 50,
                checkboxSelection: false,
                headerComponent: HeaderCheckboxRenderer,
                cellRenderer: CheckboxCellRenderer,
                suppressMenu: true,
                sortable: false,
                filter: false,
                pinned: 'left',
            }
        ];

        fields.forEach(field => {
            columns.push({
                field,
                headerName: getFieldLabel(field),
                sortable: true,
                filter: true,
                resizable: true,
                flex: 1,
                minWidth: 100,
                valueFormatter: (params: ValueFormatterParams) => {
                    if (params.value === null || params.value === undefined) return '';
                    if (typeof params.value === 'object') return JSON.stringify(params.value);
                    return String(params.value);
                }
            });
        });

        columns.push({
            field: 'actions',
            headerName: '',
            width: 80,
            cellRenderer: ActionsCellRenderer,
            cellRendererParams: {
                onEdit: handleEdit,
                onDelete: handleDelete,
            },
            suppressMenu: true,
            sortable: false,
            filter: false,
            pinned: 'right',
        });

        return columns;
    };

    const columnDefs = useMemo(() => getColumns(), [data, objectSchema]);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
    }), []);

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params.api);
    };

    const onQuickFilterChanged = () => {
        gridApi?.setQuickFilter(searchTerm);
    };

    useEffect(() => {
        if (gridApi) {
            onQuickFilterChanged();
        }
    }, [searchTerm, gridApi]);

    return (
        <div className="flex flex-col h-full bg-background">
             <div className="border-b bg-background">
                 <div className="px-6 py-4 flex justify-between items-center">
                     <div>
                         <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                             <FileText className="w-5 h-5 text-muted-foreground"/>
                            {label}
                            <Badge variant="secondary" className="ml-2">{data.length} records</Badge>
                         </h3>
                     </div>
                     <div className="flex items-center gap-2">
                         {showFilter && (
                             <div className="w-64 animate-in slide-in-from-right-2 fade-in duration-200">
                                 <Input 
                                     placeholder="Search..." 
                                     value={searchTerm}
                                     autoFocus
                                     onChange={(e) => setSearchTerm(e.target.value)}
                                     className="h-9"
                                 />
                             </div>
                         )}
                         <div className="flex items-center border rounded-md shadow-sm">
                             <Button
                                 variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                                 size="icon"
                                 className="h-8 w-8 rounded-none rounded-l-md"
                                 onClick={() => setViewMode('table')}
                             >
                                 <ListIcon className="h-4 w-4" />
                             </Button>
                             <Button
                                 variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                 size="icon"
                                 className="h-8 w-8 rounded-none rounded-r-md"
                                 onClick={() => setViewMode('grid')}
                             >
                                 <Grid className="h-4 w-4" />
                             </Button>
                         </div>
                         
                         <Button onClick={fetchData} variant="outline" size="sm" className="h-9">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                         </Button>
                         <Button 
                            variant={showFilter ? 'default' : 'outline'} 
                            size="sm"
                            className="h-9"
                            onClick={() => setShowFilter(!showFilter)}
                         >
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                         </Button>
                         <Button onClick={() => navigate(`/object/${objectName}/new`)} size="sm" className="h-9">
                            <Plus className="w-4 h-4 mr-2" />
                            New Record
                         </Button>
                     </div>
                 </div>
             </div>
            
            <div className="flex-1 overflow-auto p-6 relative">
                {error && (
                    <div className="mb-4 p-4 text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 z-50 bg-background/50 flex items-center justify-center pointer-events-none">
                        <Spinner className="w-8 h-8" />
                    </div>
                )}

                {data.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 rounded-xl border border-dashed">
                        <FileText className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-sm font-medium">No records found for {label}</p>
                        <Button onClick={() => navigate(`/object/${objectName}/new`)} variant="secondary" className="mt-4">
                            Create First Record
                        </Button>
                    </div>
                ) : (
                   viewMode === 'table' ? (
                       <div className="rounded-md border bg-card ag-theme-alpine" style={{ height: 'calc(100vh - 300px)', width: '100%' }}>
                           <AgGridReact
                               ref={gridRef}
                               rowData={data}
                               columnDefs={columnDefs}
                               defaultColDef={defaultColDef}
                               onGridReady={onGridReady}
                               rowSelection="multiple"
                               suppressRowClickSelection={true}
                               animateRows={true}
                               pagination={true}
                               paginationPageSize={50}
                               enableCellTextSelection={true}
                               getRowId={(params) => params.data.id || params.data._id}
                           />
                       </div>
                   ) : (
                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                           {data.map((row, i) => (
                               <div key={i} className="p-4 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/object/${objectName}/${row.id || row._id}`)}>
                                   <div className="font-semibold mb-2">{row.name || row.title || `Item ${i}`}</div>
                                   <div className="text-sm text-muted-foreground truncate">
                                       {Object.entries(row).slice(0, 3).map(([k, v]) => (
                                           <div key={k}>{k}: {String(v)}</div>
                                       ))}
                                   </div>
                               </div>
                           ))}
                       </div>
                   )
                )}
            </div>

            <Dialog 
                open={isCreating} 
                onOpenChange={(open) => !open && navigate(`/object/${objectName}`)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New {label}</DialogTitle>
                    </DialogHeader>
                    <ObjectForm 
                        objectName={objectName} 
                        initialValues={ {} }
                        headers={getHeaders()}
                        onSubmit={handleCreate} 
                        onCancel={() => navigate(`/object/${objectName}`)} 
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
