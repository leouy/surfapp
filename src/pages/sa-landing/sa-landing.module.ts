import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { SALandingPage } from './sa-landing';

@NgModule({
  declarations: [
    SALandingPage,
  ],
  imports: [
    IonicPageModule.forChild(SALandingPage),
    TranslateModule.forChild()
  ],
  exports: [
    SALandingPage
  ]
})
export class SALandingPageModule { }
