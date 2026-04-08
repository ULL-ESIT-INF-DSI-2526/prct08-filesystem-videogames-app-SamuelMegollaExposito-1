import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';

/**
 * Clase para gestionar copias de seguridad de directorios de manera sincrona
 */
export class BackupManager{

  /**
   * Genera un string con el tiempo actual en formato YYYYMMDD_HHMMSS
   * @returns El sufijo con la fecha y hora
   */
  private getTimestamp(): string {
      const now = new Date()
      const p = (n: number) => n.toString().padStart(2, '0')
      return `${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}_` + `${p(now.getHours())}${p(now.getMinutes())}${p(now.getSeconds())}`
  }

  /**
   * Crea una copia de seguridad de un directorio
   * @param sourceDir Directorio de origen de los ficheros
   * @param destParentDir Directorio donde se almacena las copias
   */
  public createBackup(sourceDir: string, destParentDir: string): void {
    try {
      if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
        throw new Error(`El origen no existe o no es un directorio: ${sourceDir}`)
      }
      const backupName = `${path.basename(path.resolve(sourceDir))}_${this.getTimestamp()}`
      const backupPath = path.join(destParentDir, backupName)

      if (!fs.existsSync(destParentDir)) {
        fs.mkdirSync(destParentDir, { recursive: true })
      }

      fs.mkdirSync(backupPath)
      fs.cpSync(sourceDir, backupPath, {recursive: true});

      console.log(chalk.green(`Copia de seguridad creada: ${backupName}`))
    } catch (err) {
      console.log(chalk.red(`Error al crear copia: ${(err as Error).message}`))
    }
  }

  /**
   * Lista las copias de seguridad de un directorio 
   * @param destParentDir Directorio que contiene las copias de seguridad
   */
  public listBackups(destParentDir: string): void {
    try {
      if (!fs.existsSync(destParentDir)) throw new Error("El directorio de copias no existe")

      const items = fs.readdirSync(destParentDir)
      const backups = items.map(name => {
        const fullPath = path.join(destParentDir, name)
        const stats = fs.statSync(fullPath)
        
        let totalSize = 0
        if (stats.isDirectory()) {
          fs.readdirSync(fullPath).forEach(f => {
            totalSize += fs.statSync(path.join(fullPath, f)).size
          })
        }

        return {
          name,
          size: totalSize,
          created: stats.birthtime 
        }
      })

      backups.sort((a, b) => b.created.getTime() - a.created.getTime())

      console.log(chalk.blue(`Listado de copias en ${destParentDir}:`))
      backups.forEach(b => {
        console.log(`- ${b.name} | Tamaño: ${b.size} bytes | Creado: ${b.created.toLocaleString()}`)
      })
    } catch (err) {
      console.log(chalk.red(`Error al listar: ${(err as Error).message}`))
    }
  }
  /**
   * Restaura el contenido de una copia en el directorio original
   * @param backupPath Ruta de la carpeta de la copia de seguridad
   * @param originalDir Directorio donde se restaurarán los ficheros
   */
  public restoreBackup(backupPath: string, originalDir: string): void {
    try {
      if (!fs.existsSync(backupPath)) throw new Error("La copia indicada no existe")

      if (fs.existsSync(originalDir) && fs.readdirSync(originalDir).length > 0) {
        console.log(chalk.yellow("Advertencia: El directorio de restauración no está vacio"))
      }

      if (!fs.existsSync(originalDir)) {
        fs.mkdirSync(originalDir, { recursive: true })
      }

      const files = fs.readdirSync(backupPath)
      fs.cpSync(backupPath, originalDir, {recursive: true});

      console.log(chalk.green(`Restauración completada, ficheros en ${originalDir}`))
    } catch (err) {
      console.log(chalk.red(`Error al restaurar: ${(err as Error).message}`))
    }
  }
};
