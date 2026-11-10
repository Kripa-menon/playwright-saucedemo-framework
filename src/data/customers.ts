export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const DEFAULT_CUSTOMER: CustomerInfo = {
  firstName: 'Test',
  lastName: 'Customer',
  postalCode: '682001',
};