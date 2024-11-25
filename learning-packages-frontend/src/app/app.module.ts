import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PackageFormComponent } from './components/package-form/package-form.component';

@NgModule({
  declarations: [
    AppComponent,
    PackageFormComponent, // Declare the component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Add FormsModule for template-driven forms
  ],
  providers: [
    provideHttpClient(), // Use provideHttpClient here
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
