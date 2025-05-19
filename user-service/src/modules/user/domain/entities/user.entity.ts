export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) {
    if (!email.includes('@')) {
      throw new Error('Formato de correo invalido');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener mínimo 6 caracteres');
    }
  }
}