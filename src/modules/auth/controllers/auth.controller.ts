import { CommandBus, CqrsController, QueryBus } from '@cqrs';
import { Controller, Get, HttpStatus, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateTokenCommand } from '../commands/create-token/create-token.command.dto';
import { GetAzureUser } from '../decorators/get-azure-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController extends CqrsController {
  constructor(
    readonly queryBus: QueryBus,
    readonly commandBus: CommandBus,
    readonly configService: ConfigService,
  ) {
    super(queryBus, commandBus);
  }

  @Get('/login')
  @UseGuards(AuthGuard('azure'))
  async initiateLogin(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }

  @Get('/callback')
  @UseGuards(AuthGuard('azure'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async callback(@GetAzureUser() req: CreateTokenCommand, @Res() res: Response): Promise<void> {
    const command = new CreateTokenCommand();
    command.email = req.email;
    command.expiresIn = req.expiresIn;
    try {
      const accessToken = await this.commandBus.execute(command);
      res.redirect(`${this.configService.get<string>('FE_REDIRECT_URI')}?accessToken=${accessToken}`);
    } catch (error) {
      if (error.status === HttpStatus.UNAUTHORIZED) {
        res.redirect(`${this.configService.get<string>('FE_REDIRECT_URI')}?unauthorized=true`);
      } else {
        res.redirect(`${this.configService.get<string>('FE_REDIRECT_URI')}?error=true`);
      }
    }
  }
}
