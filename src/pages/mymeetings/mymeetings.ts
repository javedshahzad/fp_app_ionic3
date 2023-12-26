import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import * as moment from 'moment';

@Component({
  selector: 'page-mymeetings',
  templateUrl: 'mymeetings.html',
})
 
export class MyMeetingsPage {

  today: any;
  taskcommentsForm: FormGroup;
  taskcommentseditForm: FormGroup;
  taskUploadsForm: FormGroup;
  form: FormGroup;
  taskcomments: any;
  show_comment_list: any;
  CommentsList: any;
  taskweekcomments: any;
  comment_data: any;
  date: any;
  label_title: any;
  editcomment: any;
  COMMENTS_ID: any;
  file_name: any;
  size: any;
  imageURI: any;
  downloadUrl: any;
  taskuploadsdetails: any;
  read_more_value: any;
  type_string: any;
  taskcommentscount = {
    Result: [] as any,
    Object: [] as any,
    Ideas: [] as any
  } as any;
  removefeild = [] as any;
  weekly_R: any;
  weekly_I: any;
  weekly_O: any;
  show_list = -1;
  CommentsList_filter: any;
  CommentsListdata: any;
  showplaceholder: any;
  show_comment_attachment = 1;
  single: any;
  label_type = '';
  modalData = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  meeting: string = "Upcoming Meetings";
  isAndroid: boolean = false;
  momListAll: any;
  momListAllSearch: any;
  momConfirmListAll: any;
  momConfirmListAllSearch: any;
  momActionPointListAll: any;
  momPdfActionPoint: any;
  searchData = { "search_value": "" };
  pet: string = "pending";
  tab_name: any;
  momSubConfirmListAll: any;
  momSubConfirmListAllSearch: any;
  momArchiveConfirmListAll: any;
  momArchiveConfirmListAllSearch: any;
  momArchivePdfListAll: any;
  momArchiveListAllSearch: any;
  momPdfHeaderListAll: any;
  attendees_array = [] as any;
  attendees = '';
  
  send_to_email_array = [] as any;
  momArchiveActionPointPdfList: any;
  momArchiveActionPointPdfListfilter: any;
  momPointsListAll: any;
  
  letterObj = {
    to: '',
    from: '',
    text: ''
  }

  externalDataRetrievedFromServer = [
    { name: 'Bartek', age: 34 },
    { name: 'John', age: 27 },
    { name: 'Elizabeth', age: 30 },
  ];

  pdfObj = null;
  groudetails:any;

  constructor(public platform: Platform, public navCtrl: NavController,
    public navParams: NavParams, public authService: RestProvider,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public view: ViewController, private modal: ModalController,
    private file: File, private fileOpener: FileOpener
  ) {

    this.isAndroid = platform.is('android');
    this.user = this.user ? JSON.parse(this.user) : {};
    this.today = Date.now();
  }

  
  createtask() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModalData = []
    let myModal: Modal = this.modal.create(CreateTaskPage, {}, myModalOptions);
    myModal.present();
    myModal.onDidDismiss((data) => {    
    });
    myModal.onWillDismiss((data) => {
    });

  }

  ionViewDidLoad() {
    let modalData = this.navParams.get('data');
    let status = 1;
    this.getMeetingListAll(status);
    if (modalData != undefined) {
      this.pet = "confirm";
      this.getMeetingConfirmListAll(2);
    }
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

  closeModal() {
    this.view.dismiss();
  }

  
  goBack() {
    this.navCtrl.setRoot(DashboardPage);
  }

  getMeetingListAll(status: any) {
    let time_bf = new Date();
    let params = {} as any;
    params.user_info_id = this.user.UserInfoId;
    params.status = status;

    this.authService.postData(params, 'task/getListOfMinutesOfMeeting').then((result) => {
      this.momListAll = result;
      this.momListAllSearch = result;
      console.log(this.momListAll);
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log(' mom draft Seconds:', seconds);
    }, (err) => {
      console.log(err);
    });
  }

  getMeetingConfirmListAll(status: any) {
    let time_bf = new Date();
    let modalData = this.navParams.get('data');
    let mom_id    = 0;

    if (modalData != undefined) {
      mom_id = modalData[0].mom_id;
    } else {
      mom_id = 0;
    }

    let params = {} as any;
    params.user_info_id = this.user.UserInfoId;
    params.status = status;
    params.mom_id = mom_id

    this.authService.postData(params, 'task/getMyMeetingsList').then((result) => {
      this.momConfirmListAll = result;
      this.momConfirmListAllSearch = result;
      console.log('Confirm list', this.momConfirmListAll);
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log(' mom Confirm Seconds:', seconds);
    }, (err) => {
      console.log(err);
    });

  }

  getArchiveMeetingListAll(status: any) {
    let time_bf = new Date();
    let modalData = this.navParams.get('data');
    let mom_id = 0;
    if (modalData != undefined) {
      mom_id = modalData[0].mom_id;
    } else {
      mom_id = 0;
    }

    let params = {} as any;
    params.user_info_id = this.user.UserInfoId;
    params.status = status;
    params.mom_id = mom_id

    this.authService.postData(params, 'task/getArchiveMyMeetingsList').then((result) => {
      this.momArchiveConfirmListAll = result;
      this.momArchiveConfirmListAllSearch = result;
      console.log('Confirm list', this.momArchiveConfirmListAll);
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log(' mom archive Seconds:', seconds);
    }, (err) => {
      console.log(err);
    });

  }

  getSubMeetingConfirmListAll(mom_id: any) {
    let time_bf = new Date();
    let params = {} as any;
    params.user_info_id = this.user.UserInfoId;
    params.status = 2;
    params.mom_id = mom_id

    this.authService.postData(params, 'task/getSubMyMeetingsList').then((result) => {
      this.momSubConfirmListAll = result;
      this.momSubConfirmListAllSearch = result;
      console.log(this.momSubConfirmListAll);
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log(' mom sub meeting Seconds:', seconds);
    }, (err) => {
      console.log(err);
    });
  }

  getArchiveSubMeetingConfirmListAll(mom_id: any) {
    let time_bf = new Date();
    let params = {} as any;
    params.user_info_id = this.user.UserInfoId;
    params.status = 2;
    params.mom_id = mom_id

    this.authService.postData(params, 'task/getArchiveSubMyMeetingsList').then((result) => {
      this.momSubConfirmListAll = result;
      this.momSubConfirmListAllSearch = result;
      console.log(this.momSubConfirmListAll);
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log(' mom archive sub meeting Seconds:', seconds);
    }, (err) => {
      console.log(err);
    });
  }

  showBtn = -1;
  isOpen  = false;
  oldBtn  = -1;
  showUndoBtn(index: any, mom_id: any) {
    this.getSubMeetingConfirmListAll(mom_id);
    if (this.isOpen == false) {
      this.isOpen = true;
      this.oldBtn = index;
      this.showBtn = index;
    } else {
      if (this.oldBtn == index) {
        this.isOpen = false;
        this.showBtn = -1;
        this.oldBtn = -1;
      } else {
        this.showBtn = index;
        this.oldBtn = index;
      }
    }
  }

  showarchiveBtn = -1;
  isarchiveOpen  = false;
  oldarchiveBtn  = -1;
  showUndoArchiveBtn(index: any, mom_id: any) {
    this.getArchiveSubMeetingConfirmListAll(mom_id);
    if (this.isarchiveOpen == false) {
      this.isarchiveOpen = true;
      this.oldarchiveBtn = index;
      this.showarchiveBtn = index;
    } else {
      if (this.oldarchiveBtn == index) {
        this.isarchiveOpen = false;
        this.showarchiveBtn = -1;
        this.oldarchiveBtn = -1;
      } else {
        this.showarchiveBtn = index;
        this.oldarchiveBtn = index;
      }
    }
  }


  openMyMom(mom_id: any, title: any, meetinDate: any, prepared_by: any, status: any, next_meeting_date: any, organizer_name:any,created_on:any,user_email:any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      mom_id: mom_id,
      title: title,
      meetinDate: meetinDate,
      organizer: organizer_name,
      status: status,
      next_meeting_date: next_meeting_date,
      prepared_by:prepared_by,
      created_on: created_on,
      user_email: user_email
    }]

    let modelpage = '';
    modelpage = 'MyMinutesOfMeetingEditPage';

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
      this.getMeetingListAll(1);
    });
    myModal.onWillDismiss((data) => {
    });
  }

  createmom() {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let modelpage = '';
    modelpage = 'CreateMomPage';

    let myModal: Modal = this.modal.create(modelpage, {}, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
      let status = 1;
      this.getMeetingListAll(status);
    });

    myModal.onWillDismiss((data) => {
    });

  }


  createusergroup() {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let modelpage = '';
    modelpage = 'CreateUserGroupPage';

    let myModal: Modal = this.modal.create(modelpage, {}, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {      
    });

    myModal.onWillDismiss((data) => {
    });

  }

  updateUserGroup(ID:any, GROUP_NAME:any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      group_id: ID,
      group_name: GROUP_NAME
    }]

    let modelpage = '';
    modelpage = 'UpdateUserGroupPage';

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
      let status = 1;
      this.getMeetingListAll(status);
    });

    myModal.onWillDismiss((data) => {
    });

  }


  createmomchild(mom_id: any,tab_name:any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      parent_mom_id: mom_id,
      tab_name: tab_name
    }]

    let modelpage = '';
    modelpage = 'CreateMomPage';

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
      let status = 1;
      this.getMeetingListAll(status);
    });
    myModal.onWillDismiss((data) => {
    });

  }

  segmentChanged(event) {
    console.log(event.value);
    let tabValue = event.value;
    this.tab_name = event.value;
    if (tabValue == 'pending') {
      this.getMeetingListAll(1);
    } else if (tabValue == 'confirm') {
      this.getMeetingConfirmListAll(2);
    } else if (tabValue == 'archive') {
      this.getArchiveMeetingListAll(2);
    }else if (tabValue == 'Usergroup') {
      this.getusergroup();
    }
  }

  createPdf(ID: any, MEETING_DATE: any, TITLE: any, NEXT_MEETING_DATE: any, ACTION_BY_NAME: any, USER_SURNAME: any, CREATED_ON: any,ORGANIZER_NAME:any) {

    let next_meeting_date = '';
    let meeting_date = moment(MEETING_DATE).format("DD-MM-YYYY");
    let created_on = moment(CREATED_ON).format("DD-MM-YYYY hh:mm A")

    if (NEXT_MEETING_DATE != '' && NEXT_MEETING_DATE != null) {
      next_meeting_date = moment(NEXT_MEETING_DATE).format("DD-MM-YYYY")
    } else {
      next_meeting_date = '-';
    }

    let status = 2;

    let params = {} as any;
    params.user_info_id = this.user.UserInfoId;
    params.status = status;
    params.mom_id = ID;

    this.authService.postData(params, 'task/getMomPdfActionPointList').then((result) => {
      this.momActionPointListAll = result;
      console.log('Action Points list', this.momActionPointListAll);
      this.momPointsListAll = this.momActionPointListAll.filter(x => x.ACTION_POINTS != null);

      this.attendees = this.momActionPointListAll[0].ATTENDEES_NAME;
      let length = 1;

      for (var i = 0; i < this.momActionPointListAll.length; i++) {
        let completed_date = '';

        if (this.momActionPointListAll[i].COMPLETED_DATE != null) {
          completed_date = moment(this.momActionPointListAll[i].COMPLETED_DATE).format("DD-MM-YYYY")
        } else {
          completed_date = '';
        }

        this.momActionPointListAll[i].COMPLETED_DATE = completed_date;

        // if(this.momActionPointListAll[i].ACTION_BY_NAME != "" && this.momActionPointListAll[i].ACTION_BY_NAME != null){
        //   var action_by_name_array = this.momActionPointListAll[i].ACTION_BY_NAME.split(',');
        //   for (let j = 0; j < action_by_name_array.length; j++) {
        //     if (this.attendees_array.indexOf(action_by_name_array[j]) === -1) {
        //       this.attendees_array.push(action_by_name_array[j]);
        //     }
        //   }
        // }                

        if(this.momActionPointListAll[i].TO_EMAIL != "" && this.momActionPointListAll[i].TO_EMAIL!= null){
          var email_to_array = this.momActionPointListAll[i].TO_EMAIL.split(',');
          for (let k = 0; k < email_to_array.length; k++) {
            if (this.attendees_array.indexOf(email_to_array[k]) === -1) {
              this.attendees_array.push(email_to_array[k]);
              this.send_to_email_array.push(email_to_array[k]);
            }
          }
        }
        

        if (this.momActionPointListAll.length == length) {
          // let flag = this.attendees_array.includes(this.user.Surname);

          // if (!flag) {
          //   this.attendees_array.push(this.user.Surname);
          // }

          // let flag_org = this.attendees_array.includes(ORGANIZER_NAME);

          // if (!flag_org) {
          //   this.attendees_array.push(ORGANIZER_NAME);
          // }
          this.attendees = this.attendees+','+this.arrayToString(this.attendees_array);
          console.log(this.attendees);
        }
        length++;

      }


      var docDefinition = {
        content: [
          { text: 'Minutes of the Meeting', style: 'header', decoration: 'underline' },
          '                                                  ',
          '                                                  ',
          {
            style: 'tableExample',
            table: {
              widths: [125, 350],
              heights: ['auto', 'auto', 'auto', 'auto'],
              body: [
                [{ text: 'Date of Meeting', bold: true }, { text: meeting_date, bold: true }],
                [{ text: 'Purpose', bold: true }, { text: TITLE, bold: true }],
                [{ text: 'Attendees', bold: true }, { text: this.attendees, bold: true }],
                [{ text: 'Next Meeting', bold: true }, { text: next_meeting_date, bold: true }]
              ]
            }
          },
          { text: 'Organizer: ' + ORGANIZER_NAME, bold: true },
          { text: 'Prepared by: '+ USER_SURNAME, bold: true},
          { text: 'Created On: ' + created_on, bold: true },
          '                                                         ',
          '                                                         ',
          this.table(this.momPointsListAll, ['ROW_NUMBER', 'ACTION_POINTS', 'ACTION_BY_NAME', 'COMPLETED_DATE'], ['S.No', 'Action Points', 'Action By', 'When'])

        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center'
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 15, 0, 0]
          },
          story: {
            italic: true,
            alignment: 'center',
            width: '50%',
          },
          itemsTableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          }
        }
      }
      this.pdfObj = pdfMake.createPdf(docDefinition);

      let file_name = 'Mom_' + meeting_date + '.pdf';

      if (this.platform.is('cordova')) {
        this.pdfObj.getBuffer((buffer) => {
          var blob = new Blob([buffer], { type: 'application/pdf' });
          const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
          // Save the PDF to the data Directory of our App
          this.file.writeFile(writeDirectory, file_name, blob, { replace: true }).then(fileEntry => {
            // Open the PDf with the correct OS tools
            this.fileOpener.open(writeDirectory + file_name, 'application/pdf');
          })
        });
      } else {
        // On a browser simply use download!
        this.pdfObj.download();
      }

    }, (err) => {
      console.log(err);
    });

  }


  createPdfAll(ID: any, MEETING_DATE: any, TITLE: any, NEXT_MEETING_DATE: any, ACTION_BY_NAME: any, USER_SURNAME: any, CREATED_ON: any) {

    let next_meeting_date = '';
    let meeting_date = moment(MEETING_DATE).format("DD-MM-YYYY");
    let created_on = moment(CREATED_ON).format("DD-MM-YYYY hh:mm A")

    if (NEXT_MEETING_DATE != '' && NEXT_MEETING_DATE != null) {
      next_meeting_date = moment(NEXT_MEETING_DATE).format("DD-MM-YYYY")
    } else {
      next_meeting_date = '-';
    }

    let status = 2;

    let params = {} as any;
    params.user_info_id = this.user.UserInfoId;
    params.status = status;
    params.mom_id = ID;

    this.authService.postData(params, 'task/getMomPdfActionPointAllSub').then((result) => {
      this.momActionPointListAll = result;
      console.log('Action Points list', this.momActionPointListAll);

      let length = 1;
      for (var i = 0; i < this.momActionPointListAll.length; i++) {
        let completed_date = '';

        if (this.momActionPointListAll[i].COMPLETED_DATE != null) {
          completed_date = moment(this.momActionPointListAll[i].COMPLETED_DATE).format("DD-MM-YYYY")
        } else {
          completed_date = '';
        }

        this.momActionPointListAll[i].COMPLETED_DATE = completed_date;

        if(this.momActionPointListAll[i].ACTION_BY_NAME != "" && this.momActionPointListAll[i].ACTION_BY_NAME != null){
          var action_by_name_array = this.momActionPointListAll[i].ACTION_BY_NAME.split(',');
          for (let j = 0; j < action_by_name_array.length; j++) {
            if (this.attendees_array.indexOf(action_by_name_array[j]) === -1) {
              this.attendees_array.push(action_by_name_array[j]);
            }
          }
        }                

        if (this.momActionPointListAll.length == length) {

          let flag = this.attendees_array.includes(this.user.Surname);

          if (!flag) {
            this.attendees_array.push(this.user.Surname);
          }

          let flag_org = this.attendees_array.includes(USER_SURNAME);

          if (!flag_org) {
            this.attendees_array.push(USER_SURNAME);
          }

          this.attendees = this.arrayToString(this.attendees_array);
          console.log(this.attendees);
        }
        length++;
      }


      var docDefinition = {
        content: [
          { text: 'Minutes of the Meeting', style: 'header', decoration: 'underline' },
          '                                                  ',
          '                                                  ',
          {
            style: 'tableExample',
            table: {
              widths: [125, '*'],
              heights: ['auto', 'auto', 'auto', 'auto'],
              body: [
                [{ text: 'Date of Meeting', bold: true }, { text: meeting_date, bold: true }],
                [{ text: 'Purpose', bold: true }, { text: TITLE, bold: true }],
                [{ text: 'Attendees', bold: true }, { text: this.attendees, bold: true }],
                [{ text: 'Next Meeting', bold: true }, { text: next_meeting_date, bold: true }]
              ]
            }
          },
          { text: 'Organizer: ' + USER_SURNAME, bold: true },
          { text: 'Created On: ' + created_on, bold: true },
          '                                                         ',
          '                                                         ',
          this.table(this.momActionPointListAll, ['ROW_NUMBER', 'ACTION_POINTS', 'ACTION_BY_NAME', 'COMPLETED_DATE'], ['S.No', 'Action Points', 'Action By', 'When'])

        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center'
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 15, 0, 0]
          },
          story: {
            italic: true,
            alignment: 'center',
            width: '50%',
          },
          itemsTableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          }
        }
      }

      this.pdfObj = pdfMake.createPdf(docDefinition);

      let file_name = 'Mom_' + meeting_date + '.pdf';

      if (this.platform.is('cordova')) {
        this.pdfObj.getBuffer((buffer) => {
          var blob = new Blob([buffer], { type: 'application/pdf' });
          const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
          // Save the PDF to the data Directory of our App
          this.file.writeFile(writeDirectory, file_name, blob, { replace: true }).then(fileEntry => {
            // Open the PDf with the correct OS tools
            this.fileOpener.open(writeDirectory + file_name, 'application/pdf');
          })
        });
      } else {
        // On a browser simply use download!
        this.pdfObj.download();
      }

    }, (err) => {
      console.log(err);
    });

  }


  arrayToString(arr) {
    let str = '';
    arr.forEach(function (i, index) {
      str += i;
      if (index != (arr.length - 1)) {
        str += ', ';
      };
    });
    return str;
  }

  table(data, columns, display) {
    return {
      table: {
        headerRows: 1,
        body: this.buildTableBody(data, columns, display)
      }
    };
  }

  buildTableBody(data, columns, display) {
    var body = [];

    body.push(display);

    data.forEach(function (row) {
      var dataRow = [];

      columns.forEach(function (column) {
        dataRow.push(row[column]);
      })

      body.push(dataRow);
    });

    return body;
  }

  downloadPdf() {
    if (this.platform.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

  SearchTaskDetail() {
    let task_val = this.searchData.search_value;

    if (this.tab_name == 'pending') {

      if (task_val != '') {
        this.momListAll = this.momListAllSearch.filter((item) => {
          let _val = item['TITLE'] ? item['TITLE'].toString().toUpperCase() : '';
          return _val.includes(task_val.toUpperCase())
        })
      } else {
        this.momListAll = this.momListAllSearch
      }

    } else if (this.tab_name == 'confirm') {
      if (task_val != '') {
        this.momConfirmListAll = this.momConfirmListAllSearch.filter((item) => {
          let _val = item['TITLE'] ? item['TITLE'].toString().toUpperCase() : '';
          return _val.includes(task_val.toUpperCase())
        })
      } else {
        this.momConfirmListAll = this.momConfirmListAllSearch
      }

    } else if (this.tab_name == 'archive') {
      if (task_val != '') {
        this.momArchiveConfirmListAll = this.momArchiveConfirmListAllSearch.filter((item) => {
          let _val = item['TITLE'] ? item['TITLE'].toString().toUpperCase() : '';
          return _val.includes(task_val.toUpperCase())
        })
      } else {
        this.momArchiveConfirmListAll = this.momArchiveConfirmListAllSearch
      }

    }

  }

  archiveMom(mom_id: any) {

    this.presentLoadingDefault(true);
    let task_insert_data = {
      mom_id: mom_id,
      user_info_id: this.user.UserInfoId
    }

    this.authService.postData(task_insert_data, 'task/getArchiveminutesofmeetings').then((result) => {
      this.presentLoadingDefault(false);
      this.ionViewDidLoad();
    }, err => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  
  deleteMom(mom_id: any) {

    this.presentLoadingDefault(true);
    let task_insert_data = {
      mom_id: mom_id,
      user_info_id: this.user.UserInfoId
    }

    this.authService.postData(task_insert_data, 'task/getDeleteMinutesOfMeetings').then((result) => {
      this.presentLoadingDefault(false);
      this.ionViewDidLoad();
    }, err => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }


  undoArchiveMom(mom_id: any) {

    this.presentLoadingDefault(true);
    let task_insert_data = {
      mom_id: mom_id,
      user_info_id: this.user.UserInfoId
    }

    this.authService.postData(task_insert_data, 'task/getUndoArchiveMomList').then((result) => {
      this.presentLoadingDefault(false);
      this.ionViewDidLoad();
    }, err => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  createPdfArchive(ID: any, MEETING_DATE: any, TITLE: any, NEXT_MEETING_DATE: any, ACTION_BY_NAME: any, USER_SURNAME: any, CREATED_ON: any,ORGANIZER_NAME:any) {

    let next_meeting_date = '';
    let meeting_date = moment(MEETING_DATE).format("DD-MM-YYYY");
    let created_on = moment(CREATED_ON).format("DD-MM-YYYY hh:mm A")

    if (NEXT_MEETING_DATE != '' && NEXT_MEETING_DATE != null) {
      next_meeting_date = moment(NEXT_MEETING_DATE).format("DD-MM-YYYY")
    } else {
      next_meeting_date = '-';
    }

    let status = 2;

    let params = {} as any;
    params.user_info_id = this.user.UserInfoId;
    params.status = status;
    params.mom_id = ID;

    this.authService.postData(params, 'task/getArchiveMomPdfActionPointList').then((result) => {
      this.momActionPointListAll = result;      
      this.momPointsListAll = this.momActionPointListAll.filter(x => x.ACTION_POINTS != null);
      console.log('Action Points list', this.momActionPointListAll);
      
      let length = 1;

      for (var i = 0; i < this.momActionPointListAll.length; i++) {
        let completed_date = '';

        if (this.momActionPointListAll[i].COMPLETED_DATE != null) {
          completed_date = moment(this.momActionPointListAll[i].COMPLETED_DATE).format("DD-MM-YYYY");
        } else {
          completed_date = '';
        }
        this.momActionPointListAll[i].COMPLETED_DATE = completed_date;

        if(this.momActionPointListAll[i].ACTION_BY_NAME !="" && this.momActionPointListAll[i].ACTION_BY_NAME != null){
          var action_by_name_array = this.momActionPointListAll[i].ACTION_BY_NAME.split(',');
          for (let j = 0; j < action_by_name_array.length; j++) {
            if (this.attendees_array.indexOf(action_by_name_array[j]) === -1) {
              this.attendees_array.push(action_by_name_array[j]);
            }
          }
        }

        if(this.momActionPointListAll[i].TO_EMAIL != "" && this.momActionPointListAll[i].TO_EMAIL!= null){
          var email_to_array = this.momActionPointListAll[i].TO_EMAIL.split(',');
          for (let k = 0; k < email_to_array.length; k++) {
            if (this.attendees_array.indexOf(email_to_array[k]) === -1) {
              this.attendees_array.push(email_to_array[k]);
              this.send_to_email_array.push(email_to_array[k]);
            }
          }
        }
        
        if (this.momActionPointListAll.length == length) {
          let flag = this.attendees_array.includes(this.user.Surname);

          if (!flag) {
            this.attendees_array.push(this.user.Surname);
          }

          let flag_org = this.attendees_array.includes(ORGANIZER_NAME);

          if (!flag_org) {
            this.attendees_array.push(ORGANIZER_NAME);
          }
          this.attendees = this.arrayToString(this.attendees_array);
          console.log(this.attendees);
        }
        length++;
      }
   
      var docDefinition = {
        content: [
          { text: 'Minutes of the Meeting', style: 'header', decoration: 'underline' },
          '                                                  ',
          '                                                  ',
          {
            style: 'tableExample',
            table: {
              widths: [125, 350],
              heights: ['auto', 'auto', 'auto', 'auto'],
              body: [
                [{ text: 'Date of Meeting', bold: true }, { text: meeting_date, bold: true }],
                [{ text: 'Purpose', bold: true }, { text: TITLE, bold: true }],
                [{ text: 'Attendees', bold: true }, { text: this.attendees, bold: true }],
                [{ text: 'Next Meeting', bold: true }, { text: next_meeting_date, bold: true }]
              ]
            }
          },
          { text: 'Organizer: ' + ORGANIZER_NAME, bold: true },
          { text: 'Prepared By: ' + USER_SURNAME, bold: true },
          { text: 'Created On: ' + created_on, bold: true },
          '                                                         ',
          '                                                         ',
          this.table(this.momPointsListAll, ['ROW_NUMBER', 'ACTION_POINTS', 'ACTION_BY_NAME', 'COMPLETED_DATE'], ['S.No', 'Action Points', 'Action By', 'When'])

        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center'
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 15, 0, 0]
          },
          story: {
            italic: true,
            alignment: 'center',
            width: '50%',
          },
          itemsTableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          }
        }
      }
      this.pdfObj = pdfMake.createPdf(docDefinition);

      let file_name = 'Mom_' + meeting_date + '.pdf';

      if (this.platform.is('cordova')) {
        this.pdfObj.getBuffer((buffer) => {
          var blob = new Blob([buffer], { type: 'application/pdf' });
          const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
          // Save the PDF to the data Directory of our App
          this.file.writeFile(writeDirectory, file_name, blob, { replace: true }).then(fileEntry => {
            // Open the PDf with the correct OS tools
            this.fileOpener.open(writeDirectory + file_name, 'application/pdf');
          })
        });
      } else {
        // On a browser simply use download!
        this.pdfObj.download();
      }

    }, (err) => {
      console.log(err);
    });
  }

 
  createPdfArchiveAll(ID: any, USER_SURNAME: any) {

    var content = [];
    let next_meeting_date = '';
    let status = 2;

    let params = {} as any;
    params.user_info_id = this.user.UserInfoId;
    params.status = status;
    params.mom_id = ID;

    this.authService.postData(params, 'task/getArchiveMomPdfHeaderLsit').then((result) => {
      this.momPdfHeaderListAll = result;
      console.log('Pdf header list', this.momPdfHeaderListAll);

      this.authService.postData(params, 'task/getArchiveMomPdfActionPointAllSub').then((result) => {
        this.momArchiveActionPointPdfList = result;
        console.log('Action Points list', this.momArchiveActionPointPdfList);
        let heading = { text: 'Minutes of the Meeting', style: 'header', decoration: 'underline' };

        for (let j = 0; j < this.momPdfHeaderListAll.length; j++) {

          this.momArchiveActionPointPdfListfilter = this.momArchiveActionPointPdfList.filter(x => x.MOM_ID == ID && x.ID == this.momPdfHeaderListAll[j].ID );
          
          this.momPointsListAll = this.momArchiveActionPointPdfListfilter.filter(x => x.ACTION_POINTS != null);

          let length = 1;
         
          for (let i = 0; i < this.momArchiveActionPointPdfListfilter.length; i++) {
            console.log(i);
            let completed_date = '';

            if (this.momArchiveActionPointPdfListfilter[i].COMPLETED_DATE != null) {
              completed_date = moment(this.momArchiveActionPointPdfListfilter[i].COMPLETED_DATE).format("DD-MM-YYYY")
            } else {
              completed_date = '';
            }

            this.momArchiveActionPointPdfListfilter[i].COMPLETED_DATE = completed_date;

            if(this.momArchiveActionPointPdfListfilter[i].ACTION_BY_NAME != "" && this.momArchiveActionPointPdfListfilter[i].ACTION_BY_NAME != null){
              var action_by_name_array = this.momArchiveActionPointPdfListfilter[i].ACTION_BY_NAME.split(',');
              for (let j = 0; j < action_by_name_array.length; j++) {
                if (this.attendees_array.indexOf(action_by_name_array[j]) === -1) {
                  this.attendees_array.push(action_by_name_array[j]);
                }
              }
            }                       

            if(this.momArchiveActionPointPdfListfilter[i].TO_EMAIL != "" && this.momArchiveActionPointPdfListfilter[i].TO_EMAIL!= null){
              var email_to_array = this.momArchiveActionPointPdfListfilter[i].TO_EMAIL.split(',');
              for (let k = 0; k < email_to_array.length; k++) {
                if (this.attendees_array.indexOf(email_to_array[k]) === -1) {
                  this.attendees_array.push(email_to_array[k]);
                  this.send_to_email_array.push(email_to_array[k]);
                }
              }
            }

            if (this.momArchiveActionPointPdfListfilter.length == length) {
              let flag = this.attendees_array.includes(this.user.Surname);
              if (!flag) {
                this.attendees_array.push(this.user.Surname);
              }
              let flag_org = this.attendees_array.includes(USER_SURNAME);

              if (!flag_org) {
                this.attendees_array.push(USER_SURNAME);
              }
              this.attendees = this.arrayToString(this.attendees_array);
              console.log(this.attendees);
            }
            length++;
          }

          let meeting_date = moment(this.momPdfHeaderListAll[j].MEETING_DATE).format("DD-MM-YYYY");
          let created_on = moment(this.momPdfHeaderListAll[j].CREATED_ON).format("DD-MM-YYYY hh:mm A")

          if (this.momPdfHeaderListAll[j].NEXT_MEETING_DATE != '' && this.momPdfHeaderListAll[j].NEXT_MEETING_DATE != null) {
            next_meeting_date = moment(this.momPdfHeaderListAll[j].NEXT_MEETING_DATE).format("DD-MM-YYYY")
          } else {
            next_meeting_date = '-';
          }

          let title = this.momPdfHeaderListAll[j].TITLE;
          
          var empty_line = { text: '                                                           ' };
          var Organizer = { text: 'Organizer: ' + this.momPdfHeaderListAll[j].ORGANIZER_NAME, bold: true };
          var PreparedBy = { text: 'Prepared By: ' + this.momPdfHeaderListAll[j].USER_SURNAME, bold: true };
          var Create_on = { text: 'Created On: ' + created_on, bold: true };
          var content_obj = {
            style: 'tableExample',
            table: {
              widths: [125, 350],
              heights: ['auto', 'auto', 'auto', 'auto'],
              body: [
                [{ text: 'Date of Meeting', bold: true }, { text: meeting_date, bold: true }],
                [{ text: 'Purpose', bold: true }, { text: title, bold: true }],
                [{ text: 'Attendees', bold: true }, { text: this.attendees, bold: true }],
                [{ text: 'Next Meeting', bold: true }, { text: next_meeting_date, bold: true }]
              ]
            }
          }

          content.push(heading);
          content.push(empty_line);
          content.push(empty_line);
          content.push(content_obj);
          content.push(empty_line);
          content.push(Organizer);
          content.push(PreparedBy);
          content.push(Create_on);
          content.push(empty_line);
          content.push(empty_line);
          content.push('                                       ');
          content.push(this.table(this.momPointsListAll, ['ROW_NUMBER', 'ACTION_POINTS', 'ACTION_BY_NAME', 'COMPLETED_DATE'], ['S.No', 'Action Points', 'Action By', 'When']));
        
        }

        var docDefinition = {
          content: content,
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              alignment: 'center'
            },
            tableHeader: {
              bold: true,
              fontSize: 13,
              color: 'black'
            },
            subheader: {
              fontSize: 14,
              bold: true,
              margin: [0, 15, 0, 0]
            },
            story: {
              italic: true,
              alignment: 'center',
              width: '50%',
            },
            itemsTableHeader: {
              bold: true,
              fontSize: 13,
              color: 'black'
            },
            tableExample: {
              margin: [0, 5, 0, 15]
            }
          }
        };
      
        this.pdfObj = pdfMake.createPdf(docDefinition);

        let file_name = 'Mom.pdf';

        if (this.platform.is('cordova')) {
          this.pdfObj.getBuffer((buffer) => {
            var blob = new Blob([buffer], { type: 'application/pdf' });
            const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
            // Save the PDF to the data Directory of our App
            this.file.writeFile(writeDirectory, file_name, blob, { replace: true }).then(fileEntry => {
              // Open the PDf with the correct OS tools
              this.fileOpener.open(writeDirectory + file_name, 'application/pdf');
            })
          });
        } else {
          // On a browser simply use download!
          this.pdfObj.download();
        }

      }, (err) => {
        console.log(err);
      })

    }, (err) => {
      console.log(err);
    });;

  }

  
  createPdfMomAll(ID: any, USER_SURNAME: any) {

    var content = [];
    let next_meeting_date = '';
    let status = 2;

    let params = {} as any;
    params.user_info_id = this.user.UserInfoId;
    params.status = status;
    params.mom_id = ID;

    this.authService.postData(params, 'task/getSubMomPdfHeaderLsit').then((result) => {
      this.momPdfHeaderListAll = result;
      console.log('Pdf header list', this.momPdfHeaderListAll);

      this.authService.postData(params, 'task/getMomPdfActionPointAllSub').then((result) => {
        this.momArchiveActionPointPdfList = result;
        console.log('Action Points list', this.momArchiveActionPointPdfList);
        let heading = { text: 'Minutes of the Meeting', style: 'header', decoration: 'underline' };

        for (let j = 0; j < this.momPdfHeaderListAll.length; j++) {

          this.momArchiveActionPointPdfListfilter = this.momArchiveActionPointPdfList.filter(x => x.MOM_ID == ID && x.ID == this.momPdfHeaderListAll[j].ID);

          this.momPointsListAll = this.momArchiveActionPointPdfListfilter.filter(x => x.ACTION_POINTS != null);
          
          let length = 1;
         
          for (let i = 0; i < this.momArchiveActionPointPdfListfilter.length; i++) {
            console.log(i);
            let completed_date = '';

            if (this.momArchiveActionPointPdfListfilter[i].COMPLETED_DATE != null) {
              completed_date = moment(this.momArchiveActionPointPdfListfilter[i].COMPLETED_DATE).format("DD-MM-YYYY")
            } else {
              completed_date = '';
            }

            this.momArchiveActionPointPdfListfilter[i].COMPLETED_DATE = completed_date;

            if(this.momArchiveActionPointPdfListfilter[i].ACTION_BY_NAME !="" && this.momArchiveActionPointPdfListfilter[i].ACTION_BY_NAME != null){
              var action_by_name_array = this.momArchiveActionPointPdfListfilter[i].ACTION_BY_NAME.split(',');
              for (let j = 0; j < action_by_name_array.length; j++) {
                if (this.attendees_array.indexOf(action_by_name_array[j]) === -1) {
                  this.attendees_array.push(action_by_name_array[j]);
                }
              }
            }     

            if(this.momArchiveActionPointPdfListfilter[i].TO_EMAIL != "" && this.momArchiveActionPointPdfListfilter[i].TO_EMAIL!= null){
              var email_to_array = this.momArchiveActionPointPdfListfilter[i].TO_EMAIL.split(',');
              for (let k = 0; k < email_to_array.length; k++) {
                if (this.attendees_array.indexOf(email_to_array[k]) === -1) {
                  this.attendees_array.push(email_to_array[k]);
                  this.send_to_email_array.push(email_to_array[k]);
                }
              }
            }

            if (this.momArchiveActionPointPdfListfilter.length == length) {
              let flag = this.attendees_array.includes(this.user.Surname);
              if (!flag) {
                this.attendees_array.push(this.user.Surname);
              }
              let flag_org = this.attendees_array.includes(USER_SURNAME);

              if (!flag_org) {
                this.attendees_array.push(USER_SURNAME);
              }
              this.attendees = this.arrayToString(this.attendees_array);
              console.log(this.attendees);
            }
            length++;
          }

          let meeting_date = moment(this.momPdfHeaderListAll[j].MEETING_DATE).format("DD-MM-YYYY");
          let created_on = moment(this.momPdfHeaderListAll[j].CREATED_ON).format("DD-MM-YYYY hh:mm A")

          if (this.momPdfHeaderListAll[j].NEXT_MEETING_DATE != '' && this.momPdfHeaderListAll[j].NEXT_MEETING_DATE != null) {
            next_meeting_date = moment(this.momPdfHeaderListAll[j].NEXT_MEETING_DATE).format("DD-MM-YYYY")
          } else {
            next_meeting_date = '-';
          }

          let title = this.momPdfHeaderListAll[j].TITLE;
          
          var empty_line = { text: '                                                           ' };
          var Organizer = { text: 'Organizer: ' + this.momPdfHeaderListAll[j].ORGANIZER_NAME, bold: true };
          var PreparedBy = { text: 'Prepared By: ' + this.momPdfHeaderListAll[j].USER_SURNAME, bold: true };
          var Create_on = { text: 'Created On: ' + created_on, bold: true };
          var content_obj = {
            style: 'tableExample',
            table: {
              widths: [125, 350],
              heights: ['auto', 'auto', 'auto', 'auto'],
              body: [
                [{ text: 'Date of Meeting', bold: true }, { text: meeting_date, bold: true }],
                [{ text: 'Purpose', bold: true }, { text: title, bold: true }],
                [{ text: 'Attendees', bold: true }, { text: this.attendees, bold: true }],
                [{ text: 'Next Meeting', bold: true }, { text: next_meeting_date, bold: true }]
              ]
            }
          }

          content.push(heading);
          content.push(empty_line);
          content.push(empty_line);
          content.push(content_obj);
          content.push(empty_line);
          content.push(Organizer);
          content.push(PreparedBy);
          content.push(Create_on);
          content.push(empty_line);
          content.push(empty_line);
          content.push('                                       ');
          content.push(this.table(this.momPointsListAll, ['ROW_NUMBER', 'ACTION_POINTS', 'ACTION_BY_NAME', 'COMPLETED_DATE'], ['S.No', 'Action Points', 'Action By', 'When']));
          
        }

        var docDefinition = {
          content: content,
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              alignment: 'center'
            },
            tableHeader: {
              bold: true,
              fontSize: 13,
              color: 'black'
            },
            subheader: {
              fontSize: 14,
              bold: true,
              margin: [0, 15, 0, 0]
            },
            story: {
              italic: true,
              alignment: 'center',
              width: '50%',
            },
            itemsTableHeader: {
              bold: true,
              fontSize: 13,
              color: 'black'
            },
            tableExample: {
              margin: [0, 5, 0, 15]
            }
          }
        };
      

        this.pdfObj = pdfMake.createPdf(docDefinition);

        let file_name = 'Mom.pdf';

        if (this.platform.is('cordova')) {
          this.pdfObj.getBuffer((buffer) => {
            var blob = new Blob([buffer], { type: 'application/pdf' });
            const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
            // Save the PDF to the data Directory of our App
            this.file.writeFile(writeDirectory, file_name, blob, { replace: true }).then(fileEntry => {
              // Open the PDf with the correct OS tools
              this.fileOpener.open(writeDirectory + file_name, 'application/pdf');
            })
          });
        } else {
          // On a browser simply use download!
          this.pdfObj.download();
        }

      }, (err) => {
        console.log(err);
      })

    }, (err) => {
      console.log(err);
    });;

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

  getusergroup() {
    
    this.presentLoadingDefault(true);
    let params = {
      user_info_id: this.user.UserInfoId
    }
    this.authService.postData(params, 'task/UserGroupList').then((result: any) => {
      this.groudetails = result;
      console.log(this.groudetails);
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

}
