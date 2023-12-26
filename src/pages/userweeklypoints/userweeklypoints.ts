import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Platform, LoadingController, ToastController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase, } from 'angularfire2/database';
import { RestProvider } from '../../providers/rest/rest';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Content, List, Navbar } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-userweeklypoints',
  templateUrl: 'userweeklypoints.html',
})
export class UserWeeklyPointsPage {

  @ViewChild(Content) contentArea: Content;
  @ViewChild(List, { read: ElementRef }) chatList: ElementRef;
  @ViewChild('myselect') selectComponent: SelectSearchableComponent;
  @ViewChild(Navbar) navBar: Navbar;

  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  login_user:any;
  login_user_name:any;
  roipoints:any;
  selectedpoints = 0;
  insertedValues:any;
  roipointscomments = '';
  roi_count_flag = 0;  
  CommentsListdata: any;
  weekly_R: any;
  weekly_I: any;
  weekly_O: any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public db: AngularFireDatabase, public view: ViewController, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public authService: RestProvider
    
  ) {
    this.roipoints = 0;
    this.selectedpoints = 0;
    this.user = this.user ? JSON.parse(this.user) : {};
    this.login_user_name = this.user.Surname;
    this.login_user = this.user.UserInfoId;

  }

  ionViewDidLoad() {

    console.log('Roi Week Point');
    console.log(this.modaltype[0]);
    console.log(this.user.UserInfoId);
    console.log(this.roipoints);
    this.Getcommentdatewise(this.modaltype[0].start_week, this.modaltype[0].end_week); 
  }
  
  closeModal() {    
    this.view.dismiss();
  }

  
  Getcommentdatewise(startweek, endweek) {

    let data = {
      startweek: startweek,
      endweek: endweek,
      user_id: this.modaltype[0].reporting_user_id,
    }

    this.presentLoadingDefault(true);
    this.authService.postData(data, 'task/getUserRoiByWeek').then((result: any) => {
      this.CommentsListdata = result;
      this.weekly_R = result.filter(x => x.TYPE == 'R').length;
      this.weekly_I = result.filter(x => x.TYPE == 'I').length;
      this.weekly_O = result.filter(x => x.TYPE == 'O').length;
      console.log('R', this.weekly_R);
      console.log('O', this.weekly_O);
      console.log('I', this.weekly_I);

      if (this.weekly_R == 0 && this.weekly_O == 0 && this.weekly_I == 0){
        this.roi_count_flag = 1;
      }else{
        this.roi_count_flag = 0;
      }
      
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  onPointChange(event){
    console.log(this.roipoints);
    console.log('event',event.value);
    this.selectedpoints = this.roipoints;
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

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  
  insertRoiWeekPoints() {

    if(this.selectedpoints <= 0 && this.roipointscomments == ''){
      this.presentToast('Please enter comments.');
      return;
    }
      
    let task_insert_data = {
      point_no: this.selectedpoints,
      assigned_user_id: this.modaltype[0].reporting_user_id,
      from_date: this.modaltype[0].start_week,
      to_date: this.modaltype[0].end_week,
      comments: this.roipointscomments,
      created_by: this.user.UserInfoId,
      modified_by: this.user.UserInfoId
    };

    console.log(task_insert_data);
    
      this.presentLoadingDefault(true);
      this.authService.postData(task_insert_data, 'task/getInsertRoiPoints').then((result) => {
        this.presentLoadingDefault(false);     
        this.insertedValues = result;
              

        var app_platform: string = '';
        if (this.platform.is('ios')) {
          app_platform = 'ios';
        }

        if (this.platform.is('android')) {
          app_platform = 'android';
        }

        // var taskcreator = this.userdetails.filter(item => item.USER_INFO_ID == task_insert_data.created_by);
        let push_message = {} as any;
        push_message.title = this.user.Surname;
        push_message.content = 'Roi Points';
        push_message.message = 'The point '+this.selectedpoints+' is entered for week from '+this.modaltype[0].start_week+'-'+this.modaltype[0].end_week;
        push_message.app_platform = app_platform;
        push_message.user_info_id = this.modaltype[0].reporting_user_id;
        push_message.loggedin_user_id = this.user.UserInfoId;
        push_message.trans_type = 'ROIPOINT';

        this.authService.postData(push_message, 'pushnotification/pushnotificationsinglechat').then((result) => {
          console.log('result',result);
        }, (err) => {
          this.presentToast(err);
        });

        this.closeModal();

      }, err => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
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
