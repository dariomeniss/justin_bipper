import {Injectable} from '@angular/core';
import {Scan} from './Scan.model';
import {ProductsProvider} from './../models/Products.provider';

@Injectable()
export class ScansProvider {
  list: Array<Scan> = [];
  constructor(private productsProvider: ProductsProvider) {
  }
  private remove(barcode):Scan {
    var scan;
    var idx = this.list.findIndex((s: Scan) => s.barcode == barcode);
    if (idx != -1) {
      scan = this.list[idx];
      this.list.splice(idx,1).pop();
    } else {
      let products = this.productsProvider.getProducts(barcode).filter(function nonReceptionné(p) {
        return p.nextSteps() == "receptionner";
      });
      scan = new Scan(barcode, 0, products);
    }
    return scan
  }
  get() {
    return this.list;
  }
  addOne(barcode) {
    var scan = this.remove(barcode);
    scan.qty++;
    this.list.unshift(scan);
  }
  decreaseOne(scan:Scan) {
    scan.qty--;
    if (scan.qty == 0){
      let idx = this.list.indexOf(scan);
      this.list.splice(idx,1);
    }
  }
  reset() {
    this.list = [];
    return this.list;
  }
  validate() {
    this.list.forEach( scan => {
      if (!scan.products)
        return;
      for (let i = Math.min(scan.qty, scan.expected) - 1; i >= 0; i = i-1) {
          scan.products[i].receptionner();
          console.log('on receptionne', scan.products[i].name);
      }
    });
  }
};