import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
  {
    path: 'title',
    loadChildren: () => import('./pages/title/title.module').then(m => m.TitleModule)
  },
  {
    path: 'view-switcher',
    loadChildren: () => import('./pages/view-switcher/view-switcher.module').then(m => m.ViewSwitcherModule)
  },
  {
    path: 'forms',
    loadChildren: () => import('./pages/forms/forms.module').then(m => m.FormsModule)
  }

];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: false
    }),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    AppComponent,
    NavigationComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}