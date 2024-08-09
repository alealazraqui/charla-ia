import { IQueryHandler as CqrsIQueryHandler, IQuery } from '@nestjs/cqrs';

//esto parece al pedo pero es para encapsular la libreria hacia afuera

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IQueryHandler<T extends IQuery> extends CqrsIQueryHandler<T> {}
