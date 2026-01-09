import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Label, Spinner } from '@objectql/ui';

interface ObjectFormProps {
    objectName: string;
    initialValues: any;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    headers?: Record<string, string>;
}

export function ObjectForm({ objectName, initialValues, onSubmit, onCancel, headers }: ObjectFormProps) {
    const [schema, setSchema] = useState<any>(null);
    const { register, handleSubmit, reset } = useForm({
        defaultValues: initialValues || {}
    });

    useEffect(() => {
         fetch(`/api/object/_schema/object/${objectName}`, { headers })
            .then(res => res.json())
            .then(res => {
                setSchema(res);
                if (initialValues) {
                    reset(initialValues);
                }
            })
            .catch(console.error);
    }, [objectName, headers, initialValues, reset]);

    if (!schema) return <div className="p-8 flex justify-center"><Spinner className="w-6 h-6" /></div>;

    const fields = Object.entries(schema.fields || {});

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fields.map(([key, field]: [string, any]) => {
                if (['id', '_id', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'].includes(key)) return null;
                
                return (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={key}>{field.label || field.title || key}</Label>
                        <Input 
                            id={key}
                            {...register(key, { required: !field.optional })} 
                            type={field.type === 'number' || field.type === 'integer' || field.type === 'float' ? 'number' : field.type === 'password' ? 'password' : 'text'}
                        />
                    </div>
                );
            })}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save</Button>
            </div>
        </form>
    );
}
