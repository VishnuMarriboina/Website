export type RecordStatusValue = 'active' | 'inactive' | 'draft' | 'archived';

export interface RecordStatusMap {
  ACTIVE:   'active';
  INACTIVE: 'inactive';
  DRAFT:    'draft';
  ARCHIVED: 'archived';
}

export interface RecordErrorMessages {
  RECORD_NOT_FOUND: string;
  RECORD_EXISTS:    string;
  INVALID_ID:       string;
}
