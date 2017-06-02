import { Component, ViewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NavController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';

//import * as moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('doughnutCanvas') doughnutCanvas;

  filter:string = 'day'

  doughnutChart: any;
  
  amountSubject: Subject<number>;
  qtySubject: Subject<number>;
  chartDataSubject: Subject<any>;
  groupedItemSubject: Subject<any>;

  constructor(
    private navCtrl: NavController, 
    private db: AngularFireDatabase,
    private currencyPipe: CurrencyPipe) {

    this.amountSubject = new Subject()
    this.qtySubject = new Subject()
    this.chartDataSubject = new Subject()
    this.groupedItemSubject = new Subject()

    // update chart
    this.chartDataSubject.subscribe(data => {
      this.updateChart(data);
    })

  }

  compute() {
    //let startOfMonth = moment().startOf('month').toDate().getTime()
    //let endOfMonth   = moment().endOf('month').toDate().getTime()

    //console.log(startOfMonth)
    //console.log(endOfMonth)

    /**
    let query = this.db.list('/sales', { 
      query: {
        orderByChild: 'date',
        //equalTo: 1496407742429
        //startAt: startOfMonth,
        //endAt: startOfMonth
      }
    })
    */
    let query = this.db.list('/sales')

    query.subscribe(sales => {
      let total = 0.0
      let qty = 0
      
      let paymentValues = []
      let paymentLabels = []

      let itemsDescription = []
      let groupedItems = []

      sales.map(sale => {
        total += sale.total
        qty = sale.items.reduce((t, item) => t + item.qty, qty)

        sale.items.forEach(item => {
          let index = itemsDescription.indexOf(item.description)
          if (index !== -1) {
            groupedItems[index].qty += item.qty
          } else {
            itemsDescription.push(item.description)
            groupedItems.push({
              description: item.description,
              qty: item.qty
            })
          }
        })

        let index = paymentLabels.indexOf(sale.paymentType)
        if (index !== -1) {
          paymentValues[index] += sale.total
        } else {
          paymentLabels.push(sale.paymentType)
          paymentValues.push(sale.total)
        }
      })

      console.log(groupedItems)
      
      this.amountSubject.next(total)
      this.qtySubject.next(qty)
      this.groupedItemSubject.next(groupedItems)

      this.chartDataSubject.next({
        labels: paymentLabels,
        values: paymentValues,
      })

    })
  }

  updateChart(data) {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Valor recebido',
          data: data.values,
          backgroundColor: [
            'rgba(255, 99, 132, 1.0)',
            'rgba(255, 206, 86, 1.0)',
            'rgba(75, 192, 192, 1.0)',
          ],
          hoverBackgroundColor: [
            'rgba(255, 99, 132, 1.0)',
            'rgba(255, 206, 86, 1.0)',
            'rgba(75, 192, 192, 1.0)',
          ]
        }]
      }
    });
  }

  ionViewDidLoad() {
    this.compute()
  }
}
