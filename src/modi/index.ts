import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { BackupManager } from './backupManager.js'

const manager = new BackupManager()

yargs(hideBin(process.argv))
  .command('backup', 'Crea una copia de seguridad de un directorio', {
    src: { type: 'string', demandOption: true, describe: 'Directorio origen' },
    dest: { type: 'string', demandOption: true, describe: 'Directorio de backups' }
  }, (argv) => {
    manager.createBackup(argv.src, argv.dest)
  })
  .command('list', 'Lista las copias de seguridad de un directorio', {
    dir: { type: 'string', demandOption: true, describe: 'Directorio de backups' }
  }, (argv) => {
    manager.listBackups(argv.dir)
  })
  .command('restore', 'Restaura una copia de seguridad concreta', {
    backup: { type: 'string', demandOption: true, describe: 'Ruta de la copia' },
    target: { type: 'string', demandOption: true, describe: 'Destino de restauración' }
  }, (argv) => {
    manager.restoreBackup(argv.backup, argv.target)
  })
  .help()
  .parse()