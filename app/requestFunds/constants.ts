export const LinkExpiryValues = ['30', '60', '90', '180'] as const;
export const TrustPeriodValues = ['1', '8', '24', '48', '72', 'NONE'] as const;

export const LinkExpiryOptions = {
  items: LinkExpiryValues.map(value => ({
    value,
    label: `${value} minutes`,
  })),
};

export const TrustPeriodOptions = {
  items: TrustPeriodValues.map(value => ({
    value,
    label: value === 'NONE' ? 'No Limit' : value === '1' ? '1 hour' : `${value} hours`,
  })),
};
