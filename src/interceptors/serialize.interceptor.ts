import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToClass, plainToInstance } from 'class-transformer'
import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common'

interface ClassConstructor {
  new (...args: any[]): {}
}

export function Serialize (dto: ClassConstructor) {
  return UseInterceptors(new SerializationInterceptor(dto))
}

@Injectable()
export class SerializationInterceptor implements NestInterceptor {
  constructor (private dto: any) {}

  intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        // Transform the response data into an instance of the provided DTO
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, // Ensures only decorated properties are included
        })
      }),
    )
  }
}

