import { snapshotRepository } from '@/repositories/snapshot-repository'

export class SnapshotEngine {
  async capture(label: string) {
    return snapshotRepository.create(label)
  }

  async list() {
    return snapshotRepository.getAll()
  }

  async remove(id: string) {
    return snapshotRepository.delete(id)
  }
}

export const snapshotEngine = new SnapshotEngine()
