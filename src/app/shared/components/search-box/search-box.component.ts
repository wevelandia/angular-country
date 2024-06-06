import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent {

  @Input()
  public placeholder: string = '';

  // Creamos un EvenEmiter y el metodo emitValue recibe el texto digitado en el Input de busqueda.
  @Output()
  public onValue = new EventEmitter<string>();

  emitValue( value : string ): void {
    this.onValue.emit( value );
  }

}
