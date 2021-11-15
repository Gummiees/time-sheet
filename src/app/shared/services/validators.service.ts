import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const passwordInput = control.get(passwordKey);
      const passwordConfirmationInput = control.get(passwordConfirmationKey);
      if (!passwordInput || !passwordConfirmationInput) {
        throw new Error('The controls for "checkIfMatchingPasswords" do not exist.');
      }
      if (passwordInput.value !== passwordConfirmationInput.value) {
        passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        passwordConfirmationInput.setErrors(null);
      }
      return {};
    };
  }

  exceedsTotal(currentControlKey: string, totalControlKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const currentInput = control.get(currentControlKey);
      const totalInput = control.get(totalControlKey);

      if (!currentInput || !totalInput) {
        throw new Error('The controls for "exceedsTotal" do not exist.');
      }

      if (totalInput.invalid || totalInput.value == null || totalInput.value == undefined) {
        currentInput.setErrors(null);
        return {};
      }

      if (isNaN(currentInput.value) || isNaN(totalInput.value)) {
        throw new Error('The controls for "exceedsTotal" are not numbers.');
      }

      if (currentInput.value > totalInput.value) {
        currentInput.setErrors({ exceedsTotal: true });
      } else {
        currentInput.setErrors(null);
      }
      return {};
    };
  }
}
