/**
 * Repository Layer Base Interface
 * Provides standardized data access boundary separating database persistence logic
 * from domain services.
 */
export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findMany(): Promise<T[]>;
  create(entity: Partial<T>): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export abstract class BaseRepository<T extends { id: string }> implements IBaseRepository<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract findMany(): Promise<T[]>;
  abstract create(entity: Partial<T>): Promise<T>;
  abstract update(id: string, entity: Partial<T>): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
}
