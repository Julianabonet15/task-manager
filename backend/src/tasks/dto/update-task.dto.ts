export class UpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'not_started' | 'in_progress' | 'in_review' | 'done' | 'blocked';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  estimate?: number;
};