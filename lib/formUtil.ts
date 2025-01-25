import type { z } from 'zod';

export enum ServerFormStatus {
  INITIAL = 'INITIAL',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
export type ServerFormStateType = {
  message?: string;
  fields: Record<string, string>;
  errors: Record<string, string>;
  status: ServerFormStatus;
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
      status: result.success
        ? ServerFormStatus.SUCCESS
        : ServerFormStatus.ERROR,
    } as ServerFormStateType,
    parsedData: result.data,
  };
}
