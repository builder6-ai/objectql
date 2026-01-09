export const getHeaders = () => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    headers['x-user-id'] = 'admin'; 
    return headers;
};
