import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Platform, LoadingController, ToastController, NavParams, ViewController, Modal, ModalOptions, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { RestProvider } from '../../providers/rest/rest';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { FormGroup } from '@angular/forms';
import { Content, List, PopoverController, Navbar } from 'ionic-angular';
import { PopoverChatPage } from '../popover-chat/popover-chat';

@IonicPage()
@Component({
  selector: 'page-chatgroupmessage',
  templateUrl: 'chatgroupmessage.html',
})
export class ChatGroupMessagePage {
  @ViewChild(Content) contentArea: Content;
  @ViewChild(List, { read: ElementRef }) chatList: ElementRef;
  @ViewChild('myselect') selectComponent: SelectSearchableComponent;
  @ViewChild(Navbar) navBar: Navbar;

  message: string = '';
  messages = [] as any;
  users: any;
  profile_img_id = 0;

  userdetails: any;
  userdetailsAll: any;
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
  header_name = '';
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
  groupChatNames = [];

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public db: AngularFireDatabase, public view: ViewController, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public authService: RestProvider, private modal: ModalController,
    private popoverCtrl: PopoverController
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.users = this.user.Surname;
    this.login_user = this.user.UserInfoId;
    this.header_name = this.modaltype[0].GROUP_NAME;
    this.msg_grpup_name = this.modaltype[0].GROUP_NAME;
    localStorage.setItem('Chat', '0');
    
    this.db.list('/group_chat/').valueChanges().subscribe(data => {
      this.groupAll = data;
    });

    this.db.list('/group_chat_messages/').valueChanges().subscribe(data => {
      this.groupmessagesAll = data;
      this.groupmessages = this.groupmessagesAll.filter(x => x.roi_comment_id == this.modaltype[0].ROI_COMMENTS_ID);    
      this.onFocus();
    });

    this.db.list('/group_chat_user/').valueChanges().subscribe(data => {
      this.groupchatuser = data;
      this.groupNames = this.groupchatuser.filter(x => x.user_id == this.login_user);
      this.onFocus();

      let group_user_list = this.groupchatuser.filter(x => x.roi_comment_id == this.modaltype[0].ROI_COMMENTS_ID);
      this.group_user_names = '';
      for (let i = 0; i < group_user_list.length; i++) {
        this.group_user_names += group_user_list[i].user_name + ',';
      }
    });

  }


  ionViewDidLoad() {
    this.userarry = [];
    this.header_name = this.modaltype[0].GROUP_NAME;
    this.msg_grpup_name = this.modaltype[0].GROUP_NAME;
    this.getuser();
    console.log('ionViewDidLoad ChatPage');
    console.log(this.user.UserInfoId);
    console.log(this.modaltype);
    localStorage.setItem('Chat', '1');
    
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
    let popover = this.popoverCtrl.create(PopoverChatPage);
    popover.present({
      ev: myEvent
    });
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

  scrollToBottom() {
    setTimeout(() => {
      if (this.contentArea.scrollToBottom) {
        this.contentArea.scrollToBottom();
      }
      
    })
  }

  
  sendGroupMessage() {
    this.userarry = [];
    let login_user_details = this.userdetailsAll.find(x => x.USER_INFO_ID == this.user.UserInfoId);
    let date_now  = this.today_date.getDate() + '-' + this.thisMonth + '-' + this.today_date.getFullYear();
    let msg_text  = this.message;
    this.userarry = this.modaltype[0].GROUP_USER;
    let group_name = this.modaltype[0].GROUP_NAME;
    let roiCommentsID = this.modaltype[0].ROI_COMMENTS_ID;

    this.db.list('/group_chat').snapshotChanges().subscribe(ServerItem => {     
      ServerItem.forEach(a => {
        let item: any = a.payload.val();
        item.key = a.payload.key;
        this.groupChatNames.push(item);
      });

      let group_exist = this.groupChatNames.filter(x => x.roi_comment_id == roiCommentsID);

      if (group_exist.length == 0) {

        this.db.list('/group_chat').push({
          group_name: group_name,
          roi_comment_id: this.modaltype[0].ROI_COMMENTS_ID,
          created_by: this.user.UserInfoId,
          created_by_name: this.users

        }).then((data) => {

          for (let i = 0; i < this.userarry.length; i++) {
            this.db.list('/group_chat_user').push({
              group_name: group_name,
              seq_text: this.modaltype[0].SEQ_TEXT,
              user_id: this.userarry[i].USER_INFO_ID,
              user_name: this.userarry[i].USER_SURNAME,
              file_path: this.userarry[i].FILE_PATH,
              profile_img_id: this.userarry[i].USER_PROFILE_IMG_ID,
              roi_comment_id: this.modaltype[0].ROI_COMMENTS_ID
            });
          }

        }).then(()=>{
          console.log('New group is created');
          this.group_user_names = '';

          for (let i = 0; i < this.userarry.length; i++) {
            this.group_user_names += this.userarry[i].USER_SURNAME + ',';
          }
          localStorage.setItem('Chat', '1');

        });

      }else{
        console.log('Group already exist',group_exist);
      }

    });
    
    this.db.list('/group_chat_messages').push({
      group_name: this.msg_grpup_name,
      message: msg_text,
      user_id: this.user.UserInfoId,
      user_name: login_user_details.USER_SURNAME,
      roi_comment_id: this.modaltype[0].ROI_COMMENTS_ID,
      date: Date(),
      date_now: date_now,
      msg_time: this.formatAMPM(new Date)

    }).then(() => {
      this.message = "";      
      let user_list = this.groupchatuser.filter(x => (x.roi_comment_id == this.modaltype[0].ROI_COMMENTS_ID && x.user_id != this.user.UserInfoId));
      this.onFocus();
      var app_platform: string = '';
      if (this.platform.is('ios')) {
        app_platform = 'ios';
      }

      if (this.platform.is('android')) {
        app_platform = 'android';
      }

      for (let i = 0; i < user_list.length; i++) {

        let push_message              = {} as any;
        push_message.title            = this.msg_grpup_name + '- ' + this.user.Surname;
        push_message.content          = 'Group Chat';
        push_message.message          = msg_text;
        push_message.app_platform     = app_platform;
        push_message.user_info_id     = user_list[i].user_id;
        push_message.loggedin_user_id = this.user.UserInfoId;
        push_message.trans_type       = 'ROI_GROUP_CHAT'
        push_message.group_name       = this.msg_grpup_name;
        push_message.roi_comments_id  = this.modaltype[0].ROI_COMMENTS_ID;

        this.authService.postData(push_message, 'pushnotification/pushnotificationsinglechat').then((result) => {
          
          this.message = "";
        }, (err) => {
          this.presentToast(err);
        });
      }

    });


  }

  
  showGroupMembers(name: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      group_name: name
    }]

    let myModal: Modal = this.modal.create('ChatGroupMemberListPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
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
