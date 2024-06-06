import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { AboutPageComponent } from './shared/pages/about-page/about-page.component';
import { ContactPageComponent } from './shared/pages/contact-page/contact-page.component';

// Esta es la definición de mis rutas.
// Se quita la palabra home para que se cargue en la url solo con el link inicial.
// Por ejemplo: http://localhost:4200 y no http://localhost:4200/home
/* Como Countries tiene su propio routing, aca es donde llamamos ese componente, y lo vamos
a cargar de forma perezosa loadChildren - LazyLoad. */
const routes: Routes = [
  // {
  //   path: '',
  //   component: HomePageComponent
  // },
  {
    path: 'about',
    component: AboutPageComponent
  },
  {
    path: 'contact',
    component: ContactPageComponent
  },
  {
    path: 'countries',
    loadChildren: () => import('./countries/countries.module').then( m => m.CountriesModule )
  },
  {
    path: '**',
    redirectTo: 'countries'
  }
];

// RouterModule.forRoot: Me indica que es el primer routes que se define, que es mi principal.
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
