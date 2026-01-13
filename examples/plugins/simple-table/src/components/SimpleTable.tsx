/**
 * SimpleTable Component
 * 
 * A basic table component with sorting and row click support.
 */

import React, { useMemo } from 'react';
import type { TableProps } from '@objectos/web-framework';
import type { SimpleTableConfig } from '../index';

export interface SimpleTableProps extends TableProps {
  config?: SimpleTableConfig;
}

export function SimpleTable(props: SimpleTableProps) {
  const { 
    data = [], 
    columns = [], 
    onRowClick, 
    onSort, 
    sorting,
    config = {}
  } = props;
  
  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sorting) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sorting.field];
      const bVal = b[sorting.field];
      const order = sorting.order === 'asc' ? 1 : -1;
      
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * order;
      }
      
      return (aVal < bVal ? -1 : 1) * order;
    });
  }, [data, sorting]);
  
  const handleHeaderClick = (field: string, sortable: boolean = true) => {
    if (!sortable || !onSort) return;
    
    const newOrder = sorting?.field === field && sorting.order === 'asc' 
      ? 'desc' 
      : 'asc';
      
    onSort({ field, order: newOrder });
  };
  
  const handleRowClick = (row: any, event: React.MouseEvent) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };
  
  // Build CSS classes
  const tableClasses = [
    'w-full border-collapse',
    config.bordered && 'border border-gray-300'
  ].filter(Boolean).join(' ');
  
  const headerClasses = 'px-4 py-2 text-left font-medium text-gray-700 bg-gray-50';
  
  const rowClasses = [
    'border-b border-gray-200',
    config.hoverable && 'hover:bg-gray-50',
    onRowClick && 'cursor-pointer'
  ].filter(Boolean).join(' ');
  
  const cellClasses = config.compact ? 'px-2 py-1' : 'px-4 py-2';
  
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available
      </div>
    );
  }
  
  return (
    <div className="overflow-auto">
      <table className={tableClasses}>
        <thead>
          <tr>
            {columns.map(col => {
              const sortable = col.sortable !== false;
              const isSorted = sorting?.field === col.field;
              
              return (
                <th 
                  key={col.id}
                  onClick={() => handleHeaderClick(col.field, sortable)}
                  className={`${headerClasses} ${sortable ? 'cursor-pointer select-none' : ''}`}
                  style={{ width: col.width }}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.label}</span>
                    {sortable && isSorted && (
                      <span className="text-xs">
                        {sorting?.order === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => {
            const isStriped = config.striped && idx % 2 === 1;
            
            return (
              <tr 
                key={row.id || idx}
                onClick={(e) => handleRowClick(row, e)}
                className={`${rowClasses} ${isStriped ? 'bg-gray-50' : ''}`}
              >
                {columns.map(col => {
                  const value = row[col.field];
                  const rendered = col.render ? col.render(value, row) : value;
                  
                  return (
                    <td key={col.id} className={cellClasses}>
                      {rendered}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
