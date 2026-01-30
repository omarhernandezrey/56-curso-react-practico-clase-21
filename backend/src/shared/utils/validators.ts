export function hashPassword(password: string): Promise<string> {
  // Placeholder - será implementado con bcryptjs
  return Promise.resolve(password);
}

export function comparePasswords(password: string, hash: string): Promise<boolean> {
  // Placeholder - será implementado con bcryptjs
  return Promise.resolve(password === hash);
}

export function generateJWT(payload: Record<string, unknown>, secret: string, expiresIn: string): string {
  // Placeholder - será implementado con jsonwebtoken
  return 'placeholder-jwt-token';
}

export function verifyJWT(token: string, secret: string): Record<string, unknown> {
  // Placeholder - será implementado con jsonwebtoken
  return {};
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // Al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}
