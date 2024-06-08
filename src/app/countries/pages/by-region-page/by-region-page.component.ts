import { Component, OnInit } from '@angular/core';

import { Country } from '../../interfaces/country.interface';
import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/region.type';

@Component({
  selector: 'app-by-region-page',
  templateUrl: './by-region-page.component.html',
  styleUrl: './by-region-page.component.css'
})
export class ByRegionPageComponent implements OnInit {
  public countries: Country[] = [];
  // Optimizamos Regiones, solo mostrar las que se pueden buscar
  public regions: Region[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  public selectedRegion?: Region;
  public isLoading: boolean = false;

  constructor( private countriesService: CountriesService ) {}

  ngOnInit(): void {
   this.countries = this.countriesService.cacheStore.byRegion.countries;
   this.selectedRegion = this.countriesService.cacheStore.byRegion.region;
  }

  searchByRegion( region: Region ): void {
    //console.log('Desde ByCapitalPage');
    //console.log({ region });
    // Aca cargamos el loading
    this.isLoading = true;

    this.selectedRegion = region;

    this.countriesService.searchRegion( region )
      .subscribe( countries => {
        this.countries = countries;
        // Cuando se cargan los paises o se obtiene un arreglo vacio, ya se pasa a falso la carga del loading.
        this.isLoading = false;
      } )
  }
}
