import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-documenttrackinglabels',
  templateUrl: 'documenttrackinglabels.html',
})
export class DocumentTrackingLabelsPage {
 
  searchdocumenttrackingdetails: any;
  documenttrackingdetails: any;

  resourcedetails: any = localStorage.getItem('resourseData');
  user: any = localStorage.getItem('userData');
  Data = this.navParams.get('data');

  searchData = { "search_value": "" };

  pending_for_sent_to_client_sign_count:any;
  pending_to_receive_from_client_count:any;
  pending_to_sent_for_mgmt_sign_count :any;
  pending_to_receive_from_landlord_sign_count :any;
  Sent_for_Mgmt_Sign_To_be_Received_count :any;
  Pending_to_Receive_from_mgmt_sign_count :any;
  Pending_for_to_be_filed_count :any;
  Pending_for_to_be_filed_Ajman_count :any;
  Requested_for_Ejari_Approval_count :any;
  Pending_For_COO_CEO_Ejari_Approval_count :any;
  Pending_for_Ejari_No_Update_Upload_count:any;
  Pre_Lease_Entries_count:any;
  Contract_Not_Yet_Printed_count :any;
  Pending_for_COO_CEO_Approval_For_Quick_Close_count :any;
  Pending_for_ceo_coo_count:any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourcedetails = this.resourcedetails ? JSON.parse(this.resourcedetails) : {};
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

  
  ionViewDidLoad() {
    this.documentTrackingdetails();
  }

  documentTrackingdetails() {
    let params = {
      user_info_id: this.user.UserInfoId,
      resource_type_id: this.resourcedetails.TYPE_ID,
      resource_type_user: this.resourcedetails.TYPE_USER,
      resource_id: this.resourcedetails.RESOURCE_ID
    };

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'documenttracking/getDocumentTrackingCount').then((result) => {

    this.documenttrackingdetails = result;
    console.log(this.documenttrackingdetails);
    this.pending_for_sent_to_client_sign_count = this.documenttrackingdetails[0].LNKSENTCLIENTLIST;
    this.pending_to_receive_from_client_count  = this.documenttrackingdetails[0].LNKRCVDCLIENTLIST;
    this.pending_to_sent_for_mgmt_sign_count   = this.documenttrackingdetails[0].LNKSENTMGMTLIST;
    this.pending_to_receive_from_landlord_sign_count = this.documenttrackingdetails[0].LNKLANDLOARDLIST;
    this.Sent_for_Mgmt_Sign_To_be_Received_count = this.documenttrackingdetails[0].LNKSENTMGMTTOBERCVDLIST;
    this.Pending_to_Receive_from_mgmt_sign_count = this.documenttrackingdetails[0].LNKRCVDMGNTLIST;
    this.Pending_for_to_be_filed_count = this.documenttrackingdetails[0].LNKSIGNEDFILEDLIST;
    this.Pending_for_to_be_filed_Ajman_count = this.documenttrackingdetails[0].LNKSIGNEDFILEDAJMANLIST;
    this.Requested_for_Ejari_Approval_count = this.documenttrackingdetails[0].LNKEJARIREQLIST;
    this.Pending_For_COO_CEO_Ejari_Approval_count =  this.documenttrackingdetails[0].LNKEJARIREQCEOCOOLIST;
    this.Pending_for_Ejari_No_Update_Upload_count =  this.documenttrackingdetails[0].LNKPENDINGEJUPLIST;
    this.Pre_Lease_Entries_count = this.documenttrackingdetails[0].PRELEASELIST;
    this.Contract_Not_Yet_Printed_count = this.documenttrackingdetails[0].CONTNOTPRINTLIST;
    this.Pending_for_COO_CEO_Approval_For_Quick_Close_count = this.documenttrackingdetails[0].ASLNKCOOCEOLIST;
    this.Pending_for_ceo_coo_count = this.documenttrackingdetails[0].CEOCOOAPPROVAL
    this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }
 

  openModal(type:any){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModalData = [{
      type: type
    }];

    let myModal: Modal = this.modal.create('DocumentTrackingPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
    });
  }


  openMultipleApproval(type: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      paymentrequestdata: [],
      type: type
    }];

    let myModal: Modal = this.modal.create('DocumentTrackingMultipleApprovalPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
      this.ionViewDidLoad();
    });

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
