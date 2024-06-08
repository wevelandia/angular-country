import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  // Creamos una propiedad para Debounce
  // Subject: Es un tipo especial de Observable
  private debouncer: Subject<string> = new Subject<string>;
  // Definimos una variable para manejar la subscripción independiente
  private debouncerSuscription?: Subscription;

  @Input()
  public placeholder: string = '';

  @Input()
  public initialValue: string = '';

  // Creamos un EvenEmiter y el metodo emitValue recibe el texto digitado en el Input de busqueda.
  @Output()
  public onValue = new EventEmitter<string>();

  @Output()
  public onDebounce = new EventEmitter<string>();



  ngOnInit(): void {
    // Aca el this.debouncer emite una llamada, luego pasa al pipe,
    // el pipe tiene un debounceTime y tiene que esperar un segundo de espera por otro valor,
    // si recibo otro valor espero otro segundo, si el usuario deja de digitar o mejor dicho
    // el observable (this.debouncer) no emite nada ahi le manda el valor al subscribe.
    this.debouncerSuscription = this.debouncer
      .pipe(
        debounceTime(300)
      )
      .subscribe( value => {
        //console.log('debouncer value', value);
        this.onDebounce.emit( value );
    });
  }

  // Esto es para destruir los subscribe excepto los de http (get, push, delete, ...),
  // porque se quedan escuchando por ejemplo el subscribe del Debounce se queda en memoria.
  ngOnDestroy(): void {
    // console.log( 'destruido' );
    this.debouncerSuscription?.unsubscribe();
  }

  emitValue( value : string ): void {
    this.onValue.emit( value );
  }

  // Definiendo este metodo para el Debounce
  onKeyPress( searchTerm: string ) {
    //console.log( {searchTerm} );
    // next: hace la siguiente emision del observable.
    this.debouncer.next( searchTerm );
  }

}
