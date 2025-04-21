
// Type definitions for the application

// User roles
export enum UserRole {
  DISTRIBUTOR = "distributor",
  CORPORATE = "corporate",
  ADMINISTRATOR = "administrator",
}

// Entity types
export enum EntityType {
  COMPANY = "company",
  HOSPITAL = "hospital",
  USER = "user",
  CONTACT = "contact",
  PHYSICIAN = "physician",
}

// Base type for all records
export interface Record {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

// User interface
export interface User extends Record {
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  points: number;
  following: string[]; // IDs of records being followed
}

// Company interface
export interface Company extends Record {
  name: string;
  industry?: string;
  website?: string;
  description?: string;
  logo?: string;
  linkedRecords?: LinkedRecord[];
  rating?: number;
}

// Hospital interface
export interface Hospital extends Record {
  name: string;
  type?: string;
  beds?: number;
  address?: string;
  website?: string;
  description?: string;
  linkedRecords?: LinkedRecord[];
  rating?: number;
}

// Contact interface (non-user)
export interface Contact extends Record {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  title?: string;
  company?: string;
  linkedRecords?: LinkedRecord[];
  rating?: number;
}

// Physician interface
export interface Physician extends Record {
  firstName: string;
  lastName: string;
  specialty?: string;
  hospitalAffiliation?: string;
  email?: string;
  phone?: string;
  linkedRecords?: LinkedRecord[];
  rating?: number;
}

// Comment interface
export interface Comment extends Record {
  content: string;
  recordId: string; // ID of the record being commented on
  recordType: EntityType;
  parentId?: string; // For threaded comments
  upvotes: string[]; // User IDs who upvoted
  downvotes: string[]; // User IDs who downvoted
  score: number; // Calculated from upvotes/downvotes
}

// Notification interface
export interface Notification extends Record {
  userId: string;
  read: boolean;
  type: 'update' | 'comment' | 'mention' | 'system';
  recordId: string;
  recordType: EntityType;
  message: string;
}

// Dashboard widget interface
export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  width: 'small' | 'medium' | 'large' | 'full';
  height: 'small' | 'medium' | 'large';
  settings: any;
  position: number;
}

// Custom field interface
export interface CustomField {
  id: string;
  entityType: EntityType;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect' | 'linkedRecord';
  required: boolean;
  options?: string[]; // For select/multiselect fields
  linkedEntityType?: EntityType; // For linkedRecord fields
}

// Linked record interface
export interface LinkedRecord {
  id: string;
  entityType: EntityType;
  entityId: string;
  relationshipType?: string;
}

// Rating interface
export interface Rating {
  id: string;
  entityId: string;
  entityType: EntityType;
  userId: string;
  score: number; // 1-5 stars
  timestamp: Date;
}

// Settings interface
export interface Settings {
  customFields: CustomField[];
  userRoles: {
    name: string;
    permissions: string[];
  }[];
  layoutSettings: {
    entityType: EntityType;
    listLayout: any;
    detailLayout: any;
  }[];
  pointsSystem: {
    newRecord: number;
    updateRecord: number;
    commentUpvote: number;
  };
  uiSettings: {
    primaryColor: string;
    logo: string;
    navbarPosition: 'top' | 'side';
  };
}

// CSV Import state
export interface CSVImport {
  data: any[];
  headers: string[];
  mappings: {
    csvHeader: string;
    fieldName: string;
  }[];
  entityType: EntityType;
  errors: any[];
  status: 'mapping' | 'validation' | 'importing' | 'complete' | 'error';
}
