import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  getAll() {
    return this.tasksRepository.findAll();
  }

  getById(id: string) {
    const task = this.tasksRepository.findById(id);
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return this.buildTree(id);
  }

  create(dto: CreateTaskDto) {
    return this.tasksRepository.create(dto);
  }

  update(id: string, dto: UpdateTaskDto) {
    const task = this.tasksRepository.findById(id);
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return this.tasksRepository.update(id, dto);
  }

  delete(id: string) {
    const task = this.tasksRepository.findById(id);
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return this.tasksRepository.delete(id);
  }

  getStats() {
  const all = this.tasksRepository.findAll_flat() as any[];

  return {
    notStarted: all.filter(t => t.status === 'not_started').length,
    inProgress: all.filter(t => t.status === 'in_progress').length,
    inReview: all.filter(t => t.status === 'in_review').length,
    done: all.filter(t => t.status === 'done').length,
    blocked: all.filter(t => t.status === 'blocked').length,
  };
}

  private buildTree(id: string): any {
    const task = this.tasksRepository.findById(id) as any;
    const children = this.tasksRepository.findChildren(id) as any[];
    task.subtasks = children.map(child => this.buildTree(child.id));
    return task;
  }
}