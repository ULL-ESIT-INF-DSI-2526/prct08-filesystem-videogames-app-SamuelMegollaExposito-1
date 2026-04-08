/**
 * Enumerado para las plataformas de videojuegos admitidas
 */
export enum Platform {
  PC = "PC",
  PS5 = "PlayStation 5",
  XBOX = "Xbox Series X/S",
  SWITCH = "Nintendo Switch",
  STEAM_DECK = "Steam Deck"
}

/**
 * Enumerado para los géneros de videojuegos admitidos
 */
export enum Genre {
  ACCION = "Acción",
  AVENTURA = "Aventura",
  ROL = "Rol",
  ESTRATEGIA = "Estrategia",
  DEPORTES = "Deportes",
  SIMULACION = "Simulación"
}

/**
 * Interfaz que define la estructura de un videojuego
 */
export interface Videogame {
  id: number
  name: string
  description: string
  platform: Platform
  genre: Genre
  developer: string
  year: number
  multiplayer: boolean
  hours: number
  value: number
}