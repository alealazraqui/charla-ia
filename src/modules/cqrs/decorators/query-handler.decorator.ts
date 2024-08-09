import { QueryHandler as CqrsQueryHandler, IQuery } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const QueryHandler = (query: IQuery): ClassDecorator => {
  return CqrsQueryHandler(query);
};
