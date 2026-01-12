/**
 * Basic DynamicForm Example
 * 
 * This example demonstrates the simplest usage of DynamicForm
 * without sections or tabs.
 */

import React from 'react';
import { DynamicForm } from '@objectos/ui';
import type { ObjectConfig } from '@objectql/types';

const userConfig: ObjectConfig = {
  name: 'user',
  label: 'User',
  fields: {
    firstName: {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      max_length: 50,
    },
    lastName: {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      max_length: 50,
    },
    email: {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
    },
    phone: {
      name: 'phone',
      label: 'Phone Number',
      type: 'phone',
    },
    age: {
      name: 'age',
      label: 'Age',
      type: 'number',
      min: 18,
      max: 100,
    },
    bio: {
      name: 'bio',
      label: 'Biography',
      type: 'textarea',
      max_length: 500,
      help_text: 'Tell us about yourself',
    },
    newsletter: {
      name: 'newsletter',
      label: 'Subscribe to newsletter',
      type: 'boolean',
      defaultValue: true,
    },
  },
};

export function BasicDynamicFormExample() {
  const handleSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('User created successfully!');
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New User</h1>
      
      <DynamicForm
        objectConfig={userConfig}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="Create User"
        columns={2}
      />
    </div>
  );
}
