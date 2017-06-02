import { CurrencyPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProductsListPage } from '../pages/products/list';
import { ProductAddPage } from '../pages/products/add';
import { ProductEditPage } from '../pages/products/edit';
import { SaleItemsPage } from '../pages/sales/items';
import { SaleCheckoutPage } from '../pages/sales/checkout';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireDatabaseModule } from 'angularfire2/database';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyCIJTxw5D_HlUmo2bNkOirGRbIL8mrjCNA",
  authDomain: "whattsbeer-sales-v1-f0b78.firebaseapp.com",
  databaseURL: "https://whattsbeer-sales-v1-f0b78.firebaseio.com",
  projectId: "whattsbeer-sales-v1-f0b78",
  storageBucket: "whattsbeer-sales-v1-f0b78.appspot.com",
  messagingSenderId: "292540710693"
};

import { ChartsModule } from 'ng2-charts/charts/charts';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProductsListPage,
    ProductAddPage,
    ProductEditPage,
    SaleItemsPage,
    SaleCheckoutPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProductsListPage,
    ProductAddPage,
    ProductEditPage,
    SaleItemsPage,
    SaleCheckoutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CurrencyPipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
