import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
//import { SaleCheckoutPage } from './checkout';

@Component({
  selector: 'sales-items',
  templateUrl: 'items.html'
})
export class SaleItemsPage {
  loader: any;

  paymentTypes = [
    'Dinheiro',
    'Cartão Débito',
    'Cartão Crédito'
  ]

  basket = {
    items: [],
    total: 0.0
  }

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController, 
    private modalCtrl: ModalController,
    private db: AngularFireDatabase, 
    private currencyPipe: CurrencyPipe) {

    this.loadItems()
  }

  loadItems() {
    this.db.list('/items').subscribe(items => {
      items.forEach(item => {
        this.basket.items.push({
          id: item.$key,
          icon: item.icon,
          description: item.description,
          price: item.price, 
          qty: 0
        })
      })
    })
  }

  incTapped(item) {
    item.qty++
    this.updateTotal()
  }

  decTapped(item) {
    if (item.qty > 0) item.qty--
    this.updateTotal()
  }

  updateTotal() {
    this.basket.total = 0.0
    this.basket.items.forEach(item => {
      this.basket.total += item.price * item.qty
    })
  }

  checkout() {
    if (this.getTotalItems() == 0) {
      let alert = this.alertCtrl.create({
        title: 'Venda',
        subTitle: 'Nenhum item foi adicionado a venda!',
        buttons: ['OK']
      });
      alert.present();
      return
    }

    this.payment()

    /*
    let data = {
      items: this.basket.items.filter(item => item.qty > 0),
      total: this.basket.total
    }

    let modal = this.modalCtrl.create(SaleCheckoutPage, data)

    modal.onDidDismiss(data => {
      console.log(data)
    })
    modal.present()
    */
  }

  payment() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Pagamento');

    this.paymentTypes.forEach((item, index) => {
      alert.addInput({
        type: 'radio',
        label: item,
        value: item,
        checked: (index === 0)
      });
    })

    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Confirmar',
      handler: data => {
        if (data === undefined) {
          this.showAlert('Pagamento', 'Nenhuma forma de pagamento selecionada!')
          return
        } else if (data === 'Dinheiro') {
          this.paymentAmount(data)
        } else {
          this.save(data)
        }
      }
    });
    alert.present();
  }

  getTotalItems() {
    let qty = this.basket.items.reduce((acc, item) => {
      if (item.qty != NaN) {
        return acc + item.qty
      } else {
        return acc
      }
    }, 0)
    return qty
  }

  paymentAmount(paymentType) {
    let prompt = this.alertCtrl.create({
      title: 'Pagamento',
      message: "Informe o valor pago em dinheiro",
      inputs: [
        {
          name: 'amount',
          placeholder: 'R$ 0,00',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirmar',
          handler: data => {

            if (data.amount && data.amount > this.basket.total) {
              let diff = data.amount - this.basket.total
              this.showAlert(
                'Troco', 
                this.currencyPipe.transform(diff, 'brl', true, '.2-2' ),
                () => {
                  this.save(paymentType)
                })
            } else {
              this.save(paymentType)
            }            
          }
        }
      ]
    });
    prompt.present();
  }

  save(paymentType) {
    this.showLoading('Aguarde, salvando...')

    let date = new Date()

    let sale = {
      human_date: date.toJSON(),
      date: date.getTime(),
      paymentType,
      items: this.basket.items.filter(item => item.qty > 0),
      total: this.basket.total,
    }

    this.db.list('/sales').push(sale)
    this.clear()
    this.hideLoading()
  }

  clear() {
    this.basket = {
      items: [],
      total: 0.0
    }

    this.loadItems()
  }

  showAlert(title, message, action?) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            action && action()
          }
        },
      ]
    });
    alert.present();
  }

  showLoading(message) {
    this.loader = this.loadingCtrl.create({
      content: message,
      dismissOnPageChange: true
    });
    this.loader.present();
  }

  hideLoading() {
    this.loader.dismiss()
  }
}
