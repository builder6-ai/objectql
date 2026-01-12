/**
 * Conditional Form Example
 * 
 * This example demonstrates field dependencies and conditional visibility.
 * Fields appear/disappear based on other field values.
 */

import React from 'react';
import { DynamicForm } from '@objectos/ui';
import type { ObjectConfig } from '@objectql/types';
import type { FieldDependency } from '@objectos/ui';

const applicationConfig: ObjectConfig = {
  name: 'application',
  label: 'Job Application',
  fields: {
    // Basic Info
    fullName: {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      required: true,
    },
    email: {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    
    // Employment Status
    currentlyEmployed: {
      name: 'currentlyEmployed',
      label: 'Are you currently employed?',
      type: 'boolean',
    },
    currentEmployer: {
      name: 'currentEmployer',
      label: 'Current Employer',
      type: 'text',
    },
    currentJobTitle: {
      name: 'currentJobTitle',
      label: 'Current Job Title',
      type: 'text',
    },
    noticePeriod: {
      name: 'noticePeriod',
      label: 'Notice Period (days)',
      type: 'number',
      min: 0,
    },
    
    // Education
    highestDegree: {
      name: 'highestDegree',
      label: 'Highest Degree',
      type: 'select',
      options: [
        { label: 'High School', value: 'highschool' },
        { label: 'Bachelor\'s', value: 'bachelors' },
        { label: 'Master\'s', value: 'masters' },
        { label: 'PhD', value: 'phd' },
      ],
      required: true,
    },
    university: {
      name: 'university',
      label: 'University/College Name',
      type: 'text',
    },
    graduationYear: {
      name: 'graduationYear',
      label: 'Graduation Year',
      type: 'number',
      min: 1950,
      max: 2030,
    },
    
    // Relocation
    willingToRelocate: {
      name: 'willingToRelocate',
      label: 'Willing to relocate?',
      type: 'boolean',
    },
    preferredLocations: {
      name: 'preferredLocations',
      label: 'Preferred Locations',
      type: 'textarea',
      help_text: 'List cities you would consider',
    },
    
    // Sponsorship
    requiresSponsorship: {
      name: 'requiresSponsorship',
      label: 'Do you require visa sponsorship?',
      type: 'boolean',
    },
    visaType: {
      name: 'visaType',
      label: 'Current Visa Type',
      type: 'text',
    },
  },
};

const fieldDependencies: Record<string, FieldDependency> = {
  // Only show current employment fields if currently employed
  currentEmployer: {
    dependsOn: 'currentlyEmployed',
    condition: (value) => value === true,
  },
  currentJobTitle: {
    dependsOn: 'currentlyEmployed',
    condition: (value) => value === true,
  },
  noticePeriod: {
    dependsOn: 'currentlyEmployed',
    condition: (value) => value === true,
  },
  
  // Only show university/year for degree holders
  university: {
    dependsOn: 'highestDegree',
    condition: (value) => value && value !== 'highschool',
  },
  graduationYear: {
    dependsOn: 'highestDegree',
    condition: (value) => value && value !== 'highschool',
  },
  
  // Only show location preferences if willing to relocate
  preferredLocations: {
    dependsOn: 'willingToRelocate',
    condition: (value) => value === true,
  },
  
  // Only show visa type if requires sponsorship
  visaType: {
    dependsOn: 'requiresSponsorship',
    condition: (value) => value === true,
  },
};

export function ConditionalFormExample() {
  const handleSubmit = async (data: any) => {
    console.log('Application submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Application submitted successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Job Application Form</h1>
      <p className="text-muted-foreground mb-6">
        Notice how fields appear and disappear based on your answers!
      </p>
      
      <DynamicForm
        objectConfig={applicationConfig}
        fieldDependencies={fieldDependencies}
        onSubmit={handleSubmit}
        submitText="Submit Application"
        realtimeValidation={true}
        columns={2}
      />
    </div>
  );
}
