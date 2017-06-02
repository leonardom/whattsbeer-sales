import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ItemSliding } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ProductAddPage } from './add';
import { ProductEditPage } from './edit';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ProductsListPage {
  selectedItem: any;
  icons: string[];
  //items: Array<{title: string, note: string, icon: string}>;
  items: FirebaseListObservable<any[]>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    db: AngularFireDatabase) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = db.list('/items');
  }

  itemTapped(event, item) {
    this.navCtrl.push(ProductEditPage, {
      item: item
    });
  }

  addTapped(event) {
    this.navCtrl.push(ProductAddPage)
  }

  deleteTapped(item, slidingItem: ItemSliding)  {
    let alert = this.alertCtrl.create({
      title: 'Excluir',
      message: 'Você confirma exclusão do item',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            slidingItem.close();
          }
        },
        {
          text: 'Excluir',
          handler: () => {
            this.delete(item.$key);
            slidingItem.close();
          }
        }
      ]
    });
    alert.present();
  }

  delete(itemId) {
    this.items.remove(itemId);
  }
}
