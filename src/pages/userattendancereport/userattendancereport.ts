import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';


@IonicPage()
@Component({
  selector: 'page-userattendancereport',
  templateUrl: 'userattendancereport.html',
})
  
 
export class userAttendanceReportPage{

  
  user: any = localStorage.getItem('userData');
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
  Lpomanament = this.navParams.get('data');
  login_user:any;
  user_name:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authService: RestProvider, public toastCtrl: ToastController, 
              private modal: ModalController, public loadingCtrl: LoadingController, 
              public view: ViewController
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
  }


  ionViewDidLoad() {      
      this.login_user = this.user.UserInfoId;
      this.user_name = this.Lpomanament[0].user_name;
  }
  
  closeModal() {    
      this.view.dismiss();    
  }

  attendanceReport(type:any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      reporting_user_id: this.Lpomanament[0].user_id,
      type: type
    }]

    const myModal: Modal = this.modal.create('attendanceDetailPage', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
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