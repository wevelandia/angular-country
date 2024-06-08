import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-by-capital-page',
  templateUrl: './by-capital-page.component.html',
  styleUrl: './by-capital-page.component.css'
})
export class ByCapitalPageComponent implements OnInit {

  public countries: Country[] = [];
  public isLoading: boolean = false;
  public initialValue: string = '';

  // El constructor esta diseñado para la inyección de dependencias.
  constructor( private countriesService: CountriesService ) {}

  // Aca vamos a tomar los paises del store y los cargamos en las variables para que cuando cambie de pagina me muestre los que habia buscado anteriormente.
  ngOnInit(): void {
    this.countries = this.countriesService.cacheStore.byCapital.countries;
    this.initialValue = this.countriesService.cacheStore.byCapital.term;
  }

  searchByCapital( term: string ): void {
    //console.log('Desde ByCapitalPage');
    //console.log({ term });
    // Aca cargamos el loading
    this.isLoading = true;

    this.countriesService.searchCapital( term )
      .subscribe( countries => {
        this.countries = countries;
        // Cuando se cargan los paises o se obtiene un arreglo vacio, ya se pasa a falso la carga del loading.
        this.isLoading = false;
      } )
  }

}
