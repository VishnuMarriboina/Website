export type ItemStatusValue = 'active' | 'inactive' | 'draft' | 'archived';

export interface ItemStatusMap {
  ACTIVE:   'active';
  INACTIVE: 'inactive';
  DRAFT:    'draft';
  ARCHIVED: 'archived';
}

export interface ItemErrorMessages {
  ITEM_NOT_FOUND:   string;
  ITEM_NAME_EXISTS: string;
  INVALID_ID:       string;
  CREATE_FAILED:    string;
  UPDATE_FAILED:    string;
  DELETE_FAILED:    string;
}
