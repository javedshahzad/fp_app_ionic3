import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Platform, LoadingController, ToastController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { RestProvider } from '../../providers/rest/rest';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { FormGroup } from '@angular/forms';
import { Content, List, PopoverController, Navbar } from 'ionic-angular';
import { PopoverChatPage } from '../popover-chat/popover-chat';

@IonicPage()
@Component({
  selector: 'page-chatmessage',
  templateUrl: 'chatmessage.html',
})
export class ChatMessagePage {
  @ViewChild(Content) contentArea: Content;
  @ViewChild(List, { read: ElementRef }) chatList: ElementRef;
  @ViewChild('myselect') selectComponent: SelectSearchableComponent;
  @ViewChild(Navbar) navBar: Navbar;

  message: string = '';
  messages = [] as any;
  users: any;
  profile_img_id = 0;

  preventiveMaintanceTab: any;
  userdetails: any;
  userdetailsAll: any;
  seleteduser: any;
  show_signle_chat = 0;
  show_chat_tap = 0;
  singlemessages: any;
  itemdata: any;
  single: any;
  single1: any;
  singleChatUserList: any;
  singleChatUserList1: any;
  singlemessages_list: any;
  USER_INFO_ID: any;
  login_user: any;
  UserMsg: any;
  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  header_name = 'Chat';
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
  show_group_details = 0;
  show_user_list = 0;
  show_user_list_all = 0;
  group_user_list: any;
  group_user_names = '';
  today_date = new Date();
  monthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  thisMonth = this.monthsName[this.today_date.getMonth()];

  msg_array = [] as any;
  msg_array_1 = [] as any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public db: AngularFireDatabase, public view: ViewController, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public authService: RestProvider, 
    private popoverCtrl: PopoverController
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.preventiveMaintanceTab = "Single";
    this.users = this.user.Surname;
    this.login_user = this.user.UserInfoId;

    localStorage.setItem('Chat', '0');

    this.db.list('/chat_user/').valueChanges().subscribe(data => {
      this.single = data;
    });

    this.db.list('/user_message/').valueChanges().subscribe(data => {

      this.singlemessages_list = data;
      console.log('list  '+ this.singlemessages_list);
      this.singlemessages = this.singlemessages_list.filter(x => (x.sender_id == this.user.UserInfoId && x.receiver_id == this.to_user_id) || (x.receiver_id == this.user.UserInfoId && x.sender_id == this.to_user_id));
      this.onFocus();

    });

    this.db.list('/user_message').snapshotChanges().subscribe(ServerItem => {
      this.msg_array = [];
      ServerItem.forEach(a => {
        let item: any = a.payload.val();
        item.key = a.payload.key;
        this.msg_array.push(item);
      });

      console.log('1.1  '+this.msg_array);
      this.msg_array_1 = this.msg_array.filter(x => x.sender_id == this.to_user_id && x.read_status ==0);
      console.log('1.2  '+this.msg_array_1);

      for (let i = 0; i < this.msg_array_1.length; i++) {
        const items = this.db.list('/user_message');
        items.update(this.msg_array_1[i].key, { read_status: 1 }).then(() => {
          console.log('Message is marked as raed.')
        });
      }

    });


    this.db.list('/group_chat_messages/').valueChanges().subscribe(data => {
      this.groupmessagesAll = data;
      this.groupmessages = this.groupmessagesAll.filter(x => x.group_name == this.msg_grpup_name);    
      this.onFocus();
    });

    this.db.list('/group_chat_user/').valueChanges().subscribe(data => {
      this.groupchatuser = data;
      this.groupNames = this.groupchatuser.filter(x => x.user_id == this.login_user);
      this.onFocus();
    });

  }


  ionViewDidLoad() {
    this.userarry = [];
    this.getuser();
    console.log('ionViewDidLoad ChatPage');
    console.log(this.user.UserInfoId);
    console.log(this.modaltype);

    if (this.modaltype != undefined) {      
      this.show_signle_chat = 1;
      this.to_user_id = this.modaltype[0].msg_to_user_id;
      this.received_user_id = this.modaltype[0].msg_to_user_id;
      this.header_name = this.modaltype[0].user_details[0].USER_SURNAME;
      this.user_status = this.modaltype[0].user_details[0].STATUS;
      this.profile_img_id = this.modaltype[0].user_details[0].USER_PROFILE_IMG_ID;
      this.profile_img_path = this.modaltype[0].user_details[0].FILE_PATH;
      //this.singlemessages    = this.modaltype[0].singlemessages;
      //console.log('this.singlemessages ',this.singlemessages );
    }
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.contentArea.resize();
    this.scrollToBottom();
  }

  closeModal() {
    this.view.dismiss();
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  //Show popover menu
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverChatPage,{chatList:this.singlemessages,senderId:this.login_user, receiverId: this.received_user_id});
    popover.present({
      ev: myEvent
    });
  }

  getuser() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/UserList/').then((result: any) => {
      this.userdetails = result.filter(x => x.USER_INFO_ID != this.user.UserInfoId);
      this.userdetailsAll = result;
      //this.openUserChat();
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  userSendMessage(login_user: any, received_user_id: any) {

    let date_now = this.today_date.getDate() + '-' + this.thisMonth + '-' + this.today_date.getFullYear();

    let login_user_details = this.userdetailsAll.filter(x => x.USER_INFO_ID == login_user);
    let received_user_details = this.userdetailsAll.filter(x => x.USER_INFO_ID == received_user_id);


    if (this.message != '') {

      let chat_insert = {} as any;
      chat_insert.sender_id = this.user.UserInfoId;
      chat_insert.receiver_id = received_user_id;
      chat_insert.message = this.message;

      this.db.list('/user_message').push({
        sender_id: this.user.UserInfoId,
        sender_name: login_user_details[0].USER_SURNAME,
        receiver_id: received_user_id,
        receiver_name: received_user_details[0].USER_SURNAME,
        message: this.message,
        date: Date(),
        date_now: date_now,
        msg_time: this.formatAMPM(new Date),
        read_status: 0
      }).then(() => {

        this.singlemessages = this.singlemessages_list.filter(x => (x.sender_id == received_user_id && x.receiver_id == this.user.UserInfoId) || (x.receiver_id == received_user_id && x.sender_id == this.user.UserInfoId));
        this.contentArea.scrollToBottom();

        var app_platform: string = '';
        if (this.platform.is('ios')) {
          app_platform = 'ios';
        }

        if (this.platform.is('android')) {
          app_platform = 'android';
        }

        let push_message = {} as any;
        push_message.title = this.user.Surname;
        push_message.content = 'Chat';
        push_message.message = this.message;
        push_message.app_platform = app_platform;
        push_message.user_info_id = received_user_id;
        push_message.loggedin_user_id = this.user.UserInfoId;
        push_message.trans_type = 'CHAT';

        this.authService.postData(push_message, 'pushnotification/pushnotificationsinglechat').then((result) => {
          this.message = "";
        }, (err) => {
          this.presentToast(err);
        });


        let login_user_list = this.single.filter(x => x.user_id == login_user);
        let received_user_list = this.single.filter(x => x.user_id == received_user_id);

        if (login_user_list.length == 0) {
          this.db.list('/chat_user').push({
            user_id: login_user,
            user_name: login_user_details[0].USER_SURNAME,
            date: Date()
          });
        }else {
          for (let i = 0; i < login_user_list.length; i++) {
            const items = this.db.list('/chat_user');
            items.update(login_user_list[i].key, { date: Date() }).then(() => {
              console.log('Login user is updated.')
            });
          }
        }

        if (received_user_list.length == 0) {
          this.db.list('/chat_user').push({
            user_id: received_user_id,
            user_name: received_user_details[0].USER_SURNAME,
            date: Date()
          });
        }else {
          for (let i = 0; i < received_user_list.length; i++) {
            const items = this.db.list('/chat_user');
            items.update(received_user_list[i].key, { date: Date() }).then(() => {
              console.log('Received user is updated.')
            });
          }
        }

      });

    } else {
      this.presentToast("Please enter message.");
    }

    this.scrollToBottom();
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

  scrollToBottom() {
    setTimeout(() => {
      if (this.contentArea.scrollToBottom) {
        this.contentArea.scrollToBottom(0);
      }
      
    })
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
