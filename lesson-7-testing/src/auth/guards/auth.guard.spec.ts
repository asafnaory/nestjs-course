import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.gaurd';

describe('AuthGuard', () => {
  const context = {
    getHandler: () => {},
  } as ExecutionContext;

  let guard: AuthGuard;
  let reflector: Reflector;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, Reflector],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
  it('should return true if isPublic is set to true', () => {
    // Arrange
    reflector.get = jest.fn().mockReturnValueOnce(true);
    const canActivateSpy = jest.spyOn(guard, 'canActivate');

    // Act
    const res = guard.canActivate(context);
    // Assert
    expect(canActivateSpy).toBeCalledWith(context);
    expect(res).toBe(true);
  });

  it('should call passport guard if isPublic is set to false', () => {
    // Arrange
    reflector.get = jest.fn().mockReturnValueOnce(false);
    const superCanActivateSpy = jest
      .spyOn(AuthGuard.prototype, 'canActivate')
      .mockImplementationOnce((context) => true);

    // Act
    guard.canActivate(context);
    // Assert
    expect(superCanActivateSpy).toBeCalledWith(context);
  });
});
