import type { z } from "zod";

export type FormServerStateType = {
  message: string;
  fields: Record<string, string>;
  errors: Record<string, string>;
  success: boolean;
};

export function parseFormData<T extends z.ZodTypeAny>(prevState: FormServerStateType, data: FormData, dataSchema: T) {
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
    } as FormServerStateType,
    parsedData: result.data as T,
  };
}
