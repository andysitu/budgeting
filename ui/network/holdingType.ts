import { sendRequest } from './util';

export interface HoldingType {
  id: number;
  name: string;
  description: string;
}

export interface HoldingTypeListItem extends HoldingType {
  hasHoldings: boolean;
}

export type HoldingTypeData = Omit<HoldingType, 'id'>;
export const fetchHoldingTypes = (): Promise<HoldingTypeListItem[]> =>
  sendRequest('/api/holding-types', 'GET');
export const createHoldingType = (
  data: HoldingTypeData,
): Promise<HoldingType> =>
  sendRequest('/api/holding-types', 'POST', { body: JSON.stringify(data) });
export const updateHoldingType = (
  id: number,
  data: HoldingTypeData,
): Promise<HoldingType> =>
  sendRequest(`/api/holding-types/${id}`, 'PUT', {
    body: JSON.stringify(data),
  });

export const deleteHoldingType = (id: number): Promise<void> =>
  sendRequest(`/api/holding-types/${id}`, 'DELETE');
