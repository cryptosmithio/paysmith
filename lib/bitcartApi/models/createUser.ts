/**
 * Generated by orval v6.17.0 🍺
 * Do not edit manually.
 * BitcartCC
 * BitcartCC Merchants API
 * OpenAPI spec version: 0.7.4.1
 */
import type { CreateUserMetadata } from './createUserMetadata';
import type { UserPreferences } from './userPreferences';

export interface CreateUser {
  metadata?: CreateUserMetadata;
  created?: string;
  email: string;
  is_superuser?: boolean;
  settings?: UserPreferences;
  password: string;
  captcha_code?: string;
  verify_url?: string;
}
