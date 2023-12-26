import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';


/**
 * Generated class for the ItemlistModelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-itemlist-model',
  templateUrl: 'itemlist-model.html',
})
export class ItemlistModelPage {
    title:any;
    inHideMe:boolean;
    outHideMe:boolean;
    itemList : any;
    constructor(public navParams: NavParams, public view: ViewController) {
    }

    closeModel(){
        this.view.dismiss();
    }

    ionViewDidLoad() {
       
        this.title   = this.navParams.get('title');
        this.itemList = this.navParams.get('item_list');   
        if(this.title == 'In Item List'){          
          
          this.inHideMe = true;
        }else{
          this.outHideMe = true;
        }
     //   console.log(this.itemList);
    }
   
}
