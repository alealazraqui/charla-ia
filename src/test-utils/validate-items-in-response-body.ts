import { validateAndTransformResponse } from './validate-and-transform-response';

export async function validateItemsInResponseBody(body: any[], dto: any): Promise<void> {
  for (const item of body) {
    const isValid = await validateAndTransformResponse(dto, item);
    expect(isValid).toBe(true);
  }
}
