import { CreateUserUseCase } from "@/modules/user/application/use-cases/create-user.usecase";
import { GetUserUseCase } from "@/modules/user/application/use-cases/get-user.usecase";
import { UserController } from "@/modules/user/presentation/controllers/user.controller";

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let getUserUseCase: jest.Mocked<GetUserUseCase>;

  beforeEach(() => {
    createUserUseCase = {
      execute: jest.fn(),
    } as any;

    getUserUseCase = {
      execute: jest.fn(),
    } as any;

    controller = new UserController(createUserUseCase, getUserUseCase);
  });

  it('debe crear un nuevo usuario', async () => {
    const dto = {
      name: 'Pedro',
      email: 'pedro@example.com',
      password: '123456',
    };

    const expected = { id: 'uuid', name: dto.name, email: dto.email };

    createUserUseCase.execute.mockResolvedValue(expected);

    const result = await controller.create(dto);

    expect(createUserUseCase.execute).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('debe retornar el usuario autenticado', async () => {
    const user = { userId: 'uuid-123' };
    const expected = {
        id: 'uuid-123',
        name: 'Pedro',
        email: 'pedro@example.com',
    };

    getUserUseCase.execute.mockResolvedValue(expected);

    const result = await controller.getProfile(user);

    expect(getUserUseCase.execute).toHaveBeenCalledWith('uuid-123');
    expect(result).toEqual(expected);
    });
});