import type { z } from 'zod';

export type ServerFormStateType = {
  message: string;
  fields: Record<string, string>;
  errors: Record<string, string>;
  success: boolean;
  returnData?: Record<string, unknown>;
};

export function parseFormData<T extends z.ZodTypeAny>(
  prevState: ServerFormStateType,
  data: FormData,
  dataSchema: T
) {
  const formData = Object.fromEntries(data);
  const result = dataSchema.safeParse(formData) as z.infer<T>;
  const zodErrors = result.error?.flatten();
  const errors = zodErrors?.fieldErrors ?? {};

  return {
    nextState: {
      ...prevState,
      message: result.success ? 'Success' : 'Invalid data',
      fields: formData,
      errors: errors,
      success: result.success,
    } as ServerFormStateType,
    parsedData: result.data,
  };
}
