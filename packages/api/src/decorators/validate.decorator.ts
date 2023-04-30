import {
  BadRequestException,
  UsePipes,
  PipeTransform,
  Injectable,
} from '@nestjs/common';
import { ObjectSchema, ValidationErrorItem } from 'joi';

export interface ValidationError {
  message: string;
  property: string;
}

@Injectable()
export class SchemaValidatorPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: object): object {
    const { error } = this.schema.validate(value, {
      abortEarly: false,
    });

    if (error) {
      const details = this.mapValidationErrors(error.details);

      throw new BadRequestException({
        error: 'A validation error occurred',
        details,
      });
    }

    return value;
  }

  private mapValidationErrors(
    errors: ValidationErrorItem[]
  ): ValidationError[] {
    return errors.map((error) => ({
      message: error.message,
      property: error.context.key,
    }));
  }
}

/**
 * Validate the request against the given schema.
 *
 * @param schema The schema to validate against.
 * @returns The pipe to validate
 */
export const Validate = (schema: ObjectSchema) =>
  UsePipes(new SchemaValidatorPipe(schema));
