import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control): ValidationErrors | null => {
  const group = control as FormGroup;
  const passwordControl = group.get('password');
  const confirmPasswordControl = group.get('confirmPassword');

  if (!passwordControl || !confirmPasswordControl) {
    return null;
  }

  if (confirmPasswordControl.value === '') {
    return null;
  }

  return passwordControl.value === confirmPasswordControl.value ? null : { passwordMismatch: true };
};