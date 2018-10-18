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

import { AuthService } from '../pages/core/auth.service';
import { UserService } from '../pages/core/user.service';
import { LavadoraProvider } from '../providers/lavadora/lavadora';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environment/environment';

import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { TwitterConnect } from '@ionic-native/twitter-connect';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    UserPage,
    LavanderiaPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    UserPage,
    LavanderiaPage
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
    LavadoraProvider
  ]
})
export class AppModule {}
