import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_TOKEN } from '../database/database.module';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TasksRepository {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: any) {}

  findAll() {
    return this.db.prepare(`
      SELECT * FROM tasks WHERE parent_id IS NULL ORDER BY created_at DESC
    `).all();
  }

  findById(id: string) {
    return this.db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id);
}

  findChildren(parentId: string) {
    return this.db.prepare(`SELECT * FROM tasks WHERE parent_id = ?`).all(parentId);
  }

  findAll_flat() {
    return this.db.prepare(`SELECT * FROM tasks`).all();
  }

  create(dto: CreateTaskDto) {
    const now = new Date().toISOString();
    const id = uuidv4();
    this.db.prepare(`
      INSERT INTO tasks (id, title, description, status, priority, estimate, parent_id, created_at, updated_at)
      VALUES (@id, @title, @description, @status, @priority, @estimate, @parent_id, @created_at, @updated_at)
    `).run({
      id,
      title: dto.title,
      description: dto.description ?? null,
      status: dto.status ?? 'not_started',
      priority: dto.priority ?? 'medium',
      estimate: dto.estimate ?? null,
      parent_id: dto.parent_id ?? null,
      created_at: now,
      updated_at: now,
    });
    return this.findById(id);
  }

  update(id: string, dto: UpdateTaskDto) {
    const task = this.findById(id) as any;
    const now = new Date().toISOString();
    this.db.prepare(`
      UPDATE tasks SET
        title = @title,
        description = @description,
        status = @status,
        priority = @priority,
        estimate = @estimate,
        updated_at = @updated_at
      WHERE id = @id
    `).run({
      id,
      title: dto.title ?? task.title,
      description: dto.description ?? task.description,
      status: dto.status ?? task.status,
      priority: dto.priority ?? task.priority,
      estimate: dto.estimate !== undefined ? dto.estimate : task.estimate,
      updated_at: now,
    });
    return this.findById(id);
  }

  delete(id: string) {
    return this.db.prepare(`DELETE FROM tasks WHERE id = ?`).run(id);
  }
}