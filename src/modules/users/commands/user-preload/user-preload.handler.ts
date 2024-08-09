import { ErrorDetail, UploadExcelAndPreloadUsersDto } from '../../responses/user.response.dto';
import { UserRepository } from '../../repositories/user.repository';
import { UserPreloadCommand } from './user-preload.command.dto';
import * as XLSX from 'xlsx';
import { ProcessStateExcel } from '../../enums/process-state.excel.enum';
import { IRowFile } from '../../interfaces/row-file.interface';
import { User } from '../../entities/user.entity';
import { EMAIL_DOMAIN } from '../../constant/valid-email';
import { SUPPORTED_EXTENSIONS } from '../../constant/valid-extension';
import { EXPECTED_HEADERS } from '../../constant/valid-headers';
import { ConflictException, Logger } from '@nestjs/common';
import { TransactionalHandler } from 'typeorm-base-utils';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QueryBus } from '@cqrs';
import { Rol } from '@roles/entities/rol.entity';
import { GetAllRolesQuery } from '@roles/queries/get-all-roles/get-all-roles.query.dto';

@CommandHandler(UserPreloadCommand)
export class UserPreloadCommandHandler extends TransactionalHandler implements ICommandHandler<UserPreloadCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly queryBus: QueryBus,
  ) {
    super();
  }

  async execute(command: UserPreloadCommand): Promise<UploadExcelAndPreloadUsersDto> {
    try {
      return await this.transformCommand(command.file);
    } catch (error) {
      Logger.error(error.message);
      return {
        status: ProcessStateExcel.FAILED,
        errorDetails: [
          {
            errorMessage: error.message,
          },
        ],
      };
    }
  }

  private async transformCommand(file: Express.Multer.File): Promise<UploadExcelAndPreloadUsersDto> {
    this.validateFileExtension(file);
    const listObjectsEmailAndRolId = this.transformToJson(file);
    this.validateHeaders(listObjectsEmailAndRolId);

    const roles = await this.queryBus.execute<Rol[]>(new GetAllRolesQuery());

    const errorDetails: ErrorDetail[] = [];
    for (const object of listObjectsEmailAndRolId) {
      if (!object.email.includes(EMAIL_DOMAIN)) {
        errorDetails.push({
          email: object.email,
          errorMessage: 'Email domain not valid. Must be @jetsmart.com',
        });
      }
      const rol = roles.find((rol) => rol.id === object.rol_id);
      if (!rol) {
        errorDetails.push({
          email: object.email,
          errorMessage: 'Rol not found',
        });
      }
      if (rol && object.email.includes(EMAIL_DOMAIN)) {
        const user = new User();
        user.email = object.email;
        user.active = true;
        user.rol = rol;
        await this.userRepository.upsertUser(user);
      }
    }
    return {
      status: errorDetails.length > 0 ? ProcessStateExcel.SUCCESS_WITH_ERRORS : ProcessStateExcel.SUCCESS,
      errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
    };
  }

  private validateFileExtension(file: Express.Multer.File): void {
    const extension = file.originalname.split('.').pop();
    if (!extension || !SUPPORTED_EXTENSIONS.includes(extension.toLowerCase())) {
      throw new ConflictException('File extension not supported. Must be xlsx or xls');
    }
  }

  private transformToJson(file: Express.Multer.File): IRowFile[] {
    try {
      const workBook = XLSX.read(file.buffer, {
        type: 'buffer',
        cellDates: true,
        cellNF: false,
      });
      const workSheet = workBook.Sheets['Hoja1'];
      const listObjectsEmailAndRolId: IRowFile[] = XLSX.utils.sheet_to_json(workSheet);
      return listObjectsEmailAndRolId;
    } catch (e) {
      throw new ConflictException('Error reading file');
    }
  }

  private validateHeaders(data: IRowFile[]): void {
    const header = Object.keys(data[0]);
    for (const expectedHeader of EXPECTED_HEADERS) {
      if (!header.includes(expectedHeader)) {
        throw new ConflictException(`Expected header "${expectedHeader}" not found. Must be email and rol_id`);
      }
    }
  }
}
