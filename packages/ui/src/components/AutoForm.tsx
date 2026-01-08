import * as React from "react"
import { useForm } from "react-hook-form"
import { Button } from "./Button"
import { Input } from "./Input"
import { Textarea } from "./Textarea"
import { Checkbox } from "./Checkbox"
import { Label } from "./Label"

export interface AutoFormProps {
    schema: any;
    initialValues?: any;
    onSubmit: (data: any) => void;
    onCancel?: () => void;
}

export function AutoForm({ schema, initialValues, onSubmit, onCancel }: AutoFormProps) {
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: initialValues || {}
    });

    const onFormSubmit = (data: any) => {
        onSubmit(data);
    };

    if (!schema || !schema.fields) return null;

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
            {Object.entries(schema.fields).map(([key, field]: [string, any]) => {
                if (['id', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'].includes(key)) return null;
                if (field.hidden) return null;

                const label = field.description || key;
                const fieldError = errors[key];

                if (field.type === 'boolean') {
                    return (
                        <div key={key} className="flex items-center space-x-2 p-1">
                             <Checkbox 
                                id={key}
                                checked={watch(key)}
                                onCheckedChange={(val) => setValue(key, val)}
                                disabled={field.readonly}
                             />
                             <Label htmlFor={key} className="cursor-pointer font-medium text-sm text-gray-700">{label}</Label>
                        </div>
                    );
                }

                if (field.type === 'text' || (field.type === 'string' && field.length > 255)) {
                    return (
                        <div key={key} className="space-y-1.5">
                            <Label htmlFor={key} className="font-semibold text-gray-500 text-xs uppercase tracking-wide">{label}</Label>
                            <Textarea 
                                id={key}
                                {...register(key, { required: field.required })}
                                placeholder={field.description}
                                className={fieldError ? "border-red-500 min-h-[100px]" : "min-h-[100px]"}
                            />
                            {fieldError && <p className="text-xs text-red-500">This field is required</p>}
                        </div>
                    );
                }

                 return (
                    <div key={key} className="space-y-1.5">
                        <Label htmlFor={key} className="font-semibold text-gray-500 text-xs uppercase tracking-wide">{label}</Label>
                        <Input 
                            id={key}
                            type={field.type === 'integer' || field.type === 'float' ? 'number' : 'text'}
                            {...register(key, { 
                                required: field.required,
                                valueAsNumber: field.type === 'integer' || field.type === 'float'
                            })}
                            placeholder={field.description}
                            className={fieldError ? "border-red-500" : ""}
                        />
                         {fieldError && <p className="text-xs text-red-500">This field is required</p>}
                    </div>
                );
            })}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                {onCancel && <Button variant="secondary" onClick={(e) => { e.preventDefault(); onCancel(); }} className="w-auto">Cancel</Button>}
                <Button type="submit" className="w-auto">Save Record</Button>
            </div>
        </form>
    );
}
