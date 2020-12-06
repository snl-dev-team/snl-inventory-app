const MATERIAL_COLUMNS = [
  { field: 'id', hide: true },
  { field: 'number', headerName: 'Number' },
  { field: 'name', headerName: 'Name' },
  { field: 'count', headerName: 'Count' },
  { field: 'price', headerName: 'Price', renderCell: (row) => `$${row.value / 10000}` },
  {
    field: 'expirationDate', headerName: 'Expiration Date', width: 150, type: 'date',
  },
  { field: 'units', headerName: 'Units', width: 75 },
  { field: 'vendorName', headerName: 'Vendor Name', width: 150 },
  { field: 'purchaseOrderNumber', headerName: 'PO Number', width: 100 },
  { field: 'purchaseOrderUrl', headerName: 'PO URL' },
  {
    field: 'dateModified', headerName: 'Date Modified', width: 200, type: 'dateTime',
  },
  {
    field: 'dateCreated', headerName: 'Date Created', width: 200, type: 'dateTime',
  },
];

const PRODUCT_COLUMNS = [
  { field: 'id', hide: true },
  { field: 'number', headerName: 'Number' },
  { field: 'name', headerName: 'Name' },
  { field: 'count', headerName: 'Count' },
  {
    field: 'expirationDate', headerName: 'Expiration Date', width: 150, type: 'date',
  },
  {
    // eslint-disable-next-line react/prop-types
    field: 'completed', headerName: 'Completed', width: 150,
  },
  {
    field: 'dateModified', headerName: 'Date Modified', width: 200, type: 'dateTime',
  },
  {
    field: 'dateCreated', headerName: 'Date Created', width: 200, type: 'dateTime',
  },
];

const PRODUCT_MATERIAL_COLUMNS = MATERIAL_COLUMNS.concat([{ field: 'countUsed', headerName: 'Count Used', width: 200 }]);

const CASE_COLUMNS = [
  { field: 'id', hide: true },
  { field: 'number', headerName: 'Number' },
  { field: 'name', headerName: 'Name' },
  { field: 'count', headerName: 'Count' },
  {
    field: 'expirationDate', headerName: 'Expiration Date', width: 150, type: 'date',
  },
  {
    field: 'dateModified', headerName: 'Date Modified', width: 200, type: 'dateTime',
  },
  {
    field: 'dateCreated', headerName: 'Date Created', width: 200, type: 'dateTime',
  },
];

const CASE_MATERIAL_COLUMNS = MATERIAL_COLUMNS.concat([{ field: 'countUsed', headerName: 'Count Used', width: 200 }]);
const CASE_PRODUCT_COLUMNS = MATERIAL_COLUMNS.concat([{ field: 'countUsed', headerName: 'Count Used', width: 200 }]);

const ORDER_COLUMNS = [
  { field: 'id', hide: true },
  { field: 'number', headerName: 'Number' },
  { field: 'customerName', headerName: 'Customer Name', width: 150 },
  {
    // eslint-disable-next-line react/prop-types
    field: 'completed', headerName: 'Completed', width: 150,
  },
  {
    field: 'dateModified', headerName: 'Date Modified', width: 200, type: 'dateTime',
  },
  {
    field: 'dateCreated', headerName: 'Date Created', width: 200, type: 'dateTime',
  },
];

const ORDER_CASE_COLUMNS = ORDER_COLUMNS.concat([
  { field: 'countUsed', headerName: 'Count Shipped', width: 200 },
  { field: 'orderCount', headerName: 'Order Count', width: 200 },
]);

export {
  MATERIAL_COLUMNS,
  PRODUCT_COLUMNS,
  PRODUCT_MATERIAL_COLUMNS,
  CASE_COLUMNS,
  CASE_MATERIAL_COLUMNS,
  CASE_PRODUCT_COLUMNS,
  ORDER_COLUMNS,
  ORDER_CASE_COLUMNS,
};
