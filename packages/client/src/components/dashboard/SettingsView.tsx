import { Card, Badge } from '@objectql/ui';

interface SettingsViewProps {
    objectCount: number;
}

export function SettingsView({ objectCount }: SettingsViewProps) {
    return (
        <div className="overflow-auto">
            <div className="p-8 max-w-4xl mx-auto animate-[fadeIn_0.3s_ease-out]">
                <h2 className="text-2xl font-bold text-stone-900 mb-6">Server Settings</h2>
                <Card title="About ObjectQL" description="System information and status.">
                    <div className="space-y-4">
                        <div className="flex justify-between py-2 border-b border-stone-100">
                            <span className="text-stone-600">Version</span>
                            <span className="font-medium text-stone-900">v0.2.0</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-stone-100">
                            <span className="text-stone-600">Environment</span>
                            <span className="font-medium text-stone-900">Development</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-stone-600">Collections</span>
                            <Badge variant="secondary">{objectCount}</Badge>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
