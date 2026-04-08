import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import { GameCollection } from './gameCollection.js';
import { Platform, Genre } from './types.js';

const collection = new GameCollection()

/**
 * Configuración de comandos de la aplicación mediante yargs
 */
yargs(hideBin(process.argv))
  .command('add', 'Adds a videogame to the collection', {
    user: { type: 'string', demandOption: true, describe: 'User name' },
    id: { type: 'number', demandOption: true, describe: 'Game ID' },
    name: { type: 'string', demandOption: true, describe: 'Game name' },
    desc: { type: 'string', demandOption: true, describe: 'Description' },
    platform: { choices: Object.values(Platform), demandOption: true, describe: 'Platform' },
    genre: { choices: Object.values(Genre), demandOption: true, describe: 'Genre' },
    developer: { type: 'string', demandOption: true, describe: 'Developer' },
    year: { type: 'number', demandOption: true, describe: 'Release year' },
    multiplayer: { type: 'boolean', demandOption: true, describe: 'Is multiplayer' },
    hours: { type: 'number', demandOption: true, describe: 'Estimated hours' },
    value: { type: 'number', demandOption: true, describe: 'Market value' }
  }, (argv) => {
    if (argv.year < 0 || argv.hours < 0 || argv.value < 0) {
      console.log(chalk.red("Error: Numerical values must be positive"))
      return
    }
    collection.addGame(argv.user, {
      id: argv.id,
      name: argv.name,
      description: argv.desc,
      platform: argv.platform as Platform,
      genre: argv.genre as Genre,
      developer: argv.developer,
      year: argv.year,
      multiplayer: argv.multiplayer,
      hours: argv.hours,
      value: argv.value
    })
  })
  .command('update', 'Updates an existing videogame', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true },
    name: { type: 'string', demandOption: true },
    desc: { type: 'string', demandOption: true },
    platform: { choices: Object.values(Platform), demandOption: true },
    genre: { choices: Object.values(Genre), demandOption: true },
    developer: { type: 'string', demandOption: true },
    year: { type: 'number', demandOption: true },
    multiplayer: { type: 'boolean', demandOption: true },
    hours: { type: 'number', demandOption: true },
    value: { type: 'number', demandOption: true }
  }, (argv) => {
    collection.updateGame(argv.user, {
      id: argv.id,
      name: argv.name,
      description: argv.desc,
      platform: argv.platform as Platform,
      genre: argv.genre as Genre,
      developer: argv.developer,
      year: argv.year,
      multiplayer: argv.multiplayer,
      hours: argv.hours,
      value: argv.value
    })
  })
  .command('remove', 'Removes a game', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true }
  }, (argv) => {
    collection.removeGame(argv.user, argv.id)
  })
  .command('list', 'Lists all games of a user', {
    user: { type: 'string', demandOption: true }
  }, (argv) => {
    collection.listGames(argv.user)
  })
  .command('read', 'Shows details of a specific game', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true }
  }, (argv) => {
    collection.readGame(argv.user, argv.id)
  })
  .help()
  .argv