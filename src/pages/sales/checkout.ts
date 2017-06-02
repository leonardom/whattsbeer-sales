import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'sales-checkout',
  templateUrl: 'checkout.html'
})
export class SaleCheckoutPage {
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

  total: number = 0.0
  smallCoin: number = 0.0

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController, 
    private viewCtrl: ViewController,
    private db: AngularFireDatabase, 
    private currencyPipe: CurrencyPipe) {

  }

  ionViewDidLoad() {
    let items = this.navParams.get('items')
    this.total = this.navParams.get('total')
    console.log(items)
  }

  checkout() {
  }

  calculate(value) {    
    if (value > this.total) {
      this.smallCoin = value - this.total
    } else {
      this.smallCoin = 0.0
    }
  }

  payment() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Pagamento');

    this.paymentTypes.forEach(item => {
      alert.addInput({
        type: 'radio',
        label: item,
        value: item,
        checked: false
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

  paymentAmount(paymentType) {
    let prompt = this.alertCtrl.create({
      title: 'Pagamento',
      message: "Informe o valor pago em dinheiro",
      inputs: [
        {
          name: 'amount',
          placeholder: 'R$ 0,00'
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

  close() {
    this.viewCtrl.dismiss({ cancelled: true })
  }
}