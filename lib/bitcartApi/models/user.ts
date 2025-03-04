/**
 * Generated by orval v6.17.0 🍺
 * Do not edit manually.
 * BitcartCC
 * BitcartCC Merchants API
 * OpenAPI spec version: 0.7.4.1
 */
import type { UserMetadata } from './userMetadata';
import type { UserPreferences } from './userPreferences';

export interface User {
  metadata?: UserMetadata;
  created?: string;
  email: string;
  is_superuser?: boolean;
  settings?: UserPreferences;
  id?: string;
  password?: string;
  is_verified?: boolean;
  is_enabled?: boolean;
}
