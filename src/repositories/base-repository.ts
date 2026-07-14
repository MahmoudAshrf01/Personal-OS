export interface Repository<T, CreateDTO, UpdateDTO = Partial<CreateDTO>> {
  getAll(): Promise<T[]>
  getById(id: string): Promise<T | undefined>
  create(data: CreateDTO): Promise<T>
  update(id: string, data: UpdateDTO): Promise<T>
  delete(id: string): Promise<void>
}
