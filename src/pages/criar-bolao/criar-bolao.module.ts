import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CriarBolaoPage } from './criar-bolao';

@NgModule({
  declarations: [
    CriarBolaoPage,
  ],
  imports: [
    IonicPageModule.forChild(CriarBolaoPage),
  ],
  exports:[
    CriarBolaoPage
  ]
})
export class CriarBolaoPageModule {}
