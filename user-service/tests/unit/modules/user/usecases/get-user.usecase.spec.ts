import { GetUserUseCase } from "@/modules/user/application/use-cases/get-user.usecase";
import { User } from "@/modules/user/domain/entities/user.entity";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    useCase = new GetUserUseCase(userRepository);
  });

  it('debe retornar el usuario por ID', async () => {
    const user = new User('uuid-123', 'Pedro', 'pedro@example.com', 'hashed123');
    userRepository.findById.mockResolvedValue(user);

    const result = await useCase.execute('uuid-123');

    expect(userRepository.findById).toHaveBeenCalledWith('uuid-123');
    expect(result).toEqual({
      id: 'uuid-123',
      name: 'Pedro',
      email: 'pedro@example.com',
    });
  });

  it('debe lanzar error si el usuario no existe', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalido')).rejects.toThrow('Usuario no encontrado');
  });
});