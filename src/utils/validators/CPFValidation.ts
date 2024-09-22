import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as CPF from 'cpf';

/**
 * Custom validator for Brazilian CPF (Cadastro de Pessoas Físicas).
 *
 * @description
 * This class implements ValidatorConstraintInterface to create a custom validator
 * for validating CPF numbers. It uses the CPF.isValid function from an external CPF
 * validation library. The class is annotated with the @ValidatorConstraint decorator
 * to integrate with NestJS's class-validator package.
 */
@ValidatorConstraint({ name: 'CPFValidation', async: false })
export class CPFValidation implements ValidatorConstraintInterface {
  /**
   * Validates a given text as a CPF number.
   *
   * @param {string} text - The text to validate as a CPF number.
   * @param {ValidationArguments} args - Additional validation arguments.
   * @returns {boolean} True if the text is a valid CPF number, false otherwise.
   *
   * @description
   * This method uses the CPF.isValid function from a CPF validation library to determine
   * if the provided text is a valid CPF number.
   */
  validate(text: string, args: ValidationArguments): boolean {
    return CPF.isValid(text);
  }

  /**
   * Provides a default error message for invalid CPF numbers.
   *
   * @param {ValidationArguments} args - Validation arguments including the actual input value.
   * @returns {string} The error message for invalid CPF input.
   *
   * @description
   * This method returns a default error message when the CPF validation fails,
   * indicating that the provided CPF is not valid.
   */
  defaultMessage(args: ValidationArguments): string {
    return `O CPF (${args.value}) não é valido!`;
  }
}
