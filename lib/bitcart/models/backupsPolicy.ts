/**
 * Generated by orval v6.17.0 🍺
 * Do not edit manually.
 * BitcartCC
 * BitcartCC Merchants API
 * OpenAPI spec version: 0.7.4.1
 */
import type { BackupsPolicyEnvironmentVariables } from './backupsPolicyEnvironmentVariables';

export interface BackupsPolicy {
  provider?: string;
  scheduled?: boolean;
  frequency?: string;
  environment_variables?: BackupsPolicyEnvironmentVariables;
}
