import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Password {
  validate(password: string): string | null {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 7) {
      return 'Password must be at least 7 characters long';
    }
    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumber = false;
    let hasSpecial = false;

    for (let i = 0; i < password.length; i++) {
      const char = password[i];
      if (char >= 'A' && char <= 'Z') {
        hasUppercase = true;
      } else if (char >= 'a' && char <= 'z') {
        hasLowercase = true;
      } else if (char >= '0' && char <= '9') {
        hasNumber = true;
      } else {
        hasSpecial = true;
      }
    }

    if (!hasUppercase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowercase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecial) {
      return 'Password must contain at least one special character';
    }
    return null;
  }
}
