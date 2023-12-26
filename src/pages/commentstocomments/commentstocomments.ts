import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { CommentsLabelsPage } from '../commentslabels/commentslabels';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-commentstocomments',
  templateUrl: 'commentstocomments.html',
})
export class CommentsToCommentsPage {
  CmtData = {
        MyCmt: [] as any,
        MyCmttoCmt: [] as any,
        MyDataall: [] as any
  } as any;
  
  searchData = { "search_value": "" };  
  user: any = localStorage.getItem('userData');
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

  returndetails() {
    let myTitle = 'Comments';
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId
  }
    this.presentLoadingDefault(true);
    this.authService.postData(userdata, 'comments/CommentsListSummary').then((result) => {
      this.CmtData = result;
      this.presentLoadingDefault(false);
      // console.log(this.CmtData);
      // console.log(this.CmtData.MyDataall);
      if(this.CmtData.MyDataall.length == 0) {
         this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  ionViewDidLoad() {
    this.returndetails();
  }

  openDetailModal(type: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let flag = 'N';

    let myModalData = [{
      type: type
    }];

    if (type =='CMT' && this.CmtData.MyCmt.LABEL_COUNT > 0 ){
      flag = 'Y'
    }

    if (type =='CMTTOCMT' && this.CmtData.MyCmttoCmt.LABEL_COUNT > 0 ){
      flag = 'Y'
    }

    if(flag == 'Y') {
      let myModal: Modal = this.modal.create(CommentsLabelsPage, { data: myModalData }, myModalOptions);
      myModal.present();

      myModal.onDidDismiss(() => {
        // console.log("I have dismissed.");
        // console.log(data);
      });

      myModal.onWillDismiss(() => {
        //this.ionViewDidLoad();
        // console.log("I'm about to dismiss");
        // console.log(data);
      });
    }
    

    
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
