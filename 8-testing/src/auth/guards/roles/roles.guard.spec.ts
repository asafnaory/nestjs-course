import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { RolesGuard } from './roles.guard';

const context: Partial<ExecutionContext> = {
  getHandler: jest.fn(),
  getClass: jest.fn(),
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest
      .fn()
      .mockReturnValue({ user: { role: [Role.BASIC] } }),
  }),
};

describe('AuthGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });
  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
  it('should return false when user does not have permissions', async () => {
    //Arrange
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce([Role.ADMIN]);

    //Act
    const returnValue = await guard.canActivate(context as ExecutionContext);

    //Assert
    expect(returnValue).toBe(false);
  });
  it('should return true when user does have permissions', async () => {
    //Arrange
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce([Role.BASIC]);

    //Act
    const returnValue = await guard.canActivate(context as ExecutionContext);

    //Assert
    expect(returnValue).toBe(true);
  });
});
