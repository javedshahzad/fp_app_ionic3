import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
//import { debounce } from 'ionic-angular/umd/util/util';
import { AlertController } from 'ionic-angular';
import {  FormGroup,FormBuilder,Validators } from '@angular/forms';


@IonicPage()
@Component({
    selector: 'page-drec',
    templateUrl: 'drec.html',
})
  
export class DrecPage {

    drecDetailsall = {
        lnkchqnotcollectedlist: [] as any,
        lnkchqreceivednotHolist: [] as any,
        lnkhonotacknowledgedlist: [] as any,
        lnkchqreceivednotsubmittedlist: [] as any,
        lnkchqsubmitedtodeplist: [] as any,
        lnkbtnejariDetailsGetlist: [] as any,
        lnkchqsentformgrlist: [] as any,
        lnkchqrcvdfrommgrlist: [] as any,
        lnkchqcollectedpmgrlist: [] as any,
        lnkbtnEscalationCeoGetlist: [] as any,
        drecDetailsall: [] as any
    } as any;
    
    insertedValues: any;

    drec_chenotcpllected_fromclient = 'none';
    dre_chqreceivednotHolist = 'none';
    drec_honotacknowledgedlist = 'none';
    drec_chqreceivednotsubmittedlist = 'none';
    drec_chqsubmitedtodeplist = 'none';
    drec_ejariDetailsGetlist = 'none';
    drec_all_list = 'none';
    drec_all_label = 'none';
    drec_lnkchqsentformgr='none';
    drec_lnkchqrcvdfrommgrlist='none';
    drec_lnkchqcollectedpmgrlist='none';
    drec_EscalationCeoGetlist = 'none';
    searchData = { "search_value": "" };
    drecdetailssearch: any
    drecsearch: any
    attachmentbtnlist ='none';
    image ='none';
    fileuploadForm:FormGroup;
    user: any = localStorage.getItem('userData');
    constructor(public navCtrl: NavController, public navParams: NavParams,
        public authService: RestProvider, public toastCtrl: ToastController,
        private modal: ModalController, public atrCtrl: AlertController, private formBuilder: FormBuilder,

        public loadingCtrl: LoadingController, public view: ViewController) {
        this.user = this.user ? JSON.parse(this.user) : {};
        this.fileuploadForm = this.formBuilder.group({
            requestor_name: ['', Validators.compose([Validators.required])]
          });
  
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

    drecDetails() {
        let myTitle = 'Drec';
        this.presentLoadingDefault(true);
        this.authService.getData({}, 'drec/DrecList').then((result) => {
            this.drecDetailsall = result;
            this.drecdetailssearch = result;
            this.presentLoadingDefault(false);

        }, (err) => {
            this.presentLoadingDefault(false);
            this.presentToast(err);
        });
    }

    ionViewDidLoad() {
        this.drec_all_list = 'none';
        this.drec_all_label = 'block';
        this.drecDetails();
    }

    // Confirm popup code
    showConfirmAlert(LEASE_NUM: any,STATUS_ID: any,FILE_TYPE1:any,FILE_TYPE2:any,FILE_TYPE3:any,FILE_TYPE4:any) {
        var msg = '';
        var current_value = '';
        var previous_value = '';
        if(STATUS_ID == 1){
            msg = 'Click yes to DREC CHQ RCVD NOT HANDED OVER TO PRO';
            current_value = 'DREC CHQ RCVD NOT HANDED OVER TO PRO';
            previous_value = 'DREC CHQ NOT COLLECTED FROM CLIENT';
        }else if(STATUS_ID == 2){
            msg = 'Click yes to DREC CHQ HANDED OVER TO PRO BUT NOT ACKNOWLEDGD';
            current_value = 'DREC CHQ HANDED OVER TO PRO BUT NOT ACKNOWLEDGD';
            previous_value = 'DREC CHQ RCVD NOT HANDED OVER TO PRO';
        }else if(STATUS_ID == 3){
            msg = 'Click yes to DREC CHQ RECIVED BY PRO NOT YET SUBMITTED TO DREC DEPT';
            current_value = 'DREC CHQ RECIVED BY PRO NOT YET SUBMITTED TO DREC DEPT';
            previous_value = 'DREC CHQ HANDED OVER TO PRO BUT NOT ACKNOWLEDGD';
        }else if(STATUS_ID == 4){
            msg = 'Click yes to DREC CHQ SUBMITTED TO DEPARTMENT AND OBTAIN EJARI';
            current_value = 'DREC CHQ SUBMITTED TO DEPARTMENT AND OBTAIN EJARI';
            previous_value = 'DREC CHQ RECIVED BY PRO NOT YET SUBMITTED TO DREC DEPT';
        }

        let alertConfirm = this.atrCtrl.create({
            title: '',
            message: msg,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('No clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        console.log('Yes clicked');
                                               
                        if(STATUS_ID == 1){
                            if(FILE_TYPE1 ==1  && FILE_TYPE2 ==1 && FILE_TYPE3 ==1 && FILE_TYPE4 ==1){                                                               
                                this.drecInsertUpdateStatus(LEASE_NUM,2,current_value,previous_value);
                            }else{
                                this.presentToast(`Please Upload  Document TL TC Chq Rcpt`);
                            }
                        }else if(STATUS_ID == 2){
                            this.drecInsertUpdateStatus(LEASE_NUM,3,current_value,previous_value);
                        }else if(STATUS_ID == 3){
                            this.drecInsertUpdateStatus(LEASE_NUM,4,current_value,previous_value);
                        }else if(STATUS_ID == 4){
                            this.drecInsertUpdateStatus(LEASE_NUM,5,current_value,previous_value);
                        }                          
                    }
                }
            ]
        });
        alertConfirm.present();
    }

    drecInsertUpdateStatus(LEASE_NUM:any,STATUS_ID: any,CURRENT_VALUE: any,PREVIOUS_VALUE: any){
        let drecStatusData = {} as any;
        drecStatusData.lease_number   = LEASE_NUM;
        drecStatusData.status_id      = STATUS_ID;
        drecStatusData.current_value  = CURRENT_VALUE;
        drecStatusData.previous_value = PREVIOUS_VALUE;
        drecStatusData.created_by     = this.user.UserInfoId;
        drecStatusData.modified_by    = this.user.UserInfoId;

        this.presentLoadingDefault(true);
        this.authService.postData(drecStatusData,'drec/Drecstatusinsert').then((result) => {
                this.presentLoadingDefault(false);
                this.presentToast("Status Update successfully.");                                    
        }, (err) => {
                this.presentLoadingDefault(false);
                this.presentToast(err);
        });
    }

    setescalationdata(type: any) {
        this.drec_all_list = 'none';
        this.drec_chenotcpllected_fromclient = 'none';
        this.dre_chqreceivednotHolist = 'none';
        this.drec_honotacknowledgedlist = 'none';
        this.drec_chqreceivednotsubmittedlist = 'none';
        this.drec_chqsubmitedtodeplist = 'none';
        this.drec_ejariDetailsGetlist = 'none';
        this.drec_lnkchqsentformgr='none';
        this.drec_lnkchqrcvdfrommgrlist ='none';
        this.drec_lnkchqcollectedpmgrlist ='none';
        if (type == 'lnkchqnotcollectedlist') {
            this.drec_chenotcpllected_fromclient = 'block';
        } else if (type == 'lnkchqreceivednotHolist') {
            this.dre_chqreceivednotHolist = 'block';
        } else if (type == 'lnkhonotacknowledgedlist') {
            this.drec_honotacknowledgedlist = 'block';
        } else if (type == 'lnkchqreceivednotsubmittedlist') {
            this.drec_chqreceivednotsubmittedlist = 'block';
        } else if (type == 'lnkchqsubmitedtodeplist') {
            this.drec_chqsubmitedtodeplist = 'block';
        } else if (type == 'lnkbtnejariDetailsGetlist') {
            this.drec_ejariDetailsGetlist = 'block';
        } else if (type == 'lnkchqsentformgr') {
            this.drec_lnkchqsentformgr = 'block';
        }else if (type == 'lnkchqrcvdfrommgrlist') {
            this.drec_lnkchqrcvdfrommgrlist = 'block';
        }else if (type == 'lnkchqcollectedpmgrlist') {
            this.drec_lnkchqcollectedpmgrlist = 'block';
        }else if (type == 'lnkbtnEscalationCeoGetlist'){
            this.drec_EscalationCeoGetlist = 'block';
        }

    }

    openModal(LEASE_NUM: any,DREC:any) {
        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };

        let myModalData = [{
            LEASE_NUM: LEASE_NUM,
            DREC:DREC
        }];

        let myModal: Modal = this.modal.create('DrecCommentsPage', { data: myModalData }, myModalOptions);

        myModal.present();

        myModal.onDidDismiss((data) => {
            // console.log("I have dismissed.");
            // console.log(data);
        });

        myModal.onWillDismiss((data) => {
            // console.log("I'm about to dismiss");
            // console.log(data);
        });
    }


    openModalAttachment(LEASE_NUM: any) {
        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };

        let myModalData = [{
            LEASE_NUM: LEASE_NUM
        }];

        let myModal: Modal = this.modal.create('DrecAttachmentsPage', { data: myModalData }, myModalOptions);

        myModal.present();

        myModal.onDidDismiss((data) => {
            // console.log("I have dismissed.");
            // console.log(data);
        });

        myModal.onWillDismiss((data) => {
            // console.log("I'm about to dismiss");
            // console.log(data);
        });
    }

    // Undo drec Chq Not Collected data extend//
    showchqnotcollectedBtn = -1;
    ischqnotcollectedOpen = false;
    oldchqnotcollectedBtn = -1;
    showUndodrecChqNotCollectedBtn(index) {
        if (this.ischqnotcollectedOpen == false) {
            this.ischqnotcollectedOpen = true;
            this.oldchqnotcollectedBtn = index;
            this.showchqnotcollectedBtn = index;
        } else {
            if (this.oldchqnotcollectedBtn == index) {
                this.ischqnotcollectedOpen = false;
                this.showchqnotcollectedBtn = -1;
                this.oldchqnotcollectedBtn = -1;
            } else {
                this.showchqnotcollectedBtn = index;
                this.oldchqnotcollectedBtn = index;
            }
        }
    }

    // Undo Chq received not Ho list data extend//
    showChqreceivednotHoBtn = -1;
    isChqreceivednotHoOpen = false;
    oldChqreceivednotHoBtn = -1;
    showUndoChqreceivednotHolistBtn(index) {
        if (this.isChqreceivednotHoOpen == false) {
            this.isChqreceivednotHoOpen = true;
            this.oldChqreceivednotHoBtn = index;
            this.showChqreceivednotHoBtn = index;
        } else {
            if (this.oldChqreceivednotHoBtn == index) {
                this.isChqreceivednotHoOpen = false;
                this.showChqreceivednotHoBtn = -1;
                this.oldChqreceivednotHoBtn = -1;
            } else {
                this.showChqreceivednotHoBtn = index;
                this.oldChqreceivednotHoBtn = index;
            }
        }
    }

    // Undo ho not acknowledged list data extend//
    showhonotacknowledgedlistBtn = -1;
    ishonotacknowledgedlistOpen = false;
    oldhonotacknowledgedlistBtn = -1;
    showUndohonotacknowledgedlistBtn(index) {
        if (this.ishonotacknowledgedlistOpen == false) {
            this.ishonotacknowledgedlistOpen = true;
            this.oldhonotacknowledgedlistBtn = index;
            this.showhonotacknowledgedlistBtn = index;
        } else {
            if (this.oldhonotacknowledgedlistBtn == index) {
                this.ishonotacknowledgedlistOpen = false;
                this.showhonotacknowledgedlistBtn = -1;
                this.oldhonotacknowledgedlistBtn = -1;
            } else {
                this.showhonotacknowledgedlistBtn = index;
                this.oldhonotacknowledgedlistBtn = index;
            }
        }
    }

    //Undo chq received not submitted list//
    showchqreceivednotsubmittedlistBtn = -1;
    ischqreceivednotsubmittedlistOpen = false;
    oldchqreceivednotsubmittedlistBtn = -1;
    showUndochqreceivednotsubmittedlistBtn(index) {
        if (this.ischqreceivednotsubmittedlistOpen == false) {
            this.ischqreceivednotsubmittedlistOpen = true;
            this.oldchqreceivednotsubmittedlistBtn = index;
            this.showchqreceivednotsubmittedlistBtn = index;
        } else {
            if (this.oldchqreceivednotsubmittedlistBtn == index) {
                this.ischqreceivednotsubmittedlistOpen = false;
                this.showchqreceivednotsubmittedlistBtn = -1;
                this.oldchqreceivednotsubmittedlistBtn = -1;
            } else {
                this.showchqreceivednotsubmittedlistBtn = index;
                this.oldchqreceivednotsubmittedlistBtn = index;
            }
        }
    }

    // Undo chq submited to dep list data extend//
    showchqsubmitedtodeplistBtn = -1;
    ischqsubmitedtodeplistOpen = false;
    oldchqsubmitedtodeplistBtn = -1;
    showUndochqsubmitedtodeplistBtn(index) {
        if (this.ischqsubmitedtodeplistOpen == false) {
            this.ischqsubmitedtodeplistOpen = true;
            this.oldchqsubmitedtodeplistBtn = index;
            this.showchqsubmitedtodeplistBtn = index;
        } else {
            if (this.oldchqsubmitedtodeplistBtn == index) {
                this.ischqsubmitedtodeplistOpen = false;
                this.showchqsubmitedtodeplistBtn = -1;
                this.oldchqsubmitedtodeplistBtn = -1;
            } else {
                this.showchqsubmitedtodeplistBtn = index;
                this.oldchqsubmitedtodeplistBtn = index;
            }
        }
    }

    // Undo ejari Details Get list data extend//
    showejariDetailsGetlistBtn = -1;
    isejariDetailsGetlistOpen = false;
    oldejariDetailsGetlistBtn = -1;
    showUndoejariDetailsGetlistBtn(index) {
        if (this.isejariDetailsGetlistOpen == false) {
            this.isejariDetailsGetlistOpen = true;
            this.oldejariDetailsGetlistBtn = index;
            this.showejariDetailsGetlistBtn = index;
        } else {
            if (this.oldejariDetailsGetlistBtn == index) {
                this.isejariDetailsGetlistOpen = false;
                this.showejariDetailsGetlistBtn = -1;
                this.oldejariDetailsGetlistBtn = -1;
            } else {
                this.showejariDetailsGetlistBtn = index;
                this.oldejariDetailsGetlistBtn = index;
            }
        }
    }
    // Undo Chq Sent for Mgmt list data extend//


    showEscalationCeoGetlistBtn = -1;
    isEscalationCeoGetlistOpen = false;
    oldEscalationCeoGetlistBtn = -1;
    showUndoEscalationCeoGetlistBtn(index) {
        if (this.isEscalationCeoGetlistOpen == false) {
            this.isEscalationCeoGetlistOpen = true;
            this.oldEscalationCeoGetlistBtn = index;
            this.showEscalationCeoGetlistBtn = index;
        } else {
            if (this.oldEscalationCeoGetlistBtn == index) {
                this.isEscalationCeoGetlistOpen = false;
                this.showEscalationCeoGetlistBtn = -1;
                this.oldEscalationCeoGetlistBtn = -1;
            } else {
                this.showEscalationCeoGetlistBtn = index;
                this.oldEscalationCeoGetlistBtn = index;
            }
        }
    }

    ShowChqSentforMgrBtn = -1;
    isChqSentforMgrOpen = false;
    oldChqSentforMgrBtn = -1;
    undoShowChqSentforMgrBtn(index) {
        if (this.isChqSentforMgrOpen == true) {
            if (this.oldChqSentforMgrBtn == index) {
                this.isChqSentforMgrOpen = false;
                this.ShowChqSentforMgrBtn = -1;
                this.oldChqSentforMgrBtn = -1;
            }else{
                this.ShowChqSentforMgrBtn = index;
                this.oldChqSentforMgrBtn = index;  
            }
        }else{
            this.ShowChqSentforMgrBtn = index;
            this.oldChqSentforMgrBtn = index;            
            this.isChqSentforMgrOpen = true;
        }
    }

    // Undo ejari Details Get list data extend//

    ShowChqRcvdFromMgrBtn = -1;
    isChqRcvdFromMgrBtnOpen = false;
    oldChqRcvdFromMgrBtn = -1;
    undoShowChqRcvdFromMgrBtn(index) {
        if (this.isChqRcvdFromMgrBtnOpen == false) {
            this.isChqRcvdFromMgrBtnOpen = true;
            this.ShowChqRcvdFromMgrBtn = index;
            this.oldChqRcvdFromMgrBtn = index;
        } else {
            if (this.oldChqRcvdFromMgrBtn == index) {
                this.isChqRcvdFromMgrBtnOpen = false;
                this.ShowChqRcvdFromMgrBtn = -1;
                this.oldChqRcvdFromMgrBtn = -1;
            }else{                
                this.ShowChqRcvdFromMgrBtn = index;
                this.oldChqRcvdFromMgrBtn = index;
            }
        }
    }

    // Undo ejari Details Get list data extend//

    ShowChqCollectedpMgrBtn = -1;
    isChqCollectedpMgrBtnOpen = false;
    oldChqCollectedpMgrBtn = -1;
    undoShowChqCollectedpMgrBtn(index) {
        if (this.isChqCollectedpMgrBtnOpen == false) {
            this.isChqCollectedpMgrBtnOpen = true;
            this.ShowChqCollectedpMgrBtn = index;
            this.oldChqCollectedpMgrBtn = index;
        } else {
            if (this.oldChqCollectedpMgrBtn == index) {
                this.isChqCollectedpMgrBtnOpen = false;
                this.ShowChqCollectedpMgrBtn = -1;
                this.oldChqCollectedpMgrBtn = -1;
            }else{                
                this.ShowChqCollectedpMgrBtn = index;
                this.oldChqCollectedpMgrBtn = index;
            }
        }
    }

    SearchdrecDetail() {
        let drec_val = this.searchData.search_value;
        if (drec_val != '') {
            this.drecsearch = this.drecdetailssearch.drecDetailsListall.filter(item => (item.CUSTOMER_NAME ? item.CUSTOMER_NAME.includes(drec_val) : '') || (item.LEASE_NUM ? item.LEASE_NUM.includes(drec_val) : '') || (item.UNIT_NO ? item.UNIT_NO.includes(drec_val) : ''));
            this.drec_all_label = 'none';
            this.drec_all_list = 'block';
        } else {
            this.drecsearch = this.drecdetailssearch.drecDetailsListalls;
            this.drec_all_list = 'none';
            this.drec_all_label = 'block';
        }
    }

    onCloseattachmentbtnlist(){
        this.attachmentbtnlist ='none';
    }
    showAttachment() {
        this.attachmentbtnlist ='block';
    }
    onCloseimage(){
        this.image ='none';
    }
    TL(){
        this.attachmentbtnlist ='none';
        this.image ='block';
    }
    TC(){
        this.attachmentbtnlist ='none';
        this.image ='block';
    }
    CHQ(){
        this.attachmentbtnlist ='none';
        this.image ='block';
    }
    RCPT(){
        this.attachmentbtnlist ='none';
        this.image ='block';
    }
    RRL(){
        this.attachmentbtnlist ='none';
        this.image ='block';
    }

    EJ(){
        this.attachmentbtnlist ='none';
        this.image ='block';
    }

    SUBRCPT(){
        this.attachmentbtnlist ='none';
        this.image ='block';
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