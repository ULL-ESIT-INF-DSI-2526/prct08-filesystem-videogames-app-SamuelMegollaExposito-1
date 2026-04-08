import { describe, test, expect, vi, beforeEach, afterAll } from 'vitest'
import { BackupManager } from '../src/p101/backupManager.js'
import fs from 'node:fs'
import path from 'node:path'

describe('BackupManager Tests', () => {
  const manager = new BackupManager()
  const testRoot = './temp_test_backup'
  const srcDir = path.join(testRoot, 'origen')
  const backupDir = path.join(testRoot, 'almacen')
  const restoreDir = path.join(testRoot, 'restauracion')

  beforeEach(() => {
    if (fs.existsSync(testRoot)) fs.rmSync(testRoot, { recursive: true, force: true })
    fs.mkdirSync(srcDir, { recursive: true })
    fs.writeFileSync(path.join(srcDir, 'file1.txt'), 'contenido 1')
    vi.restoreAllMocks()
  })

  afterAll(() => {
    if (fs.existsSync(testRoot)) fs.rmSync(testRoot, { recursive: true, force: true })
  })

  test('deberia crear una copia de seguridad con fecha y hora', () => {
    const logSpy = vi.spyOn(console, 'log')
    manager.createBackup(srcDir, backupDir)

    const backups = fs.readdirSync(backupDir)
    expect(backups.length).toBe(1)
    expect(backups[0]).toContain('origen_')
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Copia de seguridad creada'))
  })

  test('debera mostrar error si el directorio de origen no existe', () => {
    const logSpy = vi.spyOn(console, 'log')
    manager.createBackup('./no_existe', backupDir)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Error'))
  })
})