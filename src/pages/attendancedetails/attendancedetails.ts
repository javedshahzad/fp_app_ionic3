import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, ModalController, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import * as moment from 'moment';

import { SelectSearchableComponent } from 'ionic-select-searchable';
import { CalendarModalOptions } from "ion2-calendar";

@IonicPage()
@Component({
  selector: 'page-attendancedetails',
  templateUrl: 'attendancedetails.html',
})


export class attendanceDetailPage {
  @ViewChild('myselect') selectComponent: SelectSearchableComponent;

  Lpomanament = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));

  searchData = { "search_value": "" };
  user_type: any;
  user_type_id: any;
  user_resource_id: any;
  showescalateddays = 0;
  type: any;
  title_page: any;
  title_btn = 'Close';
  attendanceDetailsAll: any;
  attendanceDetails: any;

  calendarshow = 0;
  calendarshowheldon = 0;
  calendarshownextmeeting = 0;
  calendarshowuptodate = 0;
  nextmeeting: any;
  localDate: any;
  DueDate_change: any;
  heldOn: any;
  heldOnDate: any;
  nextmeetingDate: any;
  From_Date = '';
  attendanceHeader: any;
  attendanceReport: any;
  pdfObj = null;

  options: CalendarModalOptions = {
    title: 'BASIC',
    canBackwardsSelected: true
  };

  show_to_date = 0;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController,
    private file: File, private fileOpener: FileOpener
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};

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

  ngOnInit() {
    this.type = this.Lpomanament[0].type;

    var today = new Date();
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.localDate = date;
    this.heldOn = date;
    this.heldOnDate = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    this.nextmeeting = date;
    this.nextmeetingDate = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();

    if (this.type == 'Daily') {
      this.title_page = 'Daily Attendance Report';
      this.From_Date = 'Date';
      this.show_to_date = 0;

    }else if(this.type == 'Daily all'){
      this.title_page = 'Daily Attendance Report';
      this.From_Date = 'Date';
      this.show_to_date = 0;

    }else if(this.type == 'Monthly all'){
      this.title_page = 'Monthly Attendance Report';
      this.From_Date = 'From Date';
      this.show_to_date = 1;
    }else {
      this.title_page = 'Monthly Attendance Report';
      this.From_Date = 'From Date';
      this.show_to_date = 1;
    }


  }

  onChange(event) {
    var today = new Date(event._d);
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.localDate = date;
    this.DueDate_change = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    if (this.calendarshow == 1) {
      this.calendarshow = 0;
    } else {
      this.calendarshow = 1;
    }
  }

  heldOnChange(event) {
    var today = new Date(event._d);
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.heldOn = date;
    this.heldOnDate = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    if (this.calendarshowheldon == 1) {
      this.calendarshowheldon = 0;
    } else {
      this.calendarshowheldon = 1;
    }
  }

  nextmeetingonChange(event) {
    var today = new Date(event._d);
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.nextmeeting = date;
    this.nextmeetingDate = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    if (this.calendarshownextmeeting == 1) {
      this.calendarshownextmeeting = 0;
    } else {
      this.calendarshownextmeeting = 1;
    }
  }

  opencalendarheldon() {
    if (this.calendarshowheldon == 1) {
      this.calendarshowheldon = 0;
    } else {
      this.calendarshowheldon = 1;
    }
  }

  opencalendarnextmeetingshow() {
    if (this.calendarshownextmeeting == 1) {
      this.calendarshownextmeeting = 0;
    } else {
      this.calendarshownextmeeting = 1;
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

  goBack() {
    this.view.dismiss();
  }


  closeModal() {
    this.view.dismiss();
  }

  getAttendanceDetails() {

    let attend_date = null;
    let from_date = null;
    let to_date = null;
    let user_id = this.user.UserInfoId;

    if (this.Lpomanament[0].type == 'Daily') {
      attend_date = this.heldOnDate;
    }else if(this.Lpomanament[0].type == 'Daily all'){
      attend_date = this.heldOnDate;
    } else {
      from_date = this.heldOnDate;
      to_date = this.nextmeetingDate;
    }

    if(this.Lpomanament[0].reporting_user_id != null){
      user_id = this.Lpomanament[0].reporting_user_id;
    }else{
      user_id = this.user.UserInfoId;
    }

    let params = {
      user_info_id: user_id,
      attend_date: attend_date,
      from_date: from_date,
      to_date: to_date,
      type: this.Lpomanament[0].type
    }

    this.authService.postData(params, 'attendance/getUserAttendanceReport').then((result) => {
      this.attendanceDetailsAll = result;
      this.attendanceDetails = result;
      console.log(this.attendanceDetailsAll);
      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  showBtn = -1;
  isOpen = false;
  oldBtn = -1;

  showUndoBtn(index, LPO_ID: any) {
    if (this.isOpen = false) {
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

  generateReport() {
    console.log(this.heldOnDate);
    this.getAttendanceDetails();
  }

  openAttendanceReport() {

    let current_date = moment().format("DD-MM-YYYY hh:mm:ss a");

    if (this.attendanceDetails != undefined) {

      if (this.attendanceDetails.length > 0) {

        for (let i = 0; i < this.attendanceDetails.length; i++) {
          this.attendanceDetails[i].ATTEND_DATE = moment(this.attendanceDetails[i].ATTEND_DATE).format("DD-MM-YYYY");
        }

        var docDefinition = {
          content: [
            { text: 'ATTENDANCE', style: 'header', decoration: 'underline' },
            '                                                  ',
            '                                                  ',
            { text: 'Date: ' + current_date },
            '                          ',
            this.table(this.attendanceDetails, ['USER_NAME', 'ATTEND_DATE', 'CHECKIN', 'CHECKOUT', 'CHECKIN_LOCATION', 'CHECKOUT_LOCATION','CHECKIN_LATITUDE','CHECKIN_LONGITUDE','CHECKOUT_LATITUDE','CHECKOUT_LONGITUDE'], ['User Name', 'Date', 'Check In', 'Check Out', 'Check In Location', 'Check Out Location','Check In Latitude','Check In Longitude','Check Out Latitude','Check Out Longitude'])

          ],
          styles: {
            header: {
              fontSize: 16,
              bold: true,
              alignment: 'center'
            },
            tableHeader: {
              bold: true,
              fontSize: 12,
              background: 'black',
              color: 'white'
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
            },
            tablebody: {
              fontSize: 12,
              bold: true,
              fillColor: 'grey',
              color: 'white'
            }
          }
        }

        this.pdfObj = pdfMake.createPdf(docDefinition);

        let file_name = 'attendance.pdf';

        if (this.platform.is('cordova')) {
          this.pdfObj.getBuffer((buffer) => {
            var blob = new Blob([buffer], { type: 'application/pdf' });
            const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
            this.file.writeFile(writeDirectory, file_name, blob, { replace: true }).then(fileEntry => {
              this.fileOpener.open(writeDirectory + file_name, 'application/pdf');
            });
          });
        } else {
          this.pdfObj.download();
        }

      } else {
        this.presentToast('No data found.');
        return;
      }

    } else {
      this.presentToast('Please generate report.');
      return;
    }




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
