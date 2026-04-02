/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';

const mockRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findChildren: jest.fn(),
  findAll_flat: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  it('getAll() retorna todas las tareas raíz', () => {
    const tasks = [{ id: '1', title: 'Tarea 1' }];
    mockRepository.findAll.mockReturnValue(tasks);
    expect(service.getAll()).toEqual(tasks);
  });

  it('getById() lanza NotFoundException si no existe', () => {
    mockRepository.findById.mockReturnValue(undefined);
    expect(() => service.getById('id-inexistente')).toThrow(NotFoundException);
  });

  it('getById() retorna tarea con subtareas', () => {
    const task = { id: '1', title: 'Padre' };
    const child = { id: '2', title: 'Hijo' };
    mockRepository.findById.mockImplementation((id) =>
      id === '1' ? task : id === '2' ? child : undefined
    );
    mockRepository.findChildren.mockImplementation((id) =>
      id === '1' ? [child] : []
    );
    const result = service.getById('1') as any;
    expect(result.subtasks).toHaveLength(1);
    expect(result.subtasks[0].id).toBe('2');
  });

  it('create() llama al repository con los datos correctos', () => {
    const dto = { title: 'Nueva tarea' };
    const created = { id: '1', ...dto };
    mockRepository.create.mockReturnValue(created);
    expect(service.create(dto)).toEqual(created);
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
  });

  it('update() lanza NotFoundException si no existe', () => {
    mockRepository.findById.mockReturnValue(undefined);
    expect(() => service.update('id-inexistente', { title: 'x' })).toThrow(NotFoundException);
  });

  it('delete() lanza NotFoundException si no existe', () => {
    mockRepository.findById.mockReturnValue(undefined);
    expect(() => service.delete('id-inexistente')).toThrow(NotFoundException);
  });

 it('getStats() calcula correctamente', () => {
  mockRepository.findAll_flat.mockReturnValue([
    { status: 'not_started', estimate: 3 },
    { status: 'not_started', estimate: 2 },
    { status: 'in_progress', estimate: 5 },
    { status: 'in_review', estimate: 1 },
    { status: 'done', estimate: 1 },
    { status: 'blocked', estimate: 1 },
  ]);
  const stats = service.getStats();
  expect(stats.notStarted).toBe(2);
  expect(stats.inProgress).toBe(1);
  expect(stats.inReview).toBe(1);
  expect(stats.done).toBe(1);
  expect(stats.blocked).toBe(1);
});
});