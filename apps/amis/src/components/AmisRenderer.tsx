import React from 'react';
import { render as amisRender } from 'amis';
import { useAuth } from '../context/AuthContext';
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';

interface AmisRendererProps {
  schema: any;
  data?: any;
}

const AmisRenderer: React.FC<AmisRendererProps> = ({ schema, data = {} }) => {
  const { user } = useAuth();

  // Enhanced data context with user info
  const contextData = {
    ...data,
    currentUser: user,
  };

  return (
    <div>
      {amisRender(schema, {
        data: contextData,
      })}
    </div>
  );
};

export default AmisRenderer;
