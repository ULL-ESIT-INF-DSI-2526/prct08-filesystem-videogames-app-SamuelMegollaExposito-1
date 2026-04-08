import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { Videogame } from './types.js';

/**
 * Clase que gestiona la colección de videojuegos usando el API de callbacks de Node.js
 */
export class GameCollection {
  private readonly basePath: string

  /**
   * Crea una instancia de la colección
   * @param customPath Ruta opcional para almacenar los datos (por defecto ./data)
   */
  constructor(customPath: string = './data') {
    this.basePath = customPath
    fs.access(this.basePath, (err) => {
      if (err) {
        fs.mkdir(this.basePath, { recursive: true }, (mkdirErr) => {
          if (mkdirErr) console.log(chalk.red("Error al crear directorio base"))
        })
      }
    })
  }

  /**
   * Asegura que el directorio del usuario existe antes de operar
   * @param user Nombre del usuario
   * @param callback Función a ejecutar cuando el directorio esté listo
   */
  private ensureUserDir(user: string, callback: (userPath: string) => void): void {
    const userPath = path.join(this.basePath, user);
    fs.access(userPath, (err) => {
      if (err) {
        fs.mkdir(userPath, { recursive: true }, (mkdirErr) => {
          if (!mkdirErr) callback(userPath);
        });
      } else {
        callback(userPath);
      }
    });
  }

  /**
   * Añade un videojuego a la colección del usuario
   * @param user Nombre del usuario
   * @param game Objeto con los datos del videojuego
   */
  public addGame(user: string, game: Videogame): void {
    this.ensureUserDir(user, (userPath) => {
      const filePath = path.join(userPath, `${game.id}.json`);
      
      // Comprobamos si el archivo ya existe
      fs.access(filePath, (err) => {
        if (!err) {
          console.log(chalk.red(`Videogame already exists at ${user} collection!`));
        } else {
          fs.writeFile(filePath, JSON.stringify(game, null, 2), (writeErr) => {
            if (writeErr) {
              console.log(chalk.red("Error al escribir el archivo"));
            } else {
              console.log(chalk.green(`New videogame added to ${user} collection!`));
            }
          });
        }
      });
    });
  }

  /**
   * Modifica un videojuego existente
   * @param user Nombre del usuario
   * @param game Datos actualizados del videojuego
   */
  public updateGame(user: string, game: Videogame): void {
    this.ensureUserDir(user, (userPath) => {
      const filePath = path.join(userPath, `${game.id}.json`);
      
      fs.access(filePath, (err) => {
        if (err) {
          console.log(chalk.red(`Videogame not found at ${user} collection!`));
        } else {
          fs.writeFile(filePath, JSON.stringify(game, null, 2), (writeErr) => {
            if (!writeErr) console.log(chalk.green(`Videogame updated at ${user} collection!`));
          });
        }
      });
    });
  }

  /**
   * Elimina un videojuego de la colección
   * @param user Nombre del usuario
   * @param id Identificador del videojuego
   */
  public removeGame(user: string, id: number): void {
    this.ensureUserDir(user, (userPath) => {
      const filePath = path.join(userPath, `${id}.json`);
      
      fs.access(filePath, (err) => {
        if (err) {
          console.log(chalk.red(`Videogame not found at ${user} collection!`));
        } else {
          fs.unlink(filePath, (unlinkErr) => {
            if (!unlinkErr) console.log(chalk.green(`Videogame removed from ${user} collection!`));
          });
        }
      });
    });
  }

  /**
   * Muestra la información de un videojuego concreto
   * @param user Nombre del usuario
   * @param id Identificador del videojuego
   */
  public readGame(user: string, id: number): void {
    this.ensureUserDir(user, (userPath) => {
      const filePath = path.join(userPath, `${id}.json`);
      
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.log(chalk.red(`Videogame not found at ${user} collection!`));
        } else {
          this.displayGame(JSON.parse(data));
        }
      });
    });
  }

  /**
   * Lista todos los videojuegos de un usuario
   * @param user Nombre del usuario
   */
  public listGames(user: string): void {
    this.ensureUserDir(user, (userPath) => {
      fs.readdir(userPath, (err, files) => {
        if (err || files.length === 0) {
          console.log(chalk.yellow(`${user} has no games in the collection`));
          return;
        }

        console.log(chalk.white(`${user} videogame collection`));
        files.forEach(file => {
          fs.readFile(path.join(userPath, file), 'utf-8', (readErr, data) => {
            if (!readErr) this.displayGame(JSON.parse(data));
          });
        });
      });
    });
  }

  /**
   * Devuelve el color correspondiente según el valor de mercado
   * @param value Valor numérico del mercado
   * @returns Función de chalk para aplicar color
   */
  private getValueColor(value: number) {
    if (value < 20) return chalk.red;
    if (value < 50) return chalk.yellow;
    if (value < 80) return chalk.blue;
    return chalk.green;
  }

  /**
   * Muestra la información formateada de un videojuego
   * @param game Objeto videojuego a mostrar
   */
  private displayGame(game: Videogame): void {
    const color = this.getValueColor(game.value);
    console.log(`--------------------------------`);
    console.log(`ID: ${game.id}`);
    console.log(`Name: ${game.name}`);
    console.log(`Description: ${game.description}`);
    console.log(`Platform: ${game.platform}`);
    console.log(`Genre: ${game.genre}`);
    console.log(`Developer: ${game.developer}`);
    console.log(`Year: ${game.year}`);
    console.log(`Multiplayer: ${game.multiplayer}`);
    console.log(`Estimated hours: ${game.hours}`);
    console.log(`Market value: ` + color(`${game.value}`));
  }
}