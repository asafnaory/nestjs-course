import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

const context: Partial<ExecutionContext> = {
  getHandler: jest.fn(),
};
describe('AuthGuard', () => {
  let guard: AuthGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    reflector = new Reflector();
    guard = new AuthGuard(reflector);
  });
  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when isPublic is true', async () => {
    //Arrange
    jest.spyOn(reflector, 'get').mockReturnValueOnce(true);

    //Act
    const returnValue = await guard.canActivate(context as ExecutionContext);

    //Assert
    expect(returnValue).toBe(true);
  });
});
