import { useState, useEffect } from 'react';
import { Spinner, Badge, Card } from '@objectql/ui';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../hooks/useRouter';
import { SidebarItem } from '../components/dashboard/SidebarItem';
import { ObjectListView } from '../components/dashboard/ObjectListView';
import { ObjectDetailView } from '../components/dashboard/ObjectDetailView';
import { SettingsView } from '../components/dashboard/SettingsView';
import { getHeaders } from '../lib/api';

export default function Dashboard() {
    const { user, signOut } = useAuth();
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
            fetch('/api/object/_schema/object', { headers: getHeaders() })
                .then(res => res.json())
                .then(result => {
                    const objNames = Object.keys(result);
                    setObjects(result);
                    
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

    if (!user) return null; // Should be handled by App.tsx redirect, but just in case

    return (
        <div className="flex h-screen overflow-hidden bg-stone-50">
            {/* Sidebar */}
            <aside className="w-[260px] bg-white border-r border-stone-200 flex flex-col justify-between pt-6 pb-6 shadow-sm z-20">
                    <div className="px-5 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-8 px-2 flex-shrink-0">
                        <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center shadow-md shadow-stone-900/20">
                            <i className="ri-database-2-fill text-white text-lg"></i>
                        </div>
                        <div>
                            <div className="text-[15px] font-bold tracking-tight text-stone-900 leading-none">ObjectQL</div>
                            <div className="text-[11px] text-stone-500 font-medium mt-0.5">Data Browser</div>
                        </div>
                    </div>

                    <div className="mb-2 px-2 flex-shrink-0">
                        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Collections</h3>
                    </div>
                    
                    <nav className="space-y-0.5 overflow-y-auto flex-1 -mx-2 px-2 no-scrollbar">
                        {Object.entries(objects).map(([name, schema]) => (
                            <SidebarItem 
                                key={name}
                                icon={({ className }) => <i className={`ri-${schema.icon || 'file-list-2-line'} text-lg ${className}`} />}
                                label={schema.label || schema.title || name}
                                active={!isSettings && selectedObject === name}
                                onClick={() => navigate(`/object/${name}`)}
                            />
                        ))}
                    </nav>

                    <div className="mt-4 pt-4 border-t border-stone-100 flex-shrink-0">
                            <SidebarItem 
                            icon={({ className }) => <i className={`ri-settings-3-line text-lg ${className}`} />}
                            label="Server Settings" 
                            active={isSettings} 
                            onClick={() => navigate('/settings')} 
                        />
                    </div>
                    </div>

                    <div className="px-5 mt-4 flex-shrink-0">
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl shadow-sm flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-stone-800 text-white flex items-center justify-center text-sm font-bold shadow-inner">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-stone-900 truncate">{user.name}</p>
                            <p className="text-xs text-stone-500 truncate">Administrator</p>
                        </div>
                        <button onClick={() => signOut()} className="text-stone-400 hover:text-red-500 transition-colors p-1" title="Sign Out">
                            <i className="ri-logout-box-r-line text-lg" />
                        </button>
                    </div>
                    </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col bg-stone-50">
                {!isSettings && selectedObject ? (
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
                ) : isSettings ? (
                    <SettingsView objectCount={Object.keys(objects).length} />
                ) : (
                    <div className="flex h-full items-center justify-center text-stone-400">
                        <div className="text-center">
                            <i className="ri-database-2-line text-6xl mb-4 opacity-50" />
                            <p className="text-sm">Select a collection to view data</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
