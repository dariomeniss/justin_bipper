import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {ProductsProvider} from '../models/Products.provider';
import {nextAppComponent} from '../models/actionFor.component';
import {inputBarComponent} from '../models/inputBar.component';
import {PrintServices} from '../models/PrintServices';

@Component({
  templateUrl: 'search.html',
})
export class SearchPage {
  scans:any = [];
  model:any = {};
  thing = null;
  search: any= {};
  constructor(
      public navCtrl: NavController,
      private alertCtrl: AlertController,
      private toastCtrl: ToastController,
      private productsProvider: ProductsProvider,
      private printServices: PrintServices
) {
    console.log('constructeur de search');
    this.model = {};
    this.scans = [];
    this.search = {products: [], packs: [], shipments: [], terms:""};
    window['printService'] = this.printServices;
  }
  addIt(scanned) {
    console.log('addit', scanned);
    var packs = [];
    var prods = [];
    var ships = [];
    var notFound = false;

    let pack = this.productsProvider.getPack(scanned);
    let ship = this.productsProvider.getShipment(scanned);
    let prod = this.productsProvider.getProducts(scanned);
    if (pack) {
      //on a trouvé un pack
      ships = [pack.shipment];
      packs = [pack];
      prods = pack.products;
      this.model.searched = "pack";
      console.log('next step', pack.nextSteps())
    } else if (ship) {
      // on a trouvé un shipment
      ships = [ship];
      packs = ship.packs;
      prods = ship.products;
      this.model.searched = "shipment";
    } else if (prod.length) {
      // on a trouve un produit
      console.log(prod);
      ships = [prod[0].shipment];
      packs = (prod[0].pack) ? [prod[0].pack]: [];
      prods = [prod[0]];
      this.model.searched = "product";
    } else {
      notFound = true;
    }

    this.search = {
      products: prods,
      packs: packs,
      shipments: ships,
      terms: scanned,
      notFound: notFound
    };
    console.log('searched', this.search);
  }
  searchHarder() {
    var query = this.search.terms;
    console.log('dans search harder');
    this.productsProvider.get_pack_info({name: query}).then(
      (infos) => {
        this.search.hard = infos;
        this.search.notFound = false;
    });
  }
  printShippingLabel(picking) {
    this.productsProvider.get_ship_label({name: picking}).then(
      (labels) => {
        console.log('on a du label !', labels);
        labels.forEach(
          label => this.printServices.printZebra(label.data)
        );
      }
    )
  }
  openPack(pack) {
    this.model["scanned"] = pack.name; //because of fucking typescript
    return this.addIt(pack.name);
  }
  validate() {
    console.log('send this to the server');
    this.toastCtrl.create({
      message: 'Saved',
      duration: 2000
    }).present();
    this.reset();
  }
  reset() {
    this.scans = {}
  }
  print(pack) {
    console.log('on va printer du pack', pack);
    this.productsProvider.get_pack_label(pack).then(
      (x) => {
        console.log('on print',x);
        this.printServices.printDymo(x);
    })
  }
}
