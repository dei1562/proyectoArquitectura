import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { UserPage} from '../pages/user/user';
import { LavanderiaPage } from '../pages/lavanderia/lavanderia';
import { LavadoraFormPage } from '../pages/lavadora-form/lavadora-form';

import { AuthService } from '../pages/core/auth.service';
import { UserService } from '../pages/core/user.service';
import { LavadoraProvider } from '../providers/lavadora/lavadora';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environment/environment';

import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { UsuariosProvider } from '../providers/usuarios/usuarios';
import { ReservasProvider } from '../providers/reservas/reservas';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    UserPage,
    LavanderiaPage,
    LavadoraFormPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    UserPage,
    LavanderiaPage,
    LavadoraFormPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    GooglePlus,
    AuthService,
    TwitterConnect,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LavadoraProvider,
    UsuariosProvider,
    ReservasProvider
  ]
})
export class AppModule {}
