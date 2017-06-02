import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'product-add',
  templateUrl: 'add.html'
})
export class ProductAddPage {
  selectedItem: any;
  items: FirebaseListObservable<any[]>;

  item = {
    icon: 'beer',
    description: '',
    price: 0.0
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    db: AngularFireDatabase) {

    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.items = db.list('/items');
  }

  save(form) {
    this.items.push(this.item);
    this.navCtrl.pop();
  }
}
