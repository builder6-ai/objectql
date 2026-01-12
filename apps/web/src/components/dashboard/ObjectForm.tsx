import { useState, useEffect } from 'react';
import { DynamicForm, Spinner } from '@objectos/ui';
import type { ObjectConfig } from '@objectql/types';

interface ObjectFormProps {
    objectName: string;
    initialValues: any;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    headers?: Record<string, string>;
}

export function ObjectForm({ objectName, initialValues, onSubmit, onCancel, headers }: ObjectFormProps) {
    const [schema, setSchema] = useState<ObjectConfig | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
         fetch(`/api/metadata/object/${objectName}`, { headers })
            .then(res => res.json())
            .then(res => {
                setSchema(res);
            })
            .catch(console.error);
    }, [objectName, headers]);

    if (!schema) return <div className="p-8 flex justify-center"><Spinner className="w-6 h-6" /></div>;

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DynamicForm
            objectConfig={schema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            submitText="Save"
            cancelText="Cancel"
            columns={2}
            realtimeValidation={false}
        />
    );
}
