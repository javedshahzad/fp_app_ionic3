import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Platform, LoadingController, ToastController, ActionSheetController, NavParams, ViewController, Modal, ModalOptions, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Content, List, PopoverController, Navbar } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PopoverChatPage } from '../popover-chat/popover-chat';
import { Chooser } from '@ionic-native/chooser';
import { ChatProvider } from '../../providers/chat/chat';
import { Constant } from '../../providers/constant/constant';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})

export class ChatPage {


  @ViewChild(Content) contentArea: Content;
  @ViewChild(List, { read: ElementRef }) chatList: ElementRef;
  @ViewChild('myselect') selectComponent: SelectSearchableComponent;
  @ViewChild(Navbar) navBar: Navbar;


  fileTransfer: FileTransferObject;

  message: string = '';
  messages = [] as any;
  users: any;
  userdetails: any;
  userdetailsAll: any;
  ForwordUserList: any;
  seleteduser: any;
  show_signle_chat = 0;
  show_chat_tap = 0;
  singlemessages: any = [];
  itemdata: any;
  ChatUserAll: any;
  ChatUserListAll: any;
  ChatArchiveUser: any = [];
  show_archive_chat_user: any = 0;
  single: any;
  single1: any;
  single2: any;
  singleChatUserList: any;
  singleChatUserList1: any;
  singlemessages_list: any;
  USER_INFO_ID: any;
  login_user: any;
  UserMsg: any;
  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  header_name = 'Chat';
  profile_img_id = 0;
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
  to_user_id: any;
  showEmojiPicker = false;
  tasksearchlist: any;
  myModalData: any;
  show_profile_image = 0;
  show_group_members = 0;
  show_group_details = 0;
  show_user_list = 0;
  show_user_list_all = 0;
  show_group_member_add = 0;
  group_user_list: any;
  group_user_names = '';
  today_date = new Date();
  single_user_mesagelist = [] as any;
  chat_user_array = [] as any;
  chat_user_array1 = [] as any;
  chat_user_array2 = [] as any;
  chatUserHistory: any;
  roi_comment_id: any;
  singlemessages_count: any;
  msg_array = [] as any;
  msg_array_1 = [] as any;
  groupmessages_count: any;
  grp_msg_array: any;
  grp_msg_array_1: any;
  message_select_ids = [] as any;
  user_select_ids = [] as any;
  show_forword_user = 0;
  monthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  thisMonth = this.monthsName[this.today_date.getMonth()];
  loginUser: any;
  reciverDetail: any;
  reciverKey: any;
  fileUri: any = '';
  fileExtn: any = '';
  preventiveMaintanceTab: string = "Single";
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private chooser: Chooser,
    public db: AngularFireDatabase, public view: ViewController, public toastCtrl: ToastController, private actionsheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController, public authService: RestProvider, private formBuilder: FormBuilder, public chatService: ChatProvider,
    private popoverCtrl: PopoverController, private modal: ModalController, private file: File, private transfer: FileTransfer, private fileOpener: FileOpener, public constant: Constant//,private afStorage: AngularFireStorage
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.preventiveMaintanceTab = "Single";
    this.users = this.user.Surname;
    this.login_user = this.user.UserInfoId;

    localStorage.setItem('Chat', '0');

    this.createtaskForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      add_user_access: ['', Validators.compose([Validators.required])]
    });


    this.db.list('/user_message').snapshotChanges().subscribe(ServerItem => {
      this.msg_array = [];

      ServerItem.forEach(a => {
        let item: any = a.payload.val();
        item.key = a.payload.key;
        this.msg_array.push(item);
      });

      this.singleChatUserList = this.msg_array.filter(y => y.sender_id === this.user.UserInfoId);
      this.singleChatUserList1 = this.msg_array.filter(y => y.receiver_id === this.user.UserInfoId);

      this.single = this.singleChatUserList.filter((value, index, self) => self.map(x => x.receiver_id).indexOf(value.receiver_id) == index);

      this.singleChatUserList1 = this.singleChatUserList1.filter((value, index, self) => self.map(x => x.sender_id).indexOf(value.sender_id) == index);

      this.single1 = this.singleChatUserList1.filter(this.compare(this.single));

      this.singlemessages_list = this.msg_array.filter(x => (x.sender_id == this.user.UserInfoId && x.receiver_id == this.to_user_id) || (x.receiver_id == this.user.UserInfoId && x.sender_id == this.to_user_id));
      this.singlemessages = this.singlemessages_list.filter(x => (x.clear_ids ? (x.clear_ids.indexOf(this.user.UserInfoId) == -1) : true));
      this.onFocus();


      this.db.list('/chat_user', ref => ref.orderByChild('date')).snapshotChanges().subscribe(ServerItem => {
        this.chat_user_array = [];
        ServerItem.forEach(a => {
          let item: any = a.payload.val();
          item.key = a.payload.key;
          this.chat_user_array.push(item);
        });
        this.loginUser = this.chat_user_array.filter(x => x.user_id == this.user.UserInfoId);
        //   console.log(this.loginUser);
        this.chat_user_array1 = this.chat_user_array.filter(x => this.single.find(y => y.receiver_id == x.user_id));
        this.chat_user_array2 = this.chat_user_array.filter(x => this.single1.find(y => y.sender_id == x.user_id));
        var uniqueUserArray1 = this.chat_user_array1.concat(this.chat_user_array2);


        this.ChatUserAll = uniqueUserArray1.sort((a, b) => {
          const aDate = new Date(a.date);
          const bDate = new Date(b.date);

          return bDate.getTime() - aDate.getTime();
        });

        let archive_ids = this.loginUser[0] ? this.loginUser[0].archive_ids : [];
        archive_ids = archive_ids ? archive_ids : [];

        for (let i = 0; i < this.ChatUserAll.length; i++) {
          this.singlemessages_count = this.singlemessages_list.filter(y => y.sender_id === this.ChatUserAll[i].user_id && y.read_status == 0);
          this.ChatUserAll[i].new_message_count = this.singlemessages_count.length;
        }
        this.ChatUserListAll = JSON.parse(JSON.stringify(this.ChatUserAll));
        for (let n in this.ChatUserListAll) {
          let index = archive_ids.indexOf(this.ChatUserListAll[n].user_id);
          if (index > -1) {
            let _id = archive_ids[index];
            let _ind = this.ChatUserListAll.findIndex(x => x.user_id == _id);

            let isIndex = this.ChatArchiveUser.findIndex(x => x.user_id == _id);
            if (isIndex == -1) {
              this.ChatArchiveUser.push(this.ChatUserListAll[_ind]);
            }
            this.ChatUserAll = this.ChatUserAll.filter(x => x.user_id !== _id);
          }
        }
        // console.log('Chat All User ',this.ChatUserListAll);
        // console.log('Chat Archive User ',this.ChatArchiveUser);
        // console.log('Chat User  ',this.ChatUserAll);


      });
    });

    this.db.list('/group_chat_messages').snapshotChanges().subscribe(ServerItem => {
      this.grp_msg_array = [];
      ServerItem.forEach(a => {
        let item: any = a.payload.val();
        item.key = a.payload.key;
        this.grp_msg_array.push(item);
      });
    });

    this.db.list('/group_chat/').valueChanges().subscribe(data => {
      this.groupAll = data;
    });

    this.db.list('/group_chat_messages/').valueChanges().subscribe(data => {
      this.groupmessagesAll = data;
      this.groupmessages = this.groupmessagesAll.filter(x => x.group_name == this.msg_grpup_name);

      this.db.list('/group_chat_user/').valueChanges().subscribe(data => {
        this.groupchatuser = data;
        this.groupNames = this.groupchatuser.filter(x => x.user_id == this.login_user);

        for (let i = 0; i < this.groupNames.length; i++) {
          this.groupmessages_count = this.groupmessagesAll.filter(y => y.user_id != this.user.UserInfoId && y.group_name === this.groupNames[i].group_name && y.read_status == 0);
          this.groupNames[i].new_groupmessage_count = this.groupmessages_count.length;
        }
        //     console.log(this.groupNames);
        this.onFocus();
      });

      this.openGroupChat();
      this.openTaskGroupChat();
      this.onFocus();
    });

    this.db.list('/group_chat_user/').valueChanges().subscribe(data => {
      this.groupchatuser = data;
      this.groupNames = this.groupchatuser.filter(x => x.user_id == this.login_user);

      for (let i = 0; i < this.groupNames.length; i++) {
        this.groupmessages_count = this.groupmessagesAll.filter(y => y.user_id != this.user.UserInfoId && y.group_name === this.groupNames[i].group_name && y.read_status == 0);
        this.groupNames[i].new_groupmessage_count = this.groupmessages_count.length;
      }
      //  console.log(this.groupNames);
      this.onFocus();
    });

  }

  compare(ObjList) { return (obj) => ObjList.filter((item) => item.receiver_id == obj.sender_id).length == 0; }

  compare1(ObjList) { return (obj) => ObjList.filter((item) => item.receiver_id == obj.user_id); }

  compare2(ObjList) { return (obj) => ObjList.filter((item) => item.sender_id == obj.user_id); }


  ionViewDidLoad() {
    this.userarry = [];
    this.to_user_id = '';
    this.getuser();
    this.setBackButtonAction();
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.contentArea.resize();
    this.scrollToBottom();
  }


  goBack() {
    this.view.dismiss();
  }

  onFocusTxtArea() {
    this.showEmojiPicker = false;
    this.contentArea.resize();
    this.scrollToBottom();
    let sender = this.loginUser[0];
    let reciver = this.ChatUserListAll.filter(x => x.user_id == this.received_user_id);
    let typing_id = sender ? sender.user_id ? sender.user_id : 0 : 0;
    if (reciver.length > 0) {
      this.reciverDetail = reciver[0];
      this.reciverKey = reciver[0].key;
      this.updateTypingStatus(reciver[0].key, 1, typing_id)
    }

  }

  updateTypingStatus(key, is_typing, typing_id) {
    if (key) {
      let UserList = this.db.list('/chat_user');
      UserList.update(key, { is_typing: is_typing, typing_end_id: typing_id }).catch((err) => { console.log(err) });
    }
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
    let popover = this.popoverCtrl.create(PopoverChatPage, { chatList: JSON.stringify(this.single_user_mesagelist), userId: this.login_user });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(() => {

    });
    popover.onWillDismiss(() => this.edituserchat1(this.itemdata))
  }

  //Method to override the default back button action
  setBackButtonAction() {
    this.navBar.backButtonClick = () => {

      if (this.show_signle_chat == 1) {

        this.show_user_list_all = 0;
        this.show_user_list = 0;
        this.show_archive_chat_user = 0;
        this.userdetails = this.userdetailsAll;
        localStorage.removeItem('Chat');
        this.show_profile_image = 0;
        this.show_signle_chat = 0;
        this.show_chat_tap = 0;
        this.show_group_chat = 0;
        this.header_name = 'Chat';
        this.user_status = "";
        this.show_group_chat_message = 0;
        this.group_user_names = '';
        this.show_group_member_add = 0;
        this.message_select_ids = [];
        this.user_select_ids = [];
        this.msg_array_1 = this.msg_array.filter(x => x.sender_id == this.USER_INFO_ID && x.read_status == 0);
        this.updateTypingStatus(this.reciverKey, 0, 0);
        for (let i = 0; i < this.msg_array_1.length; i++) {
          const items = this.db.list('/user_message');
          items.update(this.msg_array_1[i].key, { read_status: 1 }).then(() => {
            // console.log('Message is marked as raed.')
          });

        }

      } else if (this.show_signle_chat == 2) {

        if (this.show_create_btn == 0) {
          this.message_select_ids = [];
          this.user_select_ids = [];
          this.userdetails = this.userdetailsAll;
          localStorage.removeItem('Chat');
          this.show_user_list = 1;
          this.show_user_list_all = 0;
          this.show_archive_chat_user = 0;
          this.show_profile_image = 0;
          this.show_signle_chat = 2;
          this.show_create_btn = 1;
          this.show_chat_tap = 0;
          this.add_new_group = 0;
          this.show_group_chat = 1;
          this.show_group_chat_box = 0;
          this.header_name = 'Chat';
          this.user_status = "";
          this.msg_grpup_name = "";
          this.show_group_chat_message = 0;
          this.group_user_names = '';
          this.show_group_member_add = 0;
        } else {
          localStorage.removeItem('Chat');
          this.navCtrl.push(DashboardPage, {});
        }

      } else if (this.show_forword_user == 1) {
        this.userdetails = this.userdetailsAll;
        this.user_select_ids = [];
        this.userarry = [];
        this.show_forword_user = 0;
        localStorage.removeItem('Chat');
        this.show_user_list = 1;
        this.show_user_list_all = 0;
        this.show_chat_tap = 1;
        this.show_signle_chat = 1;
        this.show_archive_chat_user = 0;
      } else if (this.show_signle_chat == 0 && this.show_user_list_all == 1) {
        this.message_select_ids = [];
        this.user_select_ids = [];
        this.show_user_list_all = 0;
        this.show_user_list = 0;
        this.show_archive_chat_user = 0;
        this.userdetails = this.userdetailsAll;
        localStorage.removeItem('Chat');
        this.show_profile_image = 0;
        this.show_signle_chat = 0;
        this.show_chat_tap = 0;
        this.show_group_chat = 0;
        this.header_name = 'Chat';
        this.user_status = "";
        this.show_group_chat_message = 0;
        this.group_user_names = '';
        this.show_group_member_add = 0;

      } else {
        localStorage.removeItem('Chat');
        this.navCtrl.push(DashboardPage, {});
      }
    }
    localStorage.removeItem('Chat');
  }

  getuser() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/UserList/').then((result: any) => {
      this.userdetails = result.filter(x => x.USER_INFO_ID != this.user.UserInfoId);
      this.userdetailsAll = result;
      this.ForwordUserList = result;
      this.openUserChat();
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  storeInfoToDatabase(metainfo) {
    let toSave = {
      created: metainfo.timeCreated,
      url: metainfo.downloadURLs[0],
      fullPath: metainfo.fullPath,
      contentType: metainfo.contentType
    }
    return this.db.list('files').push(toSave);
  }

  userSendMessage(login_user: any, received_user_id: any, is_forward: any) {

    let date_now = this.today_date.getDate() + '-' + this.thisMonth + '-' + this.today_date.getFullYear();
    let messing_date = Date();
    let login_user_details = this.userdetailsAll.filter(x => x.USER_INFO_ID == login_user);
    let received_user_details = this.userdetailsAll.filter(x => x.USER_INFO_ID == received_user_id);


    if (this.message != '') {

      let chat_insert = {
        sender_id: this.user.UserInfoId,
        sender_name: login_user_details[0].USER_SURNAME,
        receiver_id: received_user_id,
        receiver_name: received_user_details[0].USER_SURNAME,
        message: this.message,
        date: messing_date,
        date_now: date_now,
        msg_time: this.formatAMPM(new Date),
        read_status: 0,
        clear_ids: [0],
        file_uri: this.fileUri,
        file_type: this.fileExtn,
        is_file: this.fileUri != '' ? 1 : 0,
        is_forward: is_forward
      };

      this.db.list('/user_message').push(chat_insert).then(() => {
        if (is_forward == 0) {
          this.singlemessages = this.msg_array.filter(x => (x.sender_id == received_user_id && x.receiver_id == this.user.UserInfoId) || (x.receiver_id == received_user_id && x.sender_id == this.user.UserInfoId));
          this.singlemessages = this.singlemessages.filter(x => (x.clear_ids ? (x.clear_ids.indexOf(this.user.UserInfoId) == -1) : true));
          this.onFocus();
        }
        var app_platform: string = '';
        if (this.platform.is('ios')) {
          app_platform = 'ios';
        }

        if (this.platform.is('android')) {
          app_platform = 'android';
        }

        let push_message = {
          title: this.user.Surname,
          content: 'Chat',
          message: this.message,
          app_platform: app_platform,
          user_info_id: received_user_id,
          loggedin_user_id: this.user.UserInfoId,
          trans_type: 'CHAT'
        };
        this.fileUri = '';
        this.fileExtn = ''
        this.authService.postData(push_message, 'pushnotification/pushnotificationsinglechat').then((result) => {
          this.message = "";
        }, (err) => {
          this.presentToast(err);
        });

        this.db.list('/chat_user', ref => ref.orderByChild('date')).snapshotChanges().subscribe(ServerItem => {
          this.chat_user_array = [];
          ServerItem.forEach(a => {
            let item: any = a.payload.val();
            item.key = a.payload.key;
            this.chat_user_array.push(item);
          });

          this.chat_user_array1 = this.chat_user_array.filter(x => this.single.find(y => y.receiver_id == x.user_id));
          this.chat_user_array2 = this.chat_user_array.filter(x => this.single1.find(y => y.sender_id == x.user_id));
          var uniqueUserArray1 = this.chat_user_array1.concat(this.chat_user_array2);

          this.ChatUserListAll = uniqueUserArray1.sort((a, b) => {
            const aDate = new Date(a.date);
            const bDate = new Date(b.date);

            return bDate.getTime() - aDate.getTime();
          });
          let archive_ids = this.loginUser[0] ? this.loginUser[0].archive_ids : [];
          archive_ids = archive_ids ? archive_ids : [];
          this.ChatUserAll = this.ChatUserListAll;

          for (let n in this.ChatUserListAll) {
            let index = archive_ids.indexOf(this.ChatUserListAll[n].user_id);
            if (index > -1) {
              let _id = archive_ids[index];
              let _ind = this.ChatUserListAll.findIndex(x => x.user_id == _id);

              let isIndex = this.ChatArchiveUser.findIndex(x => x.user_id == _id);
              if (isIndex == -1) {
                this.ChatArchiveUser.push(this.ChatUserListAll[_ind]);
              }
              this.ChatUserAll = this.ChatUserAll.filter(x => x.user_id !== _id);
            }
          }
          //  console.log(this.ChatUserAll);
        });

        let loginUserDetail = this.chat_user_array.filter(x => x.user_id === login_user);
        let ReceivedUserDetail = this.chat_user_array.filter(x => x.user_id === received_user_id);

        if (loginUserDetail.length == 0) {
          this.db.list('/chat_user').push({
            user_id: login_user,
            user_name: login_user_details[0].USER_SURNAME,
            date: messing_date,
            file_path: login_user_details[0].FILE_PATH,
            profile_img_id: login_user_details[0].USER_PROFILE_IMG_ID,
            archive_ids: [0],
            is_typing: 0,
            typing_end_id: 0
          }).then(() => {
            //   console.log('Login user is inserted.')
          });
        } else {
          `                                     `
          for (let i = 0; i < loginUserDetail.length; i++) {
            const items = this.db.list('/chat_user');
            items.update(loginUserDetail[i].key, { date: messing_date, file_path: login_user_details[i].FILE_PATH, profile_img_id: login_user_details[i].USER_PROFILE_IMG_ID }).then(() => {
              //   console.log('Login user is updated.')

            });
          }
        }

        if (ReceivedUserDetail.length == 0) {
          this.db.list('/chat_user').push({
            user_id: received_user_id,
            user_name: received_user_details[0].USER_SURNAME,
            date: messing_date,
            file_path: received_user_details[0].FILE_PATH,
            profile_img_id: received_user_details[0].USER_PROFILE_IMG_ID,
            archive_ids: [0],
            is_typing: 0,
            typing_end_id: 0
          }).then(() => {
            //    console.log('Received user is inserted')
          });

        } else {

          for (let i = 0; i < ReceivedUserDetail.length; i++) {
            const items = this.db.list('/chat_user');
            items.update(ReceivedUserDetail[i].key, { date: messing_date, is_typing: 0, typing_end_id: 0, file_path: received_user_details[i].FILE_PATH, profile_img_id: received_user_details[i].USER_PROFILE_IMG_ID }).then(() => {
              //  console.log('Received user is updated.')
              this.user_status = 'Online';
            });


          }

        }

      });
    } else {
      this.presentToast("Please enter message.");
    }

  }

  gruopchatnav() {
    this.show_profile_image = 0;
    this.show_signle_chat = 2;
    this.show_group_chat = 1;
    this.show_create_btn = 1;
    this.show_group_member_add = 0;
    this.user_select_ids = [];
    this.show_user_list = 1;
    this.show_archive_chat_user = 0;
  }

  singlechatnav() {
    this.show_profile_image = 0;
    this.show_signle_chat = 0;
    this.show_group_chat = 0;
    this.show_create_btn = 0;
    this.show_group_member_add = 0;
    this.user_select_ids = [];
    this.show_user_list = 0;
  }

  createnewgroup() {
    this.show_chat_tap = 1;
    this.add_new_group = 1;
    this.show_group_chat = 0;
    this.show_create_btn = 0;
    this.show_group_member_add = 0;
  }

  itemSelected() {
    this.show_user_list_all = 1;
    this.show_chat_tap = 1;
    this.show_create_btn = 0;
    this.show_user_list = 0;
    this.show_archive_chat_user = 0;
    this.show_signle_chat = 2;
    this.show_group_member_add = 0;
  }

  showGroupMembers(name: any) {
    if (name != 'Chat') {
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };
      let myModalData = [{
        group_name: name
      }];
      let myModal: Modal = this.modal.create('ChatGroupMemberListPage', { data: myModalData }, myModalOptions);
      myModal.present();
      myModal.onDidDismiss((data) => {
      });
      myModal.onWillDismiss((data) => {
      });
    }
  }

  insertchatgroup() {

    let login_user_details = this.userdetailsAll.find(x => x.USER_INFO_ID == this.user.UserInfoId);
    let group_exist = this.groupAll.filter(x => x.group_name.toUpperCase() == this.title.toUpperCase());
    this.title = this.title ? this.title.trim() : ''
    if (this.title != '') {
      if (group_exist.length == 0) {
        this.userarry.push(login_user_details);

        this.db.list('/group_chat').push({
          group_name: this.title,
          created_by: this.user.UserInfoId,
          created_by_name: login_user_details.USER_SURNAME

        }).then((data) => {

          for (let i = 0; i < this.userarry.length; i++) {
            this.db.list('/group_chat_user').push({
              group_name: this.title,
              seq_text: '',
              user_id: this.userarry[i].USER_INFO_ID,
              user_name: this.userarry[i].USER_SURNAME,
              file_path: this.userarry[i].FILE_PATH,
              profile_img_id: this.userarry[i].USER_PROFILE_IMG_ID
            });
          }

        }).then(() => {
          this.title = "";
          this.show_signle_chat = 2;
          this.show_create_btn = 1;
          this.show_chat_tap = 0;
          this.add_new_group = 0;
          this.show_group_chat = 1;
          this.show_group_chat_box = 0;
          this.header_name = 'Chat';
          this.user_status = "";
          this.msg_grpup_name = "";
          this.show_group_chat_message = 0;
          this.show_group_member_add = 0;
        });

      } else {
        this.presentToast("The group name already exist. Please try another name.");
      }
    } else {
      this.presentToast("Please enter group name.");
    }
  }

  clearvalues() {
    this.title = "";
    this.show_profile_image = 0;
    this.show_signle_chat = 2;
    this.show_create_btn = 1;
    this.show_chat_tap = 0;
    this.add_new_group = 0;
    this.show_group_chat = 1;
    this.show_group_chat_box = 0;
    this.header_name = 'Chat';
    this.user_status = "";
    this.msg_grpup_name = "";
    this.show_group_chat_message = 0;
    localStorage.removeItem('Chat');
  }

  showusercontrol() {
    if (this.showuseraccess == "block") {
      this.showuseraccess = "none";
    } else {
      this.showuseraccess = "block";
    }
  }

  addUserAccess(event: { component: SelectSearchableComponent, value: any }) {
    let arr = []
    for (var i = 0; i < event.value.length; i++) {
      var userDetailsFilter = this.userdetailsAll.find(item => item.USER_INFO_ID == event.value[i]);
      arr.push(userDetailsFilter)
    }
    this.userarry = arr;
  }

  DeleteUser(index: any, USER_INFO_ID: any) {
    var index = this.userarry.findIndex(item => item.USER_INFO_ID == USER_INFO_ID);
    if (index > -1) {
      this.userarry.splice(index, 1);
    }
  }

  delete() {
    this.db.object('/chat/').remove();
  }

  closeModal() {
    if (this.show_signle_chat == 1) {
      this.show_profile_image = 0;
      this.show_signle_chat = 0;
      this.show_chat_tap = 0;
      this.show_group_chat = 0;
      this.header_name = 'Chat';
      this.user_status = "";
      this.show_group_chat_message = 0;
      this.to_user_id = '';
      this.profile_img_id = 0;
      this.profile_img_path = '';
      this.show_group_member_add = 0;
      localStorage.removeItem('Chat');
    } else if (this.show_signle_chat == 2) {
      this.show_profile_image = 0;
      this.show_signle_chat = 2;
      this.show_create_btn = 1;
      this.show_chat_tap = 0;
      this.add_new_group = 0;
      this.show_group_chat = 1;
      this.show_group_chat_box = 0;
      this.header_name = 'Chat';
      this.user_status = "";
      this.msg_grpup_name = "";
      this.show_group_chat_message = 0;
      this.to_user_id = '';
      this.profile_img_id = 0;
      this.profile_img_path = '';
      this.show_group_member_add = 0;
      localStorage.removeItem('Chat');

    } else {
      this.to_user_id = '';
      this.profile_img_id = 0;
      this.profile_img_path = '';
      this.show_profile_image = 0;
      localStorage.removeItem('Chat');
      this.navCtrl.push(DashboardPage, {});
    }
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

  edituserchat(item) {
    this.show_user_list = 1;
    this.show_profile_image = 1;
    this.show_user_list_all = 0;
    this.to_user_id = item.USER_INFO_ID;
    let checkdata = this.userdetailsAll.filter(x => x.USER_INFO_ID == item.USER_INFO_ID);
    this.itemdata = item;
    this.show_signle_chat = 1;
    this.show_chat_tap = 1;
    this.USER_INFO_ID = item.USER_INFO_ID;
    this.header_name = checkdata[0].USER_SURNAME;
    this.profile_img_id = checkdata[0].USER_PROFILE_IMG_ID;
    this.profile_img_path = checkdata[0].FILE_PATH;
    this.user_status = checkdata[0].STATUS;
    this.received_user_id = checkdata[0].USER_INFO_ID;

    this.singlemessages = this.singlemessages_list.filter(x => (x.sender_id == item.USER_INFO_ID && x.receiver_id == this.user.UserInfoId) || (x.receiver_id == item.USER_INFO_ID && x.sender_id == this.user.UserInfoId));
    this.singlemessages = this.singlemessages.filter(x => (x.clear_ids ? (x.clear_ids.indexOf(this.user.UserInfoId) == -1) : true));
    let reciver = this.ChatUserListAll.filter(x => x.user_id == this.received_user_id);
    this.reciverKey = reciver.key ? reciver.key : null;
    let typing_end_id = this.loginUser[0].typing_end_id ? this.loginUser[0].typing_end_id : 0;
    if (typing_end_id == this.received_user_id)
      this.user_status = this.loginUser[0].is_typing == 1 ? 'typing... ' : 'Online';
    localStorage.setItem('Chat', '1');
    this.onFocus();
  }

  edituserchat1(item) {

    this.to_user_id = item.user_id ? item.user_id : item.USER_INFO_ID;
    this.show_user_list = 1;
    this.show_profile_image = 1;
    this.show_user_list_all = 0;
    let checkdata = this.userdetailsAll.filter(x => x.USER_INFO_ID == this.to_user_id);
    this.itemdata = item;
    this.show_signle_chat = 1;
    this.show_chat_tap = 1;
    this.show_archive_chat_user = 0
    this.USER_INFO_ID = this.to_user_id;
    this.header_name = checkdata[0].USER_SURNAME;
    this.profile_img_id = checkdata[0].USER_PROFILE_IMG_ID;
    this.profile_img_path = checkdata[0].FILE_PATH;
    this.user_status = checkdata[0].STATUS;
    this.received_user_id = checkdata[0].USER_INFO_ID;
    this.reciverKey = this.itemdata.key
    this.db.list('/user_message').snapshotChanges().subscribe(ServerItem => {
      this.msg_array = [];

      ServerItem.forEach(a => {
        let item: any = a.payload.val();
        item.key = a.payload.key;
        this.msg_array.push(item);
      });
      this.singlemessages = this.msg_array.filter(x => (x.sender_id == this.user.UserInfoId && x.receiver_id == this.to_user_id) || (x.receiver_id == this.user.UserInfoId && x.sender_id == this.to_user_id));
      this.singlemessages = this.singlemessages.filter(x => (x.clear_ids ? (x.clear_ids.indexOf(this.user.UserInfoId) == -1) : true));
      this.onFocus();
    });
    this.db.list('/chat_user/' + this.loginUser[0].key + '/').snapshotChanges().subscribe(ServerItem => {
      let login = {} as any;

      ServerItem.forEach(a => {
        let key = a.key;
        login[key] = a.payload.val();
      });

      let typing_end_id = login.typing_end_id ? login.typing_end_id : 0;
      if (typing_end_id == this.received_user_id)
        this.user_status = login.is_typing == 1 ? 'typing... ' : 'Online';
    });

    localStorage.setItem('Chat', '1');

    this.msg_array_1 = this.msg_array.filter(x => x.sender_id == this.to_user_id && x.read_status == 0);

    this.single_user_mesagelist = this.msg_array.filter(x => (x.sender_id == this.user.UserInfoId && x.receiver_id == this.to_user_id) || (x.receiver_id == this.user.UserInfoId && x.sender_id == this.to_user_id));

    for (let i = 0; i < this.msg_array_1.length; i++) {
      const items = this.db.list('/user_message');
      items.update(this.msg_array_1[i].key, { read_status: 1 }).then(() => {
        // console.log('Message is marked as raed.')
      });
    }
    for (let i = 0; i < this.ChatUserAll.length; i++) {
      this.singlemessages_count = this.singlemessages_list.filter(y => y.sender_id === this.ChatUserAll[i].user_id && y.read_status == 0);
      this.ChatUserAll[i].new_message_count = this.singlemessages_count.length;
    }

    for (let n in this.ChatArchiveUser) {
      this.singlemessages_count = this.singlemessages_list.filter(y => y.sender_id === this.ChatArchiveUser[n].user_id && y.read_status == 0);
      this.ChatArchiveUser[n].new_message_count = this.singlemessages_count.length;
    }

  }

  editGroupchat(item) {
    if (item.roi_comment_id != undefined) {
      this.roi_comment_id = item.roi_comment_id;
    } else {
      this.roi_comment_id = '';
    }

    //this.roi_comment_id = item.roi_comment_id;
    this.group_user_names = '';
    if (this.roi_comment_id > 0 && this.roi_comment_id != null) {
      this.group_user_list = this.groupchatuser.filter(x => x.roi_comment_id == this.roi_comment_id);
      this.groupmessages = this.groupmessagesAll.filter(x => x.roi_comment_id == this.roi_comment_id);

    } else {
      this.group_user_list = this.groupchatuser.filter(x => x.group_name == item.group_name);
      this.groupmessages = this.groupmessagesAll.filter(x => x.group_name == item.group_name);
    }

    for (let i = 0; i < this.group_user_list.length; i++) {
      this.group_user_names += this.group_user_list[i].user_name + ',';
    }

    this.show_user_list = 1;
    this.show_user_list_all = 0;
    this.show_archive_chat_user = 0
    this.show_group_members = 1;
    this.show_chat_tap = 1;
    this.show_create_btn = 0;
    this.show_signle_chat = 2;
    this.show_group_chat = 0;
    this.show_group_chat_message = 1;
    this.header_name = item.group_name;
    this.msg_grpup_name = item.group_name;
    this.show_group_chat_box = 1;
    this.show_group_details = 0;
    this.show_group_member_add = 0;

    this.grp_msg_array_1 = this.grp_msg_array.filter(x => x.group_name == item.group_name && x.read_status == 0);

    for (let i = 0; i < this.grp_msg_array_1.length; i++) {
      const items = this.db.list('/group_chat_messages');
      items.update(this.grp_msg_array_1[i].key, { read_status: 1 }).then(() => {
        console.log('Message is marked as raed.');
      });
    }

    localStorage.setItem('Chat', '1');
    this.onFocus();

  }

  sendGroupMessage(login_user: any, received_user_id: any, roi_comment_id: any, is_forward: any = 0) {

    let login_user_details = this.userdetailsAll.find(x => x.USER_INFO_ID == this.user.UserInfoId);
    let date_now = this.today_date.getDate() + '-' + this.thisMonth + '-' + this.today_date.getFullYear();

    let msg_text = this.message;

    this.db.list('/group_chat_messages').push({
      group_name: this.msg_grpup_name,
      message: msg_text,
      user_id: this.user.UserInfoId,
      user_name: login_user_details.USER_SURNAME,
      roi_comment_id: this.roi_comment_id,
      date: Date(),
      date_now: date_now,
      msg_time: this.formatAMPM(new Date),
      read_status: 0,
      file_uri: this.fileUri,
      file_type: this.fileExtn,
      is_file: this.fileUri != '' ? 1 : 0,
      is_forward: is_forward
    }).then(() => {
      this.message = "";
      this.fileUri = '';
      this.fileExtn = '';
      let user_list = this.groupchatuser.filter(x => (x.group_name == this.msg_grpup_name && x.user_id != this.user.UserInfoId));
      this.onFocus();
      var app_platform: string = '';
      if (this.platform.is('ios')) {
        app_platform = 'ios';
      }

      if (this.platform.is('android')) {
        app_platform = 'android';
      }

      for (let i = 0; i < user_list.length; i++) {

        let push_message = {} as any;
        push_message.title = this.msg_grpup_name + '- ' + this.user.Surname;
        push_message.content = 'Group Chat';
        push_message.message = msg_text;
        push_message.app_platform = app_platform;
        push_message.user_info_id = user_list[i].user_id;
        push_message.loggedin_user_id = this.user.UserInfoId;
        push_message.trans_type = 'GROUP_CHAT'
        push_message.group_name = this.msg_grpup_name;

        this.authService.postData(push_message, 'pushnotification/pushnotificationsinglechat').then((result) => {

          this.message = "";
        }, (err) => {
          this.presentToast(err);
        });
      }

    });
  }

  openGroupChat() {

    if (this.modaltype != undefined) {

      if (this.modaltype[0].GROUP_NAME != undefined) {

        if (this.modaltype[0].TRANS_TYPE != 'TASK_CHAT') {

          this.show_user_list = 1;
          this.show_user_list_all = 0;
          this.show_archive_chat_user = 0
          this.show_profile_image = 0;
          this.show_chat_tap = 1;
          this.show_create_btn = 0;
          this.show_signle_chat = 2;
          this.show_group_chat = 0;
          this.show_group_chat_message = 1;
          this.header_name = this.modaltype[0].GROUP_NAME;
          this.msg_grpup_name = this.modaltype[0].GROUP_NAME;
          this.show_group_chat_box = 1;
          this.show_group_member_add = 0;

          if (this.modaltype[0].TRANS_TYPE == 'ROI_GROUP_CHAT') {
            this.group_user_names = '';
            let group_user_list = this.groupchatuser.filter(x => x.roi_comment_id == this.modaltype[0].ROI_COMMENTS_ID);

            for (let i = 0; i < group_user_list.length; i++) {
              this.group_user_names += group_user_list[i].user_name + ',';
            }

            this.groupmessages = this.groupmessagesAll.filter(x => x.roi_comment_id == this.modaltype[0].ROI_COMMENTS_ID);
            this.roi_comment_id = this.modaltype[0].ROI_COMMENTS_ID;

          } else {
            this.groupmessages = this.groupmessagesAll.filter(x => x.group_name == this.modaltype[0].GROUP_NAME);
          }
          localStorage.setItem('Chat', '1');
          this.onFocus();
        }
      }
    }
  }

  openUserChat() {

    if (this.modaltype != undefined) {

      if (this.modaltype[0].TRANS_TYPE == 'CHAT') {

        let checkdata = this.userdetailsAll.filter(x => x.USER_INFO_ID == this.modaltype[0].USER_INFO_ID);
        this.itemdata = checkdata;
        this.show_user_list = 1;
        this.show_signle_chat = 1;
        this.show_user_list_all = 0;
        this.show_archive_chat_user = 0;
        this.show_profile_image = 1;
        this.show_chat_tap = 1;
        this.show_group_member_add = 0;
        this.USER_INFO_ID = checkdata[0].USER_INFO_ID;
        this.header_name = checkdata[0].USER_SURNAME;
        this.profile_img_id = checkdata[0].USER_PROFILE_IMG_ID;
        this.profile_img_path = checkdata[0].FILE_PATH;
        this.user_status = checkdata[0].STATUS;
        this.received_user_id = checkdata[0].USER_INFO_ID;
        this.to_user_id = checkdata[0].USER_INFO_ID;
        this.singlemessages = this.msg_array.filter(x => (x.sender_id == checkdata[0].USER_INFO_ID && x.receiver_id == this.user.UserInfoId) || (x.receiver_id == checkdata[0].USER_INFO_ID && x.sender_id == this.user.UserInfoId));
        this.singlemessages = this.singlemessages.filter(x => (x.clear_ids ? (x.clear_ids.indexOf(this.user.UserInfoId) == -1) : true));
        localStorage.setItem('Chat', '1');
        this.onFocus();
      }
    }
  }

  openTaskGroupChat() {

    if (this.modaltype != undefined) {

      if (this.modaltype[0].GROUP_NAME != undefined) {

        if (this.modaltype[0].TRANS_TYPE == 'TASK_CHAT') {

          this.userarry = [];
          var group_name = this.modaltype[0].GROUP_NAME;

          let group_exist = this.groupAll.filter(x => x.group_name.toUpperCase() == group_name.toUpperCase());

          this.userarry = this.modaltype[0].GROUP_USER;

          if (this.userarry.length == 2) {

            let received_user = this.userarry.filter(x => x.USER_INFO_ID != this.user.UserInfoId);

            this.itemdata = received_user;
            this.show_user_list = 1;
            this.show_user_list_all = 0;
            this.show_archive_chat_user = 0;
            this.show_signle_chat = 1;
            this.show_chat_tap = 1;
            this.show_group_member_add = 0;
            this.USER_INFO_ID = received_user[0].USER_INFO_ID;
            this.header_name = received_user[0].USER_SURNAME;
            this.user_status = received_user[0].STATUS;
            this.received_user_id = received_user[0].USER_INFO_ID;
            this.singlemessages = this.msg_array.filter(x => (x.sender_id == received_user[0].USER_INFO_ID && x.receiver_id == this.user.UserInfoId) || (x.receiver_id == received_user[0].USER_INFO_ID && x.sender_id == this.user.UserInfoId));
            this.singlemessages = this.singlemessages.filter(x => (x.clear_ids ? (x.clear_ids.indexOf(this.user.UserInfoId) == -1) : true));
            localStorage.setItem('Chat', '1');
            this.onFocus();
          } else {

            if (group_exist.length == 0) {

              this.db.list('/group_chat').push({
                group_name: group_name,
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
                    profile_img_id: this.userarry[i].USER_PROFILE_IMG_ID
                  });
                }

              }).then(() => {

                this.group_user_names = '';

                for (let i = 0; i < this.userarry.length; i++) {
                  this.group_user_names += this.userarry[i].USER_SURNAME + ',';
                }

                this.show_user_list = 1;
                this.show_user_list_all = 0;
                this.show_archive_chat_user = 0;
                this.show_group_members = 1;
                this.show_chat_tap = 1;
                this.show_create_btn = 0;
                this.show_signle_chat = 2;
                this.show_group_chat = 0;
                this.show_group_chat_message = 1;
                this.header_name = group_name;
                this.msg_grpup_name = group_name;
                this.show_group_chat_box = 1;
                this.show_group_details = 0;
                this.show_group_member_add = 0;

                localStorage.setItem('Chat', '1');

              });

            } else {
              this.group_user_names = '';

              for (let i = 0; i < this.userarry.length; i++) {
                this.group_user_names += this.userarry[i].USER_SURNAME + ',';
              }
              this.groupmessages = this.groupmessagesAll.filter(x => x.group_name == group_name);

              this.show_user_list = 1;
              this.show_user_list_all = 0;
              this.show_archive_chat_user = 0;
              this.show_group_members = 1;
              this.show_chat_tap = 1;
              this.show_create_btn = 0;
              this.show_signle_chat = 2;
              this.show_group_chat = 0;
              this.show_group_chat_message = 1;
              this.header_name = group_name;
              this.msg_grpup_name = group_name;
              this.show_group_chat_box = 1;
              this.show_group_details = 0;
              this.show_group_member_add = 0;
              localStorage.setItem('Chat', '1');
              this.onFocus();

            }
          }

        }
      }
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.contentArea.scrollToBottom) {
        this.contentArea.scrollToBottom(0);
      }
    })
  }

  goToTaskDetail(seq_text: any) {
    let task_val = seq_text;
    if (task_val != '') {
      let data = {
        SearchData: task_val,
        UserInfoId: this.user.UserInfoId
      }

      this.presentLoadingDefault(true);
      this.authService.postData(data, 'task/TaskManagementSearch').then((result) => {
        this.tasksearchlist = result;
        this.presentLoadingDefault(false);
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };

        this.myModalData = [
          this.tasksearchlist,
          'Search',
          task_val
        ];

        let myModal: Modal = this.modal.create('TaskManagementDetailPage', { data: this.myModalData }, myModalOptions);
        myModal.present();
        myModal.onDidDismiss((data) => {

        });
        myModal.onWillDismiss((data) => {
        });
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });

    }
  }

  getItems(searchbar) {

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

  empty() {

  }

  selectMessageItem(key) {
    let index = this.message_select_ids.indexOf(key);
    if (index == -1) {
      this.message_select_ids.push(key);
    } else {
      this.message_select_ids.splice(index, 1);
    }
  }

  messageDelete() {

    if (this.message_select_ids.length > 0) {
      for (let i in this.message_select_ids) {
        let item = this.db.list('/user_message/' + this.message_select_ids[i]);
        item.remove().catch((err) => { console.log(err); });
      }
    }
    this.message_select_ids = [];
  }

  selectChatUserItem(data) {
    let index = this.user_select_ids.indexOf(data.user_id);
    if (index == -1) {
      this.user_select_ids.push(data.user_id);
    } else {
      this.user_select_ids.splice(index, 1);
    }
  }

  chatUserDelete() {
    if (this.user_select_ids.length > 0) {
      for (let i in this.user_select_ids) {
        let user_id = this.user_select_ids[i];
        let msgList = this.msg_array.filter(x => (x.sender_id == this.user.UserInfoId && x.receiver_id == user_id) || (x.receiver_id == this.user.UserInfoId && x.sender_id == user_id));
        for (let i in msgList) {
          let item = this.db.list('/user_message/' + msgList[i].key);
          item.remove().catch((err) => { console.log(err); });
        }
      }
    }
    this.user_select_ids = [];
    this.singlechatnav();
    this.show_archive_chat_user = 0;
  }

  chatUserArchive() {
    let loginUserList = this.db.list('/chat_user');
    let user = this.chat_user_array.filter(x => (x.user_id == this.user.UserInfoId));
    let key = user.length > 0 ? user[0].key : null;
    let archive_ids = user.length > 0 ? user[0].archive_ids ? user[0].archive_ids : [] : []
    if (this.user_select_ids.length > 0) {

      for (let i in this.user_select_ids) {
        let ind = archive_ids.indexOf(this.user_select_ids[i]);
        if (ind == -1)
          archive_ids.push(this.user_select_ids[i]);
      }
      if (key) {
        loginUserList.update(key, { archive_ids: archive_ids }).catch((err) => { console.log(err) });
      }
    }
    this.user_select_ids = [];
  }

  showArchiveUserChat(mode) {

    if (mode == 1) {
      this.show_archive_chat_user = mode;
      this.show_signle_chat = -1;
      this.show_user_list = 1;
    } else {
      this.show_archive_chat_user = mode;
      this.show_signle_chat = 0;
      this.show_user_list = 0;
    }
    this.user_select_ids = [];
  }

  chatUserArchiveRemove() {
    let loginUserList = this.db.list('/chat_user');
    let user = this.chat_user_array.filter(x => (x.user_id == this.user.UserInfoId));
    let key = user.length > 0 ? user[0].key : null;
    let archive_ids = user.length > 0 ? user[0].archive_ids ? user[0].archive_ids : [] : []
    if (this.user_select_ids.length > 0) {
      for (let i in this.user_select_ids) {
        archive_ids = archive_ids.filter(x => x != this.user_select_ids[i]);
        this.ChatArchiveUser = this.ChatArchiveUser.filter(x => x.user_id != this.user_select_ids[i]);
      }
      if (key) {
        loginUserList.update(key, { archive_ids: archive_ids }).catch((err) => { console.log(err) });
      }
    }
    this.user_select_ids = [];
    if (this.ChatArchiveUser.length == 0) {
      this.singlechatnav();
      this.show_archive_chat_user = 0;
    }
  }

  messageForward() {
    this.show_forword_user = 1;
    this.show_signle_chat = -1;
  }


  getForwordUser(searchbar) {

    var q = searchbar.value;
    if (q.trim() == '') {
      this.ForwordUserList = this.userdetailsAll;
      return;
    }
    this.ForwordUserList = this.userdetailsAll.filter((v) => {
      if (v.USER_SURNAME.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })

  }

  deleteForwordUser(index: any, USER_INFO_ID: any) {
    var index = this.userarry.findIndex(item => item.USER_INFO_ID == USER_INFO_ID);
    if (index > -1) {
      this.userarry.splice(index, 1);
    }
  }

  selectForwordUser(item) {

    let UserExistresult = this.getCheckUserExist(item);

    if (!UserExistresult) {
      this.userarry.push(item);
    } else {
      this.presentToast('User Already selected.');
    }
  }

  getCheckUserExist(item) {
    for (let i = 0; i < this.userarry.length; i++) {
      if (this.userarry[i].USER_INFO_ID == item.USER_INFO_ID) {
        return true;
      }
    }

  }

  SendForwordMessage() {
    if (this.message_select_ids.length > 0 && this.userarry.length > 0) {
      for (let i in this.userarry) {
        let reciverData = this.userarry[i];
        for (let j in this.message_select_ids) {
          this.db.list('/user_message/' + this.message_select_ids[j] + '/').snapshotChanges().subscribe(x => {
            let item: any = {}
            x.forEach(n => item[n.payload.key] = n.payload.val());
            this.message = item.message;
            this.fileUri = item.file_uri; this.fileExtn = item.file_type;
            this.userSendMessage(this.user.UserInfoId, reciverData.USER_INFO_ID, 1);
          })
        }
      }
    }
    this.message_select_ids = [];
    this.userarry = [];
    this.show_forword_user = 0;
    this.show_signle_chat = 1;
  }

  openAttach() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Attachment',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Take photo',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'ios-camera-outline' : null,
          handler: () => {
            this.takePhoto();
          }
        },
        {
          text: 'Choose photo from Gallery',
          icon: !this.platform.is('ios') ? 'ios-images-outline' : null,
          handler: () => {
            this.openGallery();
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 50, // picture quality
      destinationType: this.camera.DestinationType.NATIVE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }
    this.camera.getPicture(options).then((imageData) => {
      //   let imageURI = imageData;
      this.chatService.filemsgstore(imageData, 'image/jpeg', 'jpeg').then(storageUrl => {
        //console.log(storageUrl);
        this.fileUri = storageUrl; this.message = 'JPEG'; this.fileExtn = 'jpeg';
        if (this.show_signle_chat == 2) {
          // file upload for group chat
          this.sendGroupMessage(this.user.UserInfoId, this.received_user_id, this.roi_comment_id, 0);

        } else {
          // file upload for single chat
          this.userSendMessage(this.user.UserInfoId, this.received_user_id, 0);
        }
      })
    }, (err) => {
      console.log(err);
    });
  };

  openGallery() {
    // const options : CameraOptions = {
    //   quality: 100, // picture quality
    //   destinationType: this.camera.DestinationType.NATIVE_URI,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    // }
    // this.camera.getPicture(options).then((imageData) => {
    //     this.fileUri = imageData; this.message='image';
    //     this.userSendMessage(this.user.UserInfoId, this.received_user_id,1);
    //   }, (err) => {
    //     console.log(err);
    //   });

    this.chooser.getFile('*').then((file) => {
      let name = file.name;
      let extAry = name.split('.');
      let extn = extAry.length > 0 ? extAry[extAry.length - 1] : '';
      if (extn) {
        this.presentLoadingDefault(true);
        this.chatService.filemsgstore(file.uri, file.mediaType, extn).then(storageUrl => {
          this.fileUri = storageUrl;
          this.message = extn.toUpperCase(); this.fileExtn = extn;
          this.presentLoadingDefault(false);
          if (this.show_signle_chat == 2) {
            // file upload for group chat
            this.sendGroupMessage(this.user.UserInfoId, this.received_user_id, this.roi_comment_id, 0);

          } else {
            // file upload for single chat
            this.userSendMessage(this.user.UserInfoId, this.received_user_id, 0);
          }
        }).catch(err => { this.presentToast(err); this.presentLoadingDefault(false); });
      } else {
        this.presentToast('Please choose vaild file.')
      }
    }).catch(err => this.presentToast(err));
  };

  getChatFile(message) {
    let extn = message.file_type;
    extn = extn ? extn.toLowerCase() : '';
    if (message) {
      if (extn == "gif" || extn == "jpeg" || extn == "png" || extn == "jpg") {
        return message.file_uri;
      } else if (extn == "xlsx" || extn == "xls") {
        return `./assets/imgs/excel-thumbnail.png`
      } else if (extn == "doc" || extn == "docx") {
        return `./assets/imgs/word-thumbnail.jpg`
      } else if (extn == "ppt") {
        return `./assets/imgs/ppt-thumbnail.png`
      } else if (extn == 'pdf') {
        return `./assets/imgs/PDF-thumbnail.png`
      } else if (extn == 'mp4' || extn == 'm4a' || extn == 'm4v' || extn == 'f4v' || extn == 'f4a' || extn == 'm4b' || extn == 'm4r' || extn == 'f4b' || extn == 'mov' || extn == '3gp' || extn == '3gp2' || extn == '3g2' || extn == '3gpp' || extn == '3gpp2' || extn == 'ogg' || extn == 'oga' || extn == 'ogv' || extn == 'ogx' || extn == 'wmv' || extn == 'wma' || extn == 'asf*') {
        return `./assets/imgs/video-thumbnail.jpg`
      } else {
        return `./assets/imgs/unknown.png`
      }
    } else {
      return `./assets/imgs/no-found-photo.png`
    }
  }

  downloadChatFile(message) {
    this.chatService.getFirebaseFileUri(message.file_uri).then((url) => {
      const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
      //here encoding path as encodeURI() format.  
      let _url = message.file_uri; //'https://firebasestorage.googleapis.com/v0/b/fp-app-8afb9.appspot.com/o/chatfiles%2F66f373a7-6681793b-ed50c873-977b9eb9.jpeg?alt=media&token=1d499c9e-b1d9-4d92-bd7e-3f9a6a11e39d' // encodeURI(url.toString());  
      let fileName = this.chatService.guid() + '.' + message.file_type;
      let extn = message.file_type;
      //  here initializing object.  
      this.fileTransfer = this.transfer.create();
      // here iam mentioned this line this.file.externalRootDirectory is a native pre-defined file path storage. You can change a file path whatever pre-defined method.  
      this.fileTransfer.download(_url, writeDirectory + fileName, true).then((entry) => {
        //here logging our success downloaded file path in mobile.  
        let content_type = this.constant.fileTypes.filter(x => x.name == extn.toUpperCase())
        this.presentToast('download completed');
        this.fileOpener.open(entry.toURL(), content_type.type)
          .catch(() => {
            console.log('Error opening pdf file');

          });
      }, (error) => {
        //here logging our error its easier to find out what type of error occured.  
        this.presentToast('download failed: ' + error.exception);
      });
      //   var xhr = new XMLHttpRequest();
      // xhr.responseType = 'blob';
      // xhr.onload = function(event) {
      //   var blob = xhr.response;
      // };
      // xhr.open('GET', _url);
      // xhr.send();
    }).catch(err => console.log(err))
  }

  presentLoadingCustom(show) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img width = 50 height= 50 src="assets/imgs/logo_new.png" />`,
      duration: 5000
    });

    if (show) {
      loading.present();
    } else {
      loading.dismissAll();
      loading = null
    }
  }


}
