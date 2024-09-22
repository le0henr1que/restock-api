import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsEnum, RoleEnum } from '@prisma/client';
import { AssignmentPermission } from 'src/utils/constants';
import { EMAIL_TEST } from 'src/utils/test/constants';

import { AssignmentsGuard } from '../assignments.guard';

describe('AssignmentsGuard', () => {
  let guard: AssignmentsGuard;
  let reflector: Reflector;

  const generateMockExecutionContext = (userMock: {
    email: string;
    roles: RoleEnum[];
    assignments: {
      assignment: AssignmentsEnum;
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    }[];
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

  const updateReflector = (data: {
    assignments: AssignmentsEnum[];
    permissions: string[];
    requireAllPermissions: boolean;
  }) => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue({
      assignments: data.assignments,
      permissions: data.permissions,
      requireAllPermissions: data.requireAllPermissions,
    });
  };

  class MockController {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentsGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AssignmentsGuard>(AssignmentsGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  describe('Permission and Assignments', () => {
    it('Should return true when no assignments are defined', () => {
      updateReflector({
        assignments: [],
        permissions: [AssignmentPermission.CREATE, AssignmentPermission.UPDATE],
        requireAllPermissions: false,
      });

      const mockExecutionContext = generateMockExecutionContext({
        email: EMAIL_TEST,
        roles: [RoleEnum.USER],
        assignments: [
          {
            assignment: AssignmentsEnum.USER,
            create: true,
            read: false,
            update: true,
            delete: true,
          },
        ],
      });

      const result = guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBeTruthy();
    });

    it('Should return true when no permissions are defined', async () => {
      updateReflector({
        assignments: [AssignmentsEnum.USER],
        permissions: [],
        requireAllPermissions: false,
      });

      const mockExecutionContext = generateMockExecutionContext({
        email: EMAIL_TEST,
        roles: [RoleEnum.USER],
        assignments: [
          {
            assignment: AssignmentsEnum.USER,
            create: true,
            read: false,
            update: true,
            delete: true,
          },
        ],
      });

      const result = guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBeTruthy();
    });
  });

  describe('Role Permission', () => {
    it('Should return true when the user is admin and has no permission', () => {
      updateReflector({
        assignments: [AssignmentsEnum.USER],
        permissions: [AssignmentPermission.READ],
        requireAllPermissions: false,
      });

      const mockExecutionContext = generateMockExecutionContext({
        email: EMAIL_TEST,
        roles: [RoleEnum.ADMIN],
        assignments: [
          {
            assignment: AssignmentsEnum.USER,
            create: false,
            read: false,
            update: false,
            delete: false,
          },
        ],
      });

      const result = guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBeTruthy();
    });
  });

  describe('Unique permission', () => {
    it('Should return true when you have the correct permission', () => {
      updateReflector({
        assignments: [AssignmentsEnum.USER],
        permissions: [AssignmentPermission.READ],
        requireAllPermissions: false,
      });

      const mockExecutionContext = generateMockExecutionContext({
        email: EMAIL_TEST,
        roles: [RoleEnum.USER],
        assignments: [
          {
            assignment: AssignmentsEnum.USER,
            create: false,
            read: true,
            update: false,
            delete: false,
          },
        ],
      });

      const result = guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBeTruthy();
    });

    it('Should return true when you have one of the permission and all of them is not required', () => {
      updateReflector({
        assignments: [AssignmentsEnum.USER],
        permissions: [AssignmentPermission.CREATE, AssignmentPermission.UPDATE],
        requireAllPermissions: false,
      });

      const mockExecutionContext = generateMockExecutionContext({
        email: EMAIL_TEST,
        roles: [RoleEnum.USER],
        assignments: [
          {
            assignment: AssignmentsEnum.USER,
            create: true,
            read: false,
            update: false,
            delete: false,
          },
        ],
      });

      const result = guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBeTruthy();
    });

    it('Should throw error when you dont have the correct permission', () => {
      updateReflector({
        assignments: [AssignmentsEnum.USER],
        permissions: [AssignmentPermission.READ],
        requireAllPermissions: false,
      });

      const mockExecutionContext = generateMockExecutionContext({
        email: EMAIL_TEST,
        roles: [RoleEnum.USER],
        assignments: [
          {
            assignment: AssignmentsEnum.USER,
            create: true,
            read: false,
            update: true,
            delete: true,
          },
        ],
      });

      expect(() =>
        guard.canActivate(mockExecutionContext as ExecutionContext),
      ).toThrow(ForbiddenException);
    });
  });

  describe('Multiple permissions', () => {
    it('Should return true when user has all required permissions', () => {
      updateReflector({
        assignments: [AssignmentsEnum.USER],
        permissions: [AssignmentPermission.CREATE, AssignmentPermission.UPDATE],
        requireAllPermissions: true,
      });

      const mockExecutionContext = generateMockExecutionContext({
        email: EMAIL_TEST,
        roles: [RoleEnum.USER],
        assignments: [
          {
            assignment: AssignmentsEnum.USER,
            create: true,
            read: false,
            update: true,
            delete: false,
          },
        ],
      });

      const result = guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBeTruthy();
    });

    it('Should throw error when user doesnt has all required permissions', () => {
      updateReflector({
        assignments: [AssignmentsEnum.USER],
        permissions: [AssignmentPermission.CREATE, AssignmentPermission.UPDATE],
        requireAllPermissions: true,
      });

      const mockExecutionContext = generateMockExecutionContext({
        email: EMAIL_TEST,
        roles: [RoleEnum.USER],
        assignments: [
          {
            assignment: AssignmentsEnum.USER,
            create: false,
            read: false,
            update: true,
            delete: false,
          },
        ],
      });

      expect(() =>
        guard.canActivate(mockExecutionContext as ExecutionContext),
      ).toThrow(ForbiddenException);
    });
  });
});
