import { CommandHandler as CqrsCommandHandler, ICommand } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CommandHandler = (command: ICommand): ClassDecorator => {
  return CqrsCommandHandler(command);
};
