import { instanceToPlain } from 'class-transformer';

export const serializeResponse = <T>(data: T): T => {
  const HIDDEN_KEYS = ['cause', 'status', 'response'];
  const SERIALIZED_KEYS = ['ok', 'httpStatus', 'name', 'message', 'reason', 'payload'];

  // class-transformer로 직렬화해서 @Exclude() 적용되게
  const plain = instanceToPlain(data);

  const serialized = Object.fromEntries(
    Object.entries(plain)
      .filter(([key]) => !HIDDEN_KEYS.includes(key))
      .sort((a, b) => {
        return SERIALIZED_KEYS.indexOf(a[0]) - SERIALIZED_KEYS.indexOf(b[0]);
      }),
  );
  return serialized as T;
};
