import { validateEmail, validatePassword } from '../../src/shared/utils/validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('debe validar emails correctos', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user@domain.co')).toBe(true);
    });

    it('debe rechazar emails inválidos', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('debe validar contraseñas correctas', () => {
      expect(validatePassword('SecurePass123')).toBe(true);
      expect(validatePassword('MyPassword2024')).toBe(true);
    });

    it('debe rechazar contraseñas inválidas', () => {
      expect(validatePassword('short')).toBe(false); // Muy corta
      expect(validatePassword('nouppercase123')).toBe(false); // Sin mayúscula
      expect(validatePassword('NOLOWERCASE123')).toBe(false); // Sin minúscula
      expect(validatePassword('NoNumbers')).toBe(false); // Sin números
    });
  });
});
