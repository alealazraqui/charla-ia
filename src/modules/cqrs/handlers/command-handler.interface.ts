import { ICommandHandler as CqrsICommandHandler, ICommand } from '@nestjs/cqrs';

//esto parece al pedo pero es para encapsular la libreria hacia afuera

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICommandHandler<T extends ICommand> extends CqrsICommandHandler<T> {}
