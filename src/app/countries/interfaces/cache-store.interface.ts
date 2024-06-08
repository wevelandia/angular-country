import { Country } from "./country.interface";
import { Region } from "./region.type";

export interface CacheStore {
  byCapital: TermCountries;
  byCountries: TermCountries;
  byRegion: RegionCountries;

}

export interface TermCountries {
  term: string;
  countries: Country[];
}

export interface RegionCountries {
  region: Region;  // Puede ser que no se halla seleccionado aun una Region, por ello en el type se colocal el vacio.
  countries: Country[];
}
