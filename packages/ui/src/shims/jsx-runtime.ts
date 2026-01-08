// Shim for React JSX Runtime
const React = (window as any).React;

export const Fragment = React.Fragment;
export const jsx = React.createElement;
export const jsxs = React.createElement;
export const jsxDEV = React.createElement;
