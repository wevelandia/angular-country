import { Component, OnInit } from '@angular/core';

import { Country } from '../../interfaces/country.interface';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-by-country-page',
  templateUrl: './by-country-page.component.html',
  styleUrl: './by-country-page.component.css'
})
export class ByCountryPageComponent implements OnInit {
  public countries: Country[] = [];
  public isLoading: boolean = false;
  public initialValue: string = '';

  constructor( private countriesService: CountriesService ) {}

  // Aca vamos a tomar los paises del store y los cargamos en las variables para que cuando cambie de pagina me muestre los que habia buscado anteriormente.
  ngOnInit(): void {
    this.countries = this.countriesService.cacheStore.byCountries.countries;
    this.initialValue = this.countriesService.cacheStore.byCountries.term;
  }

  searchByCountry( term: string ): void {
    //console.log('Desde ByCapitalPage');
    //console.log({ term });
    // Aca cargamos el loading
    this.isLoading = true;

    this.countriesService.searchCountry( term )
      .subscribe( countries => {
        this.countries = countries;
        // Cuando se cargan los paises o se obtiene un arreglo vacio, ya se pasa a falso la carga del loading.
        this.isLoading = false;
      } )
  }
}
