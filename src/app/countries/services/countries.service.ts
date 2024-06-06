import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

import { Country } from '../interfaces/country';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1';

  constructor(private http: HttpClient) { }

  searchCapital( term: string ): Observable<Country[]>  {
    // Acá no se esta realizando la solicitud, para que se haga la solicitud se tiene que subscribir.
    // Acá se programa tambien la captura de errores o si no rtorna nada la consulta y se usa pipe.
    // pipe: metodo sobre el cual se pueden definir operadores de RxJS.
    const url = `${ this.apiUrl }/capital/${ term }`;

    // return this.http.get<Country[]>( url );

    // Ejemplo del pipe tap y map: se importan de: rxjs
    // El uso de map se usa para transformar lo que retorna
/*     return this.http.get<Country[]>( url )
      .pipe(
        tap( countries => console.log('Paso por el tap 1', countries) ),
        map( countries => []), // Me retorna un arreglo vacio
        tap( countries => console.log('Paso por el tap 2', countries) ), // Me muestra un arreglo vacio porque se modifico en el map.
      ); */

      //catchError: Atrapa un error, y aca vamos a retornar un observable con: of en este caso un arreglo vacio
      /* return this.http.get<Country[]>( url )
      .pipe(
        catchError( error => of([]) )
      ); */
      return this.http.get<Country[]>( url )
      .pipe(
        catchError( error => {
          console.log( 'Paso por catchError: ', error );

          return of([]);
        } )
      );
  }

}