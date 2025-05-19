import { AuthenticateUserUseCase } from '@/modules/auth/application/use-cases/authenticate-user.usecase';
import { User } from '@/modules/user/domain/entities/user.entity';
import { UserRepository } from '@/modules/user/domain/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthenticateUserUseCase', () => {
  let useCase: AuthenticateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    } as any;

    useCase = new AuthenticateUserUseCase(userRepository, jwtService);
  });

  it('debe lanzar error si el usuario no existe', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: 'noexiste@example.com',
        password: '123456',
      }),
    ).rejects.toThrow('Credenciales inválidas');
  });

  it('debe lanzar error si la contraseña es incorrecta', async () => {
    const user = new User('uuid', 'Pedro', 'pedro@example.com', 'hashedPassword');
    userRepository.findByEmail.mockResolvedValue(user);

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(
      useCase.execute({
        email: user.email,
        password: 'wrongPassword',
      }),
    ).rejects.toThrow('Credenciales inválidas');
  });

  it('debe autenticar correctamente y devolver token', async () => {
    const user = new User('uuid', 'Pedro', 'pedro@example.com', 'hashedPassword');
    userRepository.findByEmail.mockResolvedValue(user);

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jwtService.sign.mockReturnValue('fake.jwt.token');

    const result = await useCase.execute({
      email: user.email,
      password: '123456',
    });

    expect(result).toEqual({
      access_token: 'fake.jwt.token',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
});