import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, count, delay, map, of, tap } from 'rxjs';

import { Country } from '../interfaces/country.interface';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1';

  // Mentener la data entre pantallas, donde se almacena el termino por el que se realizó la busqueda y los paises que retorna.
  public cacheStore: CacheStore = {
    byCapital:   { term: '', countries: [] },
    byCountries: { term: '', countries: [] },
    byRegion:    { region: '', countries: [] }
  }

  constructor(private http: HttpClient) {
    // Cuando el servicio se cargue, realizamos el cargue de localSotore.
    this.loadFromLocalSotorage();
   }

  // Para mantener la informació en el LocalStore creamos dos nuevos metodos
  private saveToLocalStorage() {
    localStorage.setItem( 'cacheStore', JSON.stringify( this.cacheStore ));
  }

  private loadFromLocalSotorage() {
    if ( !localStorage.getItem( 'cacheStore' ) ) return;

    this.cacheStore = JSON.parse( localStorage.getItem( 'cacheStore' )! );
  }


  // Refactorizamos el código de: searchCapital, searchCountry, searchRegion y  y para ello creamos un nuevo metodo
  // Se coloca el delay de 2 segundos, para que muestre la información, no es el tiempo en que se emite el observable.
  // Aca podemos verificar la url si consulta por capital, por pais o por region pero esto genera más código y no es apropiado,
  // por ello se adiciona en cada uno de los metodos el pipe.
  private getCountriesRequest( url: string ): Observable<Country[]> {
    return this.http.get<Country[]>( url )
      .pipe(
        catchError( () => of([]) )
        //delay(2000) ya no se requiere despues de implementar el Debounce
      );
  }

  // searchCountryByAlphaCode: Me deberia de devolver un solo País, por ahora se dice que retorn aun Observable<Country[]>
  /* searchCountryByAlphaCode( code: string ): Observable<Country[]>  {
    const url = `${ this.apiUrl }/alpha/${ code }`;

    return this.http.get<Country[]>( url )
      .pipe(
        catchError( error => {
          console.log( 'Paso por catchError - Por un unico país ', error );

          return of([]);
        } )
      );
  } */

  // Aca vamos a regresar un solo Pais Observable<Country[]> del observable en country-page.component
  //searchCountryByAlphaCode( code: string ): Observable<Country[]>  {
  /* searchCountryByAlphaCode( code: string ): Observable<Country[]>  {
    const url = `${ this.apiUrl }/alpha/${ code }`;

    return this.http.get<Country[]>( url )
      .pipe(
        catchError( error => {
          console.log( 'Paso por catchError - Por un unico país ', error );

          return of([]);
        } )
      );
  } */

  // En este pipe, el map regresa un pais o regresa null.
  searchCountryByAlphaCode( code: string ): Observable<Country | null>  {
    const url = `${ this.apiUrl }/alpha/${ code }`;

    return this.http.get<Country[]>( url )
      .pipe(
        map( countries => countries.length > 0 ? countries[0]: null ),
        catchError( () => of(null))
      );
  }

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
      // Refactorizamos el siguiente código
      /* return this.http.get<Country[]>( url )
      .pipe(
        catchError( error => {
          console.log( 'Paso por catchError - Por Capital ' , error );

          return of([]);
        } )
      ); */
      // Aca puedo disparar de nuevo operadores de RxJS.
      //return this.getCountriesRequest( url );
      // getCountriesRequest: es un Observable y por ello aca se puede programar los pipe
      // Aca disparamos un efecto secundario con el operador tap, con ello mantendremos la palabra buscada y los paises que retorna.
      // Si tenemos una propiedad de un objeto que apunta a una varaible con el mismo nombre y
      // tiene el mismo nombre no es necesario colocarla, por ejemplo: { term: term, countries: countries } queda como { term, countries }
      // con tap lo que estamos es almacenando en el cache el termino y los paises que se consultaron, y luego se usan en el componente de by-capital
      // Esto: tap( () => this.saveToLocalStorage() ) se usa aca porque ya se sabe que termino han digitado
      return this.getCountriesRequest( url )
        .pipe(
          tap( countries => this.cacheStore.byCapital = { term: term, countries: countries } ),
          tap( () => this.saveToLocalStorage() )
        );
  }

  searchCountry( term: string ): Observable<Country[]>  {
    const url = `${ this.apiUrl }/name/${ term }`;
    // Refactorizamos esta parte de código
    /* return this.http.get<Country[]>( url )
      .pipe(
        catchError( error => {
          console.log( 'Paso por catchError - Por País ', error );

          return of([]);
        } )
      ); */

    return this.getCountriesRequest( url )
      .pipe(
        tap( countries => this.cacheStore.byCountries = { term: term, countries: countries } ),
        tap( () => this.saveToLocalStorage() )
      );
  }

  searchRegion( region: Region ): Observable<Country[]>  {
    const url = `${ this.apiUrl }/region/${ region }`;
    // Refactorizamos esta parte de código
    /* return this.http.get<Country[]>( url )
      .pipe(
        catchError( error => {
          console.log( 'Paso por catchError - Por Región ', error );

          return of([]);
        } )
      ); */

    return this.getCountriesRequest( url )
    .pipe(
      tap( countries => this.cacheStore.byRegion = { region: region, countries: countries } ),
      tap( () => this.saveToLocalStorage() )
    );
  }

}
