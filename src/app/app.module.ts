import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
//import { AngularFireModule } from 'angularfire2';
//import { FIREBASE_CONFIG } from './firebase.credentials';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { FirestoreServiceProvider } from '../providers/firestore-service/firestore-service';
import { BolaoEditarPage } from '../pages/bolao-editar/bolao-editar';
import { BolaoPalpitePage } from '../pages/bolao-palpite/bolao-palpite';
import { BolaoInformacaoPage } from '../pages/bolao-informacao/bolao-informacao';
import { BolaoParticipantesPage } from '../pages/bolao-participantes/bolao-participantes';
//import { AngularFireAuth } from 'angularfire2/auth';
//import { AuthServiceFire2Provider } from '../providers/auth-service-fire2/auth-service-fire2';

//import { AuthProvider } from '../providers/auth/auth';
//import { AuthserviceProvider } from '../providers/authservice/authservice';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    /*ListaBolaoPage,
    CriarBolaoPage,
    PerfilPage,
    TabsbolaoPage,*/
    BolaoEditarPage,
    BolaoPalpitePage,
    BolaoInformacaoPage,
    BolaoParticipantesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: 'Voltar',
      iconMode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsPlacement: 'bottom',
      pageTransition: 'ios-transition',
      mode: 'ios'
    }),
    //IonicModule.forRoot(MyApp),
    //AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    /*ListaBolaoPage,
    CriarBolaoPage,
    PerfilPage,
    TabsbolaoPage,*/
    BolaoEditarPage,
    BolaoPalpitePage,
    BolaoInformacaoPage,
    BolaoParticipantesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    FirestoreServiceProvider,
    //AngularFireAuth,
    //AuthServiceFire2Provider
    /*AuthProvider,
    AuthServiceProvider,
    AuthserviceProvider,
    AuthServiceProvider*/
  ]
})
export class AppModule {}
