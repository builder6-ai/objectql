/**
 * Sectioned Form Example
 * 
 * This example demonstrates using FormSection to organize
 * form fields into logical groups.
 */

import React from 'react';
import { DynamicForm } from '@objectos/ui';
import type { ObjectConfig } from '@objectql/types';
import { User, Briefcase, Shield, Settings } from 'lucide-react';
import type { FormSectionConfig } from '@objectos/ui';

const employeeConfig: ObjectConfig = {
  name: 'employee',
  label: 'Employee',
  fields: {
    // Personal Info
    firstName: {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
    },
    lastName: {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
    },
    email: {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    phone: {
      name: 'phone',
      label: 'Phone',
      type: 'phone',
    },
    
    // Employment Info
    employeeId: {
      name: 'employeeId',
      label: 'Employee ID',
      type: 'text',
      required: true,
    },
    department: {
      name: 'department',
      label: 'Department',
      type: 'select',
      options: [
        { label: 'Engineering', value: 'engineering' },
        { label: 'Sales', value: 'sales' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'HR', value: 'hr' },
      ],
      required: true,
    },
    jobTitle: {
      name: 'jobTitle',
      label: 'Job Title',
      type: 'text',
      required: true,
    },
    startDate: {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
    },
    
    // Security
    username: {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      min_length: 3,
      max_length: 20,
    },
    password: {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      min_length: 8,
    },
    
    // Preferences
    timezone: {
      name: 'timezone',
      label: 'Timezone',
      type: 'select',
      options: [
        { label: 'UTC', value: 'UTC' },
        { label: 'EST', value: 'America/New_York' },
        { label: 'PST', value: 'America/Los_Angeles' },
      ],
    },
    language: {
      name: 'language',
      label: 'Language',
      type: 'select',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
        { label: 'French', value: 'fr' },
      ],
    },
  },
};

const sections: FormSectionConfig[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Basic employee details',
    icon: User,
    fields: ['firstName', 'lastName', 'email', 'phone'],
    collapsible: false,
  },
  {
    id: 'employment',
    title: 'Employment Details',
    description: 'Job and department information',
    icon: Briefcase,
    fields: ['employeeId', 'department', 'jobTitle', 'startDate'],
    collapsible: true,
    defaultCollapsed: false,
  },
  {
    id: 'security',
    title: 'Security Settings',
    description: 'Login credentials',
    icon: Shield,
    fields: ['username', 'password'],
    collapsible: true,
    defaultCollapsed: true,
    columns: 1,
  },
  {
    id: 'preferences',
    title: 'User Preferences',
    icon: Settings,
    fields: ['timezone', 'language'],
    collapsible: true,
    defaultCollapsed: true,
  },
];

export function SectionedFormExample() {
  const handleSubmit = async (data: any) => {
    console.log('Employee data:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Employee created!');
  };

  const handleCancel = () => {
    console.log('Cancelled');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">New Employee Registration</h1>
      
      <DynamicForm
        objectConfig={employeeConfig}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="Create Employee"
      />
    </div>
  );
}
