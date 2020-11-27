export const DEV = 'http://localhost:8001';
export const PROD = 'https://dz12udpm05.execute-api.us-east-1.amazonaws.com/Stage';

export const URL = process.env.NODE_ENV === 'development' ? DEV : PROD;
