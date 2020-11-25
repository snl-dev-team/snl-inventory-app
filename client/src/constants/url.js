export const DEV = 'http://localhost:8001';
export const PROD = 'https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev';

export const URL = process.env.NODE_ENV === 'development' ? DEV : PROD;
