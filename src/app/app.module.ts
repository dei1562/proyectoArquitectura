import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { TabsPage } from '../pages/tabs/tabs';
import { LavanderiaPage } from '../pages/lavanderia/lavanderia';
import { LavadoraFormPage } from '../pages/lavadora-form/lavadora-form';
import { ReservasPage } from '../pages/reservas/reservas';
import { ReservasFormModalPage } from '../pages/reservas-form-modal/reservas-form-modal';
import { UsuariosPage } from '../pages/usuarios/usuarios';
import { UsuariosFormModalPage } from '../pages/usuarios-form-modal/usuarios-form-modal';
import { UsuarioModalPage } from '../pages/usuario-modal/usuario-modal';

import { ImagePicker } from '@ionic-native/image-picker';

import { AuthService } from '../pages/core/auth.service';
import { UserService } from '../pages/core/user.service';
import { LavadoraProvider } from '../providers/lavadora/lavadora';

import { Firebase } from '@ionic-native/firebase';

import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environment/environment';

import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { ReservasProvider } from '../providers/reservas/reservas';
import { FcmProvider } from '../providers/fcm/fcm';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    TabsPage,
    LavanderiaPage,
    LavadoraFormPage,
    ReservasPage,
    ReservasFormModalPage,
    UsuariosPage,
    UsuariosFormModalPage,
    UsuarioModalPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    TabsPage,
    LavanderiaPage,
    LavadoraFormPage,
    ReservasPage,
    ReservasFormModalPage,
    UsuariosPage,
    UsuariosFormModalPage,
    UsuarioModalPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    GooglePlus,
    AuthService,
    TwitterConnect,
    ImagePicker,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LavadoraProvider,
    ReservasProvider,
    Firebase,
    FcmProvider,
  ]
})
export class AppModule {}
