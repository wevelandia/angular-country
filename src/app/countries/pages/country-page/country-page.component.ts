import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountriesService } from '../../services/countries.service';
import { switchMap } from 'rxjs';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styleUrl: './country-page.component.css'
})
export class CountryPageComponent implements OnInit {

  // Este country es nulo al inicio, solo hasta cierto punto lo obtenemos.
  public country?: Country;

  // Aca debemos de obtener el URL y lo otro es navegar ala persona.
  // Se debe de valiar si la URL existe y si se carga algo sino se regresa a countries.
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private countriesService: CountriesService
  ) {}

  // params: tiene un tipo de dato Params, y no se requiere importar,
  // para referirno a ese parametro se hace asi: params['id']
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    // Los params tambien se pueden usar así:
    /* this.activatedRoute.params
      .subscribe( params => {
        console.log({ params: params['id'] });
      } ) */
        // Aca definimos un Observable dentro de otro Observable.
        /* this.activatedRoute.params
        .subscribe( ({ id }) => {
          //console.log({ params: id });
          // Definimos la nueva solicitud
          this.countriesService.searchCountryByAlphaCode( id )
            .subscribe( country => {
              console.log({ country });
            } );
        } ); */
    // Una manera para que solo se obtenga un Pais se realiza con los RxJS y switchMap.
    // switchMap: Recibe el valor anterior y el objetivo es regresar un nuevo observable para utilizarlo en el subscribe,
    // en este caso retorna un pais (country).
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.countriesService.searchCountryByAlphaCode( id )),
      )
      .subscribe( country => {
        //console.log({ country });
        // Si el País no existe lo enviamos a otra página.
        if ( !country ) { return this.router.navigateByUrl(''); }

        //console.log( 'Tenemos un País' );
        console.log( { country } );
        return this.country = country;
      });
  }

}
