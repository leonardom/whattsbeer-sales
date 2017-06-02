import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'product-edit',
  templateUrl: 'edit.html'
})
export class ProductEditPage {
  selectedItem: any;
  items: FirebaseListObservable<any[]>;

  item = {
    $key: ''
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    db: AngularFireDatabase) {

    this.item = navParams.get('item');
    this.items = db.list('/items');
  }

  save(form) {
    this.items.update(this.item.$key, this.item);
    this.navCtrl.pop();
  }
}
