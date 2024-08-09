import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import iconv from 'iconv-lite';
import { map } from 'rxjs/operators';

@Injectable()
export class NormalizeFilenameInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const files = request.files;
    const file = request.file;

    if (files) {
      files.forEach((file: Express.Multer.File) => {
        file.originalname = this.normalizeString(file.originalname);
      });
    }

    if (file) {
      file.originalname = this.normalizeString(file.originalname);
    }

    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }

  private normalizeString(fileName: string): string {
    const decodedString = iconv.decode(Buffer.from(fileName, 'latin1'), 'utf8');
    return decodedString;
  }
}
