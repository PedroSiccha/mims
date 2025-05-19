import { CreateUserUseCase } from "@/modules/user/application/use-cases/create-user.usecase";
import { User } from "@/modules/user/domain/entities/user.entity";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashed123')),
}));

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    };
    useCase = new CreateUserUseCase(userRepository);
  });

  it('debe crear un usuario cuando el email no existe', async () => {
    const input = {
      name: 'Pedro',
      email: 'pedro@example.com',
      password: '123456',
    };

    userRepository.findByEmail.mockResolvedValue(null);

    const createdUser = new User('uuid-123', input.name, input.email, 'hashed123');
    userRepository.create.mockResolvedValue(createdUser);

    const result = await useCase.execute(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: input.name,
        email: input.email,
        password: 'hashed123',
      }),
    );
    expect(result).toEqual({
      id: 'uuid-123',
      name: input.name,
      email: input.email,
    });
  });

  it('debe lanzar error si el usuario ya existe', async () => {
    userRepository.findByEmail.mockResolvedValue(
      new User('uuid-456', 'Pedro', 'pedro@example.com', 'hashed123')
    );

    await expect(
      useCase.execute({
        name: 'Pedro',
        email: 'pedro@example.com',
        password: '123456',
      }),
    ).rejects.toThrow('El usuario ya existe');
  });
});