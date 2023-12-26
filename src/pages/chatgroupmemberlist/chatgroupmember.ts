import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Platform, LoadingController, ToastController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase,AngularFireList } from 'angularfire2/database';
import { RestProvider } from '../../providers/rest/rest';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { FormGroup } from '@angular/forms';
import { Content, List, Navbar } from 'ionic-angular';
import { Observable } from 'rxjs/observable';
import { map } from 'rxjs/operators/map';

@IonicPage()
@Component({
  selector: 'page-chatgroupmember',
  templateUrl: 'chatgroupmember.html',
})
export class ChatGroupMemberListPage {
  @ViewChild(Content) contentArea: Content;
  @ViewChild(List, { read: ElementRef }) chatList: ElementRef;
  @ViewChild('myselect') selectComponent: SelectSearchableComponent;
  @ViewChild(Navbar) navBar: Navbar;

  itemsRef: AngularFireList<any>;
  items: Observable<any>;
  items1 = [];

  message: string = '';
  messages = [] as any;
  users: any;
  show_group_member_add = 0;
  header_name = 'Chat';
  show_group_details = 0;
  UserExistresult:boolean;

  preventiveMaintanceTab: any;
  userdetails: any;
  userdetailsAll: any;
  seleteduser: any;
  login_user: any;
  UserMsg: any;
  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');

  profile_img_path = '';
  user_status: any;
  received_user_id: any;
  online_offline = 'white';
  showuseraccess = "block";
  userarry = [] as any;
  createtaskForm: FormGroup;
  title: string = "";
  add_new_group = 0;
  show_create_btn = 0;
  show_group_chat = 0;
  show_group_chat_message = 0;
  groupNames: any;
  groupmessages: any;
  show_group_chat_box = 0;
  msg_grpup_name: string = '';
  groupchatuser: any;
  groupAll: any;
  groupmessagesAll: any;
  to_user_id = '';
  showEmojiPicker = false;
  tasksearchlist: any;
  myModalData: any;
  show_profile_image = 0;
  show_group_members = 0;
  show_user_list = 0;
  show_user_list_all = 0;
  group_user_list: any;
  group_user_names = '';
  today_date = new Date();
  monthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  thisMonth = this.monthsName[this.today_date.getMonth()];


  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public db: AngularFireDatabase, public view: ViewController, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public authService: RestProvider
  ) {

    

    this.user = this.user ? JSON.parse(this.user) : {};
    this.preventiveMaintanceTab = "Single";
    this.users = this.user.Surname;
    this.login_user = this.user.UserInfoId;

    this.db.list('/group_chat_user/').valueChanges().subscribe(data => {
      this.groupchatuser = data;
      this.groupNames = this.groupchatuser.filter(x => x.user_id == this.login_user);
      this.group_user_list = this.groupchatuser.filter(x => x.group_name == this.modaltype[0].group_name);

    });

    this.itemsRef = db.list('group_chat_user');
    this.items = this.itemsRef.snapshotChanges().pipe(
      map((changes:any,i) =>  changes.map(c => ({ key: c.payload.key, ...c.payload.val() })) )
    );
    this.items.filter(x => x.group_name.toLowerCase() == this.header_name.toLowerCase());
    console.log(this.items);     

  }


  ionViewDidLoad() {
    this.userarry = [];
    this.getuser();

    if (this.modaltype != undefined) {
      this.header_name = this.modaltype[0].group_name;
    } else {
      this.header_name = 'Chat'
    }

  }

  closeModal() {
    this.view.dismiss();
  }

  getuser() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/UserList/').then((result: any) => {
      this.userdetails = result.filter(x => x.USER_INFO_ID != this.user.UserInfoId);
      this.userdetailsAll = result;
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
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
      this.loading.dismiss();
      this.loading = null
    }
  };

  addgroupmembers() {
    this.userarry = [];
    this.userdetails = this.userdetailsAll.filter(x=> this.group_user_list.find(y=> y.user_id != x.USER_INFO_ID));
    this.show_group_member_add = 1;
    this.show_group_details = 1;
  }

  selectgroupmember(item) {

    this.UserExistresult = this.getCheckUserExist(item);

    if (!this.UserExistresult) {
      this.userarry.push(item);
      console.log(this.userarry);
    } else {
      console.log('User Already selected.');
    }
  }

  getCheckUserExist(item) {
    for (let i = 0; i < this.userarry.length; i++) {
      if(this.userarry[i].USER_INFO_ID == item.USER_INFO_ID){
        return true;
      }
    }
    
  }

  getGroupMember(searchbar) {

    var q = searchbar.value;
    if (q.trim() == '') {
      this.userdetails = this.userdetailsAll;
      return;
    }

    this.userdetails = this.userdetailsAll.filter((v) => {

      if (v.USER_SURNAME.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })

  }

  showusercontrol() {
    if (this.showuseraccess == "block") {
      this.showuseraccess = "none";
    } else {
      this.showuseraccess = "block";
    }
  }

  DeleteUser(index: any, USER_INFO_ID: any) {
    var index = this.userarry.findIndex(item => item.USER_INFO_ID == USER_INFO_ID);
    if (index > -1) {
      this.userarry.splice(index, 1);
    }
  }

  addGroupUsersave() {

    for (let i = 0; i < this.userarry.length; i++) {
      this.db.list('/group_chat_user').push({
        group_name: this.header_name,
        seq_text: '',
        user_id: this.userarry[i].USER_INFO_ID,
        user_name: this.userarry[i].USER_SURNAME,
        file_path: this.userarry[i].FILE_PATH,
        profile_img_id: this.userarry[i].USER_PROFILE_IMG_ID
      });
    }

    this.show_group_member_add = 0;
    this.show_group_details = 0;

  }

  deleteUser(item){
    for (var i =0; i < this.userarry.length; i++){
      if (this.userarry[i].USER_INFO_ID === item.USER_INFO_ID) {
        this.userarry.splice(i,1);
        break;
      }
    }
  }

  DeleteDbUser(key){
    this.db.object('/group_chat_user/'+key).remove();
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
