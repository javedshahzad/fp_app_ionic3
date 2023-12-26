import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import Swal from 'sweetalert2'
 
 
@Component({
  selector: 'page-cheque',
  templateUrl: 'cheque.html',
})
export class ChequePage {
  chequelistlabeldetails = this.navParams.get('data');
  chequedetailsall: any;
  chequedetails: any;
  insertedValues: any;
  resourcedetails={} as any;
  holdapprovaldata:any;
  color_display = '';
  bk_color_display = 'white';
  searchData = { "search_value": "" };
  user: any = localStorage.getItem('userData');
  showescalateddays =0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  loading = this.loadingCtrl.create();
  presentLoadingDefault(show) {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create();
    }
    if (show) {
      this.loading.present();
    }
    else {
      this.loading.dismissAll();
      this.loading = null
    }
  };

  goBack() {
    this.navCtrl.setRoot(DashboardPage);
  }

  chequelistdetails() {
    //let myTitle = 'Cheque List';
    this.presentLoadingDefault(true);
    let paramdata ={
      type : this.chequelistlabeldetails[0].type
    };
    this.authService.postData(paramdata, 'cheque/ChequeList').then((result) => {
      this.chequedetailsall = result;
      this.chequedetails    = result;

      if (this.chequedetails.ESCALATION_COUNT == 2 || this.chequedetails.ESCALATION_COUNT > 2){
        this.color_display = 'red';
      }

      if (this.chequelistlabeldetails[0].SearchData != '' && this.chequelistlabeldetails[0].SearchData != undefined) {
        this.searchData.search_value = this.chequelistlabeldetails[0].SearchData;
        this.SearchchequeDetail();
      }

      this.presentLoadingDefault(false);
      
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad  Cheque');
    if(this.chequelistlabeldetails[0].type == 'ESCMGR' || this.chequelistlabeldetails[0].type == 'ESCCEO' ){
      this.color_display = 'red';
      this.showescalateddays = 1;
    }
    this.getresource();
    this.chequelistdetails();
    
  }

  closeModal() {
    this.view.dismiss();
  }

  openModal(ID: any,cheque:any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      ID: ID,
      CHEQUE:cheque
    }];

    let myModal: Modal = this.modal.create('ChequeCommentPage', { data: myModalData }, myModalOptions);


    myModal.onWillDismiss(() => {
      this.chequelistdetails();
    });
    myModal.present();

  }
  
  returncheque(ID: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      ID: ID
    }];

    let myModal: Modal = this.modal.create('CreateReturnChequePage', { data: myModalData }, myModalOptions);


    myModal.onWillDismiss(() => {
      this.chequelistdetails();
    });
    myModal.present();
  }
  cheque_hold(ID: any, type: any, maxdate: any, mindate: any) {
  //  console.log(ID, type, maxdate, mindate);
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      ID: ID,
      type: type,
      maxdate: maxdate,
      mindate: mindate
    }];
    if (type == "Create") {
        if (this.resourcedetails.TYPE_USER == "Admin") {
          let myModal: Modal = this.modal.create('CreateHoldChequePage', { data: myModalData }, myModalOptions);
          myModal.onWillDismiss(() => {
            this.chequelistdetails();
          });
          myModal.present();
        } else {
          Swal.fire('Oops...', 'You Cannot Have an Access To Hold a cheque');
        }
    } else {
      let myModal: Modal = this.modal.create('CreateHoldChequePage', { data: myModalData }, myModalOptions);
      myModal.onWillDismiss(() => {
        this.chequelistdetails();
      });
      myModal.present();
    }
  }

  getresource() {
    let resourseData : any = localStorage.getItem('resourseData');
    resourseData = resourseData ? JSON.parse(resourseData) : null;
    this.resourcedetails =  resourseData
    if(!resourseData){
      this.presentLoadingDefault(true);
      this.authService.getData({}, 'cheque/ResourceList/' + this.user.UserEmployeeId).then((result) => {
        this.presentLoadingDefault(false);
        this.resourcedetails = result;
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }
  }

  // SearchchequeDetail() {
  //   let cheque_val = this.searchData.search_value;
  //   if (cheque_val != '') {
  //     this.chequedetails = this.chequedetails.filter(item => (item.CHQNO.includes(cheque_val)) || (item.UNIT.includes(cheque_val)) || (item.CUSTOMER.includes(cheque_val)));
  //   } else {
  //     this.chequedetails = this.chequedetailsall;
  //   }
  // }

  SearchchequeDetail() {
    let case_val = this.searchData.search_value;
    if (case_val != '') {
      let filterData = this.chequedetailsall.filter(item => this.filter(item));
      this.chequedetails = filterData;
      
    } else {
      this.chequedetails = this.chequedetailsall
    }
    console.log(this.chequedetails);
  }

  filter(item) {
    let _val = this.searchData.search_value;
    let _case_val = item['CHQNO'] ? item['CHQNO'].toString() : '';
    let _lease_val = item['NAME'] ? item['NAME'].toString() : '';
    let _cno_val = item['UNIT'] ? item['UNIT'].toString() : '';
    let _cus_val = item['CUSTOMER'] ? item['CUSTOMER'].toString() : '';
    return (_case_val.includes(_val) || _lease_val.includes(_val) || _cno_val.includes(_val) || _cus_val.includes(_val));
  }

  presentLoadingCustom(show) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img width = 50 height= 50 src="assets/imgs/logo_new.png" />`,
      duration: 5000
    });

    if (show) {
      loading.present();
    }else {
      loading.dismissAll();
      loading = null
    }
  }


}
