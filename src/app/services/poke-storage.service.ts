import {Injectable} from "@angular/core";
import {NzNotificationService} from "ng-zorro-antd/notification";

const PokeStoragePokesCaughtKey = 'pokes-caught';
const PokeStoragePokesWishlistedKey = 'pokes-wishlisted';

export type PokeStorageKey = typeof PokeStoragePokesCaughtKey
  | typeof PokeStoragePokesWishlistedKey;

@Injectable({
  providedIn: 'root',
})
export class PokeStorageService {

  public readonly caughtPokesStorageKey: PokeStorageKey = 'pokes-caught';
  public readonly wishlistedPokesStorageKey: PokeStorageKey = 'pokes-wishlisted';

  constructor(
    private notifications: NzNotificationService,
  ) {
  }

  public addCaughtPoke(pokeName: string): void {
    if (this.getCaughtPokeNames().includes(pokeName)) {

      throw new Error(`Pokemon '${pokeName}' already caught`);
    }
    this.addCaughtPokeNoCheck(pokeName);
    this.notifications.success(`Caught a Pokemon`, `'${pokeName}' caught successfully`);
    if (this.getWishlistedPokeNames().includes(pokeName)) {
      this.removeWishlistedPokeNoCheck(pokeName);
    }
  }

  private addCaughtPokeNoCheck(pokeName: string): void {
    localStorage.setItem(
      PokeStoragePokesCaughtKey,
      this.serializePokes([...this.getCaughtPokeNames(), pokeName]),
    );
  }

  public removeCaughtPoke(pokeName: string): void {
    if (!this.getCaughtPokeNames().includes(pokeName)) {

      throw new Error(`Pokemon '${pokeName}' not caught yet`);
    }
    this.removeCaughtPokeNoCheck(pokeName);
    this.notifications.success(`Released a Pokemon`, `'${pokeName}' released successfully`);
  }

  private removeCaughtPokeNoCheck(pokeName: string): void {
    const caught = this.getCaughtPokeNames();
    caught.splice(caught.indexOf(pokeName), 1);
    localStorage.setItem(
      PokeStoragePokesCaughtKey,
      this.serializePokes(caught),
    );
  }

  public getCaughtPokeNames(): string[] {
    const item = localStorage.getItem(PokeStoragePokesCaughtKey);
    if (item) {
      return this.deserializePokes(item);
    }
    return [];
  }

  public addWishlistedPoke(pokeName: string): void {
    if (this.getWishlistedPokeNames().includes(pokeName)) {

      throw new Error(`Pokemon '${pokeName}' already caught`);
    }
    this.addWishlistedPokeNoCheck(pokeName);
    this.notifications.success(`Wishlisted a Pokemon`, `'${pokeName}' wishlisted successfully`);
  }

  private addWishlistedPokeNoCheck(pokeName: string): void {
    localStorage.setItem(
      PokeStoragePokesWishlistedKey,
      this.serializePokes([...this.getWishlistedPokeNames(), pokeName]),
    );
  }

  private removeWishlistedPokeNoCheck(pokeName: string): void {
    const caught = this.getWishlistedPokeNames();
    caught.splice(caught.indexOf(pokeName), 1);
    localStorage.setItem(
      PokeStoragePokesWishlistedKey,
      this.serializePokes(caught),
    );
  }

  public getWishlistedPokeNames(): string[] {
    const item = localStorage.getItem(PokeStoragePokesWishlistedKey);
    if (item) {
      return this.deserializePokes(item);
    }
    return [];
  }

  private serializePokes(pokeNames: string[]): string {
    return JSON.stringify(pokeNames);
  }

  private deserializePokes(pokeNamesString: string): string[] {
    return JSON.parse(pokeNamesString);
  }
}
