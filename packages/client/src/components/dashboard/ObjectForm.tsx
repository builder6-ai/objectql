import { useState, useEffect } from 'react';
import { AutoForm, Spinner } from '@objectql/ui';

interface ObjectFormProps {
    objectName: string;
    initialValues: any;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    headers?: Record<string, string>;
}

export function ObjectForm({ objectName, initialValues, onSubmit, onCancel, headers }: ObjectFormProps) {
    const [schema, setSchema] = useState(null);
    
    useEffect(() => {
         fetch(`/api/object/_schema/object/${objectName}`, { headers })
            .then(res => res.json())
            .then(setSchema)
            .catch(console.error);
    }, [objectName, headers]);

    if (!schema) return <div className="p-8 flex justify-center"><Spinner className="w-6 h-6 text-gray-400" /></div>;

    return (
        <AutoForm 
            schema={schema}
            initialValues={initialValues}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
}
