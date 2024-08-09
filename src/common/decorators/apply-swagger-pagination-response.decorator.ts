import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ListResponseDto } from 'typeorm-base-utils';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ApplySwaggerPaginationResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
): MethodDecorator => // Specify the return type here
  applyDecorators(
    ApiExtraModels(ListResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ListResponseDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
