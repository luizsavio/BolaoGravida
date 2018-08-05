import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsbolaoPage } from './tabsbolao';

@NgModule({
  declarations: [
    TabsbolaoPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsbolaoPage),
  ],
  exports: [
    TabsbolaoPage
  ]
})
export class TabsbolaoPageModule {}
