declare const window: any;

export const environment = {
  production: false,
  apiUrl: window.brandConfig?.app?.apiUrl || 'http://localhost:3000/api'
};
