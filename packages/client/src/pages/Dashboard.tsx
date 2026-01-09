import { useState, useEffect } from 'react';
import { 
    SidebarProvider, 
    SidebarInset, 
    SidebarTrigger, 
    Separator,
    Spinner,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@objectql/ui';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../hooks/useRouter';
import { AppSidebar } from '../components/app-sidebar';
import { ObjectListView } from '../components/dashboard/ObjectListView';
import { ObjectDetailView } from '../components/dashboard/ObjectDetailView';
import { SettingsView } from '../components/dashboard/SettingsView';
import { getHeaders } from '../lib/api';

export default function Dashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [objects, setObjects] = useState<Record<string, any>>({});
    const { path, navigate } = useRouter();
    
    // Parse path
    // /object/project/123 -> parts ['', 'object', 'project', '123']
    const parts = path.split('/').filter(Boolean);
    const isSettings = path === '/settings';
    const isObjectView = parts[0] === 'object';
    const selectedObject = isObjectView ? parts[1] : null;
    const recordId = isObjectView ? parts[2] : null;

    useEffect(() => {
        if (user) {
            // Fetch objects
            fetch('/api/v6/metadata/object', { headers: getHeaders() })
                .then(res => res.json())
                .then(result => {
                    // Convert array to map
                    const objectsMap: Record<string, any> = {};
                    if (Array.isArray(result)) {
                        result.forEach((obj: any) => {
                            objectsMap[obj.name] = obj;
                        });
                    }
                    
                    const objNames = Object.keys(objectsMap);
                    setObjects(objectsMap);
                    
                    const currentPath = window.location.pathname;
                    if ((currentPath === '/' || currentPath === '/object') && objNames.length > 0) {
                        navigate(`/object/${objNames[0]}`);
                    }

                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch objects", err);
                    setLoading(false);
                });
        }
    }, [user]); // Run when user is available

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F7]">
                <Spinner className="w-6 h-6 text-gray-400" />
            </div>
        );
    }

    if (!user) return null;

    const currentSchema = selectedObject ? objects[selectedObject] : null;

    return (
        <SidebarProvider>
            <AppSidebar objects={objects} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            
                            {isSettings && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Settings</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            )}

                            {selectedObject && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); navigate(`/object/${selectedObject}`); }}>
                                            {currentSchema?.label || selectedObject}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            )}
                            
                            {recordId && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            {recordId === 'new' ? 'New Record' : 'Edit Record'}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="py-6">
                        {isSettings ? (
                            <SettingsView />
                        ) : isObjectView && selectedObject ? (
                            recordId && recordId !== 'new' ? (
                                <ObjectDetailView 
                                    objectName={selectedObject} 
                                    recordId={recordId} 
                                    navigate={navigate}
                                    objectSchema={objects[selectedObject]}
                                />
                            ) : (
                                <ObjectListView 
                                    objectName={selectedObject} 
                                    user={user}
                                    isCreating={recordId === 'new'}
                                    navigate={navigate}
                                    objectSchema={objects[selectedObject]}
                                />
                            )
                        ) : (
                            <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
                                Select a collection to view
                            </div>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
