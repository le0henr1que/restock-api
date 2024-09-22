import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleEnum } from '@prisma/client';

import { RolesGuard } from '../roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  class MockController {}

  const generateMockExecutionContext = (userMock: {
    email: string;
    roles: RoleEnum[];
  }): Partial<ExecutionContext> => ({
    switchToHttp: () => ({
      getRequest: jest.fn(() => ({
        user: userMock,
      })) as any,
      getResponse: jest.fn(),
      getNext: jest.fn(),
    }),
    getHandler: jest.fn(),
    getClass: () => MockController as unknown as Type<any>,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('Should grant access when user has the required role', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue([RoleEnum.USER]);

    const mockExecutionContext = generateMockExecutionContext({
      email: 'user@example.com',
      roles: [RoleEnum.USER],
    });

    expect(
      guard.canActivate(mockExecutionContext as ExecutionContext),
    ).toBeTruthy();
  });

  it('Should throw error and deny access when user does not have the required role', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue([RoleEnum.ADMIN]);

    const mockExecutionContext = generateMockExecutionContext({
      email: 'user@example.com',
      roles: [RoleEnum.USER],
    });

    expect(() =>
      guard.canActivate(mockExecutionContext as ExecutionContext),
    ).toThrow(ForbiddenException);
  });

  it('Should grant access when user is an admin and dont have required roles', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue([RoleEnum.USER]);

    const mockExecutionContext = generateMockExecutionContext({
      email: 'admin@example.com',
      roles: [RoleEnum.ADMIN],
    });

    expect(
      guard.canActivate(mockExecutionContext as ExecutionContext),
    ).toBeTruthy();
  });
});
