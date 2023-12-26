import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-drecattachments',
    templateUrl: 'drecattachment.html',
})
export class DrecAttachmentsPage {
    drecattachmentsdetails: any
    drecattachmentsForm: FormGroup
    insertedValues: any;
    drecattachment = this.navParams.get('data');
    
    user: any = localStorage.getItem('userData');
    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService: RestProvider, public toastCtrl: ToastController,private modal: ModalController,
        public loadingCtrl: LoadingController, public view: ViewController) {
        this.user = this.user ? JSON.parse(this.user) : {};
        this.drecattachmentsForm = this.formBuilder.group({
            LEASE_NUM: ['', Validators.compose([Validators.required])]
        });
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

    ionViewWillLoad() {
        // const Data = this.navParams.get('data');
        // let myTitle = 'Drec Attachments';
        // let LEASE_NUM = Data[0].LEASE_NUM;       
        // this.presentLoadingDefault(true);
        // this.authService.getData({}, 'drec/DrecCommentsList/' + LEASE_NUM).then((result) => {
        //     this.drecattachmentsdetails = result;
        //     this.presentLoadingDefault(false);
        //     if (this.drecattachmentsdetails.length > 0) {
        //         this.presentLoadingDefault(false);
        //         this.presentToast(`Data found in ${myTitle}`);
        //     } else {
        //         this.presentLoadingDefault(false);
        //         this.presentToast(`No data found in ${myTitle}`);
        //     }
        // }, (err) => {
        //     this.presentLoadingDefault(false);
        //     this.presentToast(err);
        // });
        //this.attachmentbtnlist = 'block';
    }
  
    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 2000,
            position: 'middle'
        });
        toast.present();
    }
    closeModal() {
        this.view.dismiss();
    }

    openModalDrecUpload(LEASE_NUM: any,FILE_TYPE_ID: any) {
        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };

        let myModalData = [{
            LEASE_NUM: LEASE_NUM,
            FILE_TYPE_ID: FILE_TYPE_ID
        }];

        let myModal: Modal = this.modal.create('DrecUploadsPage', { data: myModalData }, myModalOptions);

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