import { AuthenticateUserUseCase } from "@/modules/auth/application/use-cases/authenticate-user.usecase";
import { TokenBlacklistService } from "@/modules/auth/infrastructure/token-blacklist.service";
import { AuthController } from "@/modules/auth/presentation/controllers/auth.controller";

describe('AuthController', () => {
  let controller: AuthController;
  let authUseCase: jest.Mocked<AuthenticateUserUseCase>;
  let tokenBlacklistService: jest.Mocked<TokenBlacklistService>;

  beforeEach(() => {
    authUseCase = {
      execute: jest.fn(),
    } as any;

    tokenBlacklistService = {
      add: jest.fn(),
      has: jest.fn(),
    } as any;

    controller = new AuthController(authUseCase, tokenBlacklistService);
  });

  it('debe autenticar y retornar un token', async () => {
    const dto = { email: 'pedro@example.com', password: '123456' };
    const expected = {
      access_token: 'jwt.token.here',
      user: { id: 'uuid', name: 'Pedro', email: dto.email },
    };

    authUseCase.execute.mockResolvedValue(expected);

    const result = await controller.login(dto);

    expect(authUseCase.execute).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('debe agregar el token al blacklist al hacer logout', async () => {
    const req = {
      headers: { authorization: 'Bearer jwt.token.here' },
    } as any;

    const result = await controller.logout(req);

    expect(tokenBlacklistService.add).toHaveBeenCalledWith('jwt.token.here');
    expect(result).toEqual({ message: 'Sesión finalizada correctamente' });
  });
});