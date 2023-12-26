import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-lpomultipleapproval',
  templateUrl: 'lpomultipleapproval.html',
})
 
export class lpoMultipleApprovaloption {
  callManagementDetails: any;
  RejectForm: FormGroup;
  ApproveForm: FormGroup;
  CallinspectionList: any;
  WORK_NOT_STARTED: any;
  WORK_IN_PROGRESS: any;
  PARTIALLY_ASSIGNED: any;
  Lpomanament_data: any;
  ResourseList: any;
  type: any;
  ImageList: any;
  reject_cmt = 'none';
  approve_cmt = 'none';
  multiple_approve_cmt = 'none';
  multiple_reject_cmt = 'none';
  iSmaterial = 'none';
  imagelistdata: any;
  downloadUrl: any;
  LPOno: any;
  callcomplientsdetails: any;
  rejectbtn_approvebtn_show = 'none';
  WORK_WAITING_FOR_CLIENT_APPROVAL: any;
  searchData = { "search_value": "" };
  searchLpoList: any;
  LpoItemsList: any;
  searchLpoItemsList: any;
  title_btn: any = 'Close';
  title_page: any = 'LPO'
  btnTxt: any = 'Save';
  lpoLedgerReport: any;
  lpoLedgerReportHeader: any;
  Lpomanament = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  pdfObj = null;
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));

  cucumber: boolean;
  approve_lpo_id = [];
  multiple_LPO_no = [];

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController,
    private file: File, private fileOpener: FileOpener
  ) {

    this.user = this.user ? JSON.parse(this.user) : {};

    this.RejectForm = this.formBuilder.group({
      LPOno: ['', Validators.compose([Validators.required])],
      comments: ['', Validators.compose([Validators.required])]
    });

    this.ApproveForm = this.formBuilder.group({
      LPOno: ['', Validators.compose([Validators.required])],
      comments: ['', Validators.compose([Validators.required])]
    });

  }

  updateCucumber() {
    console.log('Cucumbers new state:' + this.cucumber);
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

  onCloseHand(mode) {
    if (mode == 'reject') {
      this.reject_cmt = 'none';
      this.multiple_reject_cmt = 'none';
    } else if (mode == 'approve') {
      this.approve_cmt = 'none';
      this.multiple_approve_cmt = 'none';
    } else if (mode == 'material') {
      this.iSmaterial = 'none';
    }

  }

  ngOnInit() {
    this.approve_lpo_id = [];
    this.ResourseList = this.resourse;
    this.Lpomanament_data = this.Lpomanament[0].Lpomanament;
    this.type = this.Lpomanament[0].type;
    this.getLpoData(this.type);
    this.setPageTitle(this.type);
    this.GetAllresourse_list();
  }

  setPageTitle(uType) {
    if (uType == 'Manager') {
      this.title_page = 'LPO (Waiting Manager Verification)';
    }
    else if (uType == 'Finance-MGR') {
      this.title_page = 'LPO (Waiting Finance Conform)';
    }
    else if (uType == 'General Manager') {
      this.title_page = 'LPO (Waiting General Manager Approval)';
    }
    else if (uType == 'COO') {
      this.title_page = 'LPO (Waiting COO Approval)';
    }
    else if (uType == 'CEO') {
      this.title_page = 'LPO (Waiting CEO Approval)';
    }
    else if (uType == 'Rejected') {
      this.title_page = 'LPO Reject List';
    }
    else if (uType == 'CEO_App') {
      this.title_page = 'LPO (CEO Approved)';
    }
    else if (uType == 'Multiple Approval'){
      this.title_page = 'LPO (Multiple Approval)';
    }
  }

  getLpoData(uType) {
    var _utype = '';
    if (uType == 'Manager')
      _utype = 'WMV';
    else if (uType == 'Finance-MGR')
      _utype = 'WFC';
    else if (uType == 'General Manager')
      _utype = 'WGMA';
    else if (uType == 'COO')
      _utype = 'WCOOA';
    else if (uType == 'CEO')
      _utype = 'WCEOA';
    else if (uType == 'Rejected')
      _utype = 'REJ';
    else if (uType == 'CEO_App')
      _utype = 'CEOA';
    else if (uType == 'Multiple Approval'){

      if (this.ResourseList.TYPE_USER === "COO") {
        _utype = 'WCOOA';
      } else if (this.ResourseList.TYPE_USER === "CEO") {
        _utype = 'WCEOA';
      } else {
        _utype = 'MA1';
      }

    }
      

    this.presentLoadingDefault(true);
    let context = { LBL_TYPE: _utype };
    this.authService.postData(context, 'Lpo/GetNewLpoList').then((result) => {
      this.Lpomanament_data = result;
      this.searchLpoList = result;
      this.presentLoadingDefault(false);
      if (this.Lpomanament[0].search_value) {
        this.searchData.search_value = this.Lpomanament[0].search_value;
        this.SearchManagement();
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  GetAllresourse_list() {
    this.ResourseList = this.resourse;
    console.log('ResourseList ', this.resourse);
    if (this.ResourseList.TYPE_USER === "COO") {
      this.rejectbtn_approvebtn_show = 'block';
    } else if (this.ResourseList.TYPE_USER === "CEO") {
      this.rejectbtn_approvebtn_show = 'block';
    } else {
      this.rejectbtn_approvebtn_show = 'none';
    }
  }

  getcallCompliantdetails(LPO_ID) {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'Lpo/CallCompliantdetails/' + LPO_ID + '').then((result) => {
      this.presentLoadingDefault(false);
      this.callcomplientsdetails = result;
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      const myModalData = [{
        callcomplientsdetails: this.callcomplientsdetails
      }];

      const myModal: Modal = this.modal.create('LpocalldetailsPage', { data: myModalData }, myModalOptions);

      myModal.present();

      myModal.onDidDismiss((data) => {
        console.log("I have dismissed.");
        console.log(data);
      });

      myModal.onWillDismiss((data) => {
        console.log("I'm about to dismiss");
        console.log(data);
      });
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

  goBack() {
    this.view.dismiss();
  }

  resetForm() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  closeModal() {
    if (this.title_btn == 'Close') {
      this.view.dismiss();
    } else {
      this.setPageTitle(this.type);
      this.title_btn = 'Close';
    }
  }

  openModal(LPO_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = [{
      LPO_ID: LPO_ID
    }];

    const myModal: Modal = this.modal.create('Lpomodelcomments', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      console.log("I have dismissed.");
      console.log(data);
    });

    myModal.onWillDismiss((data) => {
      console.log("I'm about to dismiss");
      console.log(data);
    });

  }


  itemListbtn(LPO_ID: any) {
    this.LPOno = LPO_ID;
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'Lpo/GetLpoItemsList/' + LPO_ID).then((result) => {
      this.presentLoadingDefault(false);
      this.LpoItemsList = result;
      console.log('this.LpoItemsList', this.LpoItemsList);
      if (this.LpoItemsList.length > 0) {
        this.title_btn = 'Back';
        this.title_page = 'LPO ' + LPO_ID + ' Material Item List';
        this.searchLpoItemsList = result;
      } else {
        this.presentToast('Material item not found this LPO ' + LPO_ID);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  Rejectbtn(LPO_ID: any) {
    this.LPOno = LPO_ID;
    this.reject_cmt = 'block';
  }

  Approvebtn(LPO_ID: any) {
    this.LPOno = LPO_ID;
    this.approve_cmt = 'block';
  }

  Reject_con() {
    let rejectdata = this.RejectForm.value;
    rejectdata.created_by = this.user.UserInfoId;
    rejectdata.modified_by = this.user.UserInfoId;
    rejectdata.usertype = this.ResourseList.TYPE_USER ? this.ResourseList.TYPE_USER : '';
    this.presentLoadingDefault(true);
    this.btnTxt = 'In Progress...'
    this.authService.postData(rejectdata, 'Lpo/Rejectdatainsert').then((result) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save';
      this.reject_cmt = 'none';
      this.getLpoData(this.type);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save';
      this.reject_cmt = 'none';
      this.presentToast(err);
    });
  }

  Approve_con() {
    let approvedata = this.ApproveForm.value;
    approvedata.usertype = this.ResourseList.TYPE_USER;
    approvedata.created_by = this.user.UserInfoId;
    approvedata.modified_by = this.user.UserInfoId;
    approvedata.usertype = this.ResourseList.TYPE_USER ? this.ResourseList.TYPE_USER : '';

    this.presentLoadingDefault(true);
    this.btnTxt = 'In Progress...'
    this.authService.postData(approvedata, 'Lpo/Approvedatainsert').then((result) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save';
      this.approve_cmt = 'none';
      this.multiple_approve_cmt = 'none';
      this.getLpoData(this.type);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save';
      this.approve_cmt = 'none';
      this.multiple_approve_cmt = 'none';
      this.presentToast(err);
    });
  }

  multiple_approve_con() {
    let approvedata = this.ApproveForm.value;
    approvedata.usertype = this.ResourseList.TYPE_USER;
    approvedata.created_by = this.user.UserInfoId;
    approvedata.modified_by = this.user.UserInfoId;
    approvedata.usertype = this.ResourseList.TYPE_USER ? this.ResourseList.TYPE_USER : '';
    approvedata.multiple_LPO_no = this.approve_lpo_id;

    this.presentLoadingDefault(true);
    this.btnTxt = 'In Progress...';
    this.authService.postData(approvedata, 'Lpo/multipleApproveLpoinsert').then((result) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save';
      this.approve_cmt = 'none';
      this.multiple_approve_cmt = 'none';
      this.approve_lpo_id = [];
      this.getLpoData(this.type);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save';
      this.approve_cmt = 'none';
      this.multiple_approve_cmt = 'none';      
      this.approve_lpo_id = [];
      this.presentToast(err);
    });
  }


  multiple_reject_con() {
    let rejectdata = this.RejectForm.value;
    rejectdata.created_by = this.user.UserInfoId;
    rejectdata.modified_by = this.user.UserInfoId;
    rejectdata.usertype = this.ResourseList.TYPE_USER ? this.ResourseList.TYPE_USER : '';
    rejectdata.multiple_LPO_no = this.approve_lpo_id;

    this.presentLoadingDefault(true);
    this.btnTxt = 'In Progress...'
    this.authService.postData(rejectdata, 'Lpo/multiplerejectLpoinsert').then((result) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save';
      this.reject_cmt = 'none';
      this.multiple_reject_cmt = 'none';      
      this.approve_lpo_id = [];
      this.getLpoData(this.type);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save';
      this.reject_cmt = 'none';
      this.multiple_reject_cmt = 'none';      
      this.approve_lpo_id = [];
      this.presentToast(err);
    });
  }

  SearchManagement() {
    let _id = parseInt(this.searchData.search_value);
    let item = this.searchData.search_value;
    if (this.title_btn == 'Close') {
      if (item != '') {
        if (isNaN(_id)) {
          this.Lpomanament_data = this.searchLpoList.filter(x => x.SUPPLIER_NAME.includes(item));
        } else if (!isNaN(_id)) {
          this.Lpomanament_data = this.searchLpoList.filter(x => x.LPO_ID === _id);
        }
      } else {
        this.Lpomanament_data = this.searchLpoList;
      }
    } else {
      if (item != '') {
        if (isNaN(_id)) {
          this.LpoItemsList = this.searchLpoItemsList.filter(x => x.MATERIAL_NAME.includes(item));
        } else if (!isNaN(_id)) {
          this.LpoItemsList = this.searchLpoItemsList.filter(x => x.ASSET_ID == _id);
        }
      } else {
        this.LpoItemsList = this.searchLpoItemsList;
      }
    }
  }

  Getallimagelist(LPO_ID: any, count: any) {
    if (count > 0) {
      this.presentLoadingDefault(true);
      this.authService.getData({}, 'Lpo/Getallimagelist/' + LPO_ID + '').then((result) => {
        this.presentLoadingDefault(false);
        this.ImageList = result;
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
        const myModalData = [{
          ImageList: this.ImageList
        }];
        const myModal: Modal = this.modal.create('lpoimagelist', { data: myModalData }, myModalOptions);
        myModal.present();
        myModal.onDidDismiss((data) => {

        });
        myModal.onWillDismiss((data) => {

        });
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      this.presentToast('No Image Found');
    }
  }

  upload(LPO_ID: any, count: any) {
    if (count > 0) {
      this.presentLoadingDefault(true);
      this.authService.getData({}, 'Lpo/Getallcommantattach/' + LPO_ID + '').then((result) => {
        this.presentLoadingDefault(false);
        this.ImageList = result;
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
        const myModalData = [{
          LPO_ID: LPO_ID,
          ImageList: this.ImageList
        }];
        const myModal: Modal = this.modal.create('lpoattachement', { data: myModalData }, myModalOptions);
        myModal.present();
        myModal.onDidDismiss((data) => {
        });

        myModal.onWillDismiss((data) => {
        });
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      this.presentToast('No Attachment Found');
    }
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

  getImagelist(row_no, item: any) {

    let objFile = this.imagelistdata.find(o => o.ROW_NO === row_no);
    let bytes = objFile.FILE_CONTENT.data;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];

    if (extn == "gif" || extn == "jpeg" || extn == "png") {
      if (this.imagelistdata.length > 0) {
        return `data:image/${extn};base64,${this.encode(bytes)}`;
      } else {
        return `./assets/imgs/no-found-photo.png`
      }
    }
  }

  getfile(row_no, item: any) {

    let objFile = this.imagelistdata.find(o => o.ROW_NO === row_no);
    let bytes = objFile.FILE_CONTENT.data;
    let file_type = objFile.FILE_TYPE;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];
    this.downloadUrl = window.URL.createObjectURL(new Blob([new Uint8Array(item.FILE_CONTENT.data)]));

    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);

    a.href = this.downloadUrl;
    a.download = file_name;
    a.click();
    if (file_type == 'IMAGE') {
      return `data:image/${extn};base64,${this.encode(bytes)}`;
    } else {
      return `./assets/imgs/no-found-photo.png`
    }
  }

  encode(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
      chr1 = input[i++];
      chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
      chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
        keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
  }

  Pending_for_lpo_cancellation(LPO_ID: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to Confirmated Data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Updated',
          'Your data is Confirmated.',
          'success'
        )
        /* console.log(this.CallInspectionData);*/
        let data = {
          LPO_ID: LPO_ID,
          UserInfoId: this.user.UserInfoId,
          usertype: this.ResourseList.TYPE_USER
        }
        this.presentLoadingDefault(true);
        this.authService.postData(data, 'Lpo/Update_pending_cancellation_Status_Change').then((result) => {
          this.presentLoadingDefault(false);
          /* console.log(result);*/
          this.presentToast("Updated successfully");
          // console.log('List ',this.insertedValues);
        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast(err);
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your data is not Confirmated)',
          'error'
        )
      }
    });

  }


  openLpoItemInModal(product_id: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      product_id: product_id
    }]

    let modelpage = '';
    modelpage = 'lpoItemInList';


    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {

    });
    myModal.onWillDismiss((data) => {
    });

  }

  openLpoLedgerReport(product_id: any) {

    let params = {} as any;
    params.user_info_id = this.user.UserInfoId;
    params.product_id = product_id;
    let current_date = moment().format("DD-MM-YYYY hh:mm:ss a");

    this.authService.postData(params, 'Lpo/getLpoLedgerReportHeader').then((result) => {
      this.lpoLedgerReportHeader = result;
      console.log('Ledger Report Header', this.lpoLedgerReportHeader);

      if (this.lpoLedgerReportHeader.length > 0) {

        this.authService.postData(params, 'Lpo/getLpoLedgerReport').then((result) => {
          this.lpoLedgerReport = result;
          console.log('Ledger Report', this.lpoLedgerReport);

          for (let i = 0; i < this.lpoLedgerReport.length; i++) {
            this.lpoLedgerReport[i].CREATED_ON = moment(this.lpoLedgerReport[i].CREATED_ON).format("DD-MM-YYYY");
          }

          let from_date = moment(this.lpoLedgerReportHeader[0].FROM_DATE).format("DD-MM-YYYY");
          let to_date = moment(this.lpoLedgerReportHeader[0].TO_DATE).format("DD-MM-YYYY");

          var docDefinition = {
            content: [
              { text: 'ITEM LEDGER', style: 'header', decoration: 'underline' },
              '                                                  ',
              '                                                  ',
              { text: 'Date: ' + current_date },
              '                          ',
              {
                style: 'tableExample',
                table: {
                  widths: [125, '*'],
                  heights: ['auto', 'auto', 'auto', 'auto'],
                  body: [
                    [{ text: 'Item Name', style: 'tablebody' }, { text: this.lpoLedgerReportHeader[0].ITEM_NAME, style: 'tablebody' }],
                    [{ text: 'Major Category', style: 'tablebody' }, { text: this.lpoLedgerReportHeader[0].MAJOR, style: 'tablebody' }],
                    [{ text: 'Sub Category', style: 'tablebody' }, { text: this.lpoLedgerReportHeader[0].SUB, style: 'tablebody' }],
                    [{ text: 'From', style: 'tablebody' }, { text: from_date, style: 'tablebody' }],
                    [{ text: 'To', style: 'tablebody' }, { text: to_date, style: 'tablebody' }],
                    [{ text: 'Opening Stock', style: 'tablebody' }, { text: this.lpoLedgerReportHeader[0].OPENING_BALANCE, style: 'tablebody' }],
                    [{ text: 'Closing Stock', style: 'tablebody' }, { text: this.lpoLedgerReportHeader[0].CLOSING_BALANCE, style: 'tablebody' }]
                  ]
                }
              },
              '                                                         ',
              '                                                         ',
              { text: 'MATERIAL IN/OUT LIST', style: 'tableHeader' },
              '                   ',
              this.table(this.lpoLedgerReport, ['ROW_NUMBER', 'CREATED_ON', 'TYPE', 'SOURCE', 'IN_QTY', 'OUT_QTY', 'BALANCE_QTY', 'STORE_NAME'], ['S.No', 'Date', 'Type', 'Source', 'In', 'Out', 'Bal', 'Store'])

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

          let file_name = 'Ledger.pdf';

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

      } else {
        this.presentToast('No data found.');
        return;
      }

    }, (err) => {
      console.log(err);
    });

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

  CheckboxClicked(lpo_id: any, event: any) {

    console.log(lpo_id);
    console.log(event);
    console.log(event.checked);

    if (event.checked) {
      this.approve_lpo_id.push(lpo_id);
    } else {
      var index = this.approve_lpo_id.findIndex(item => item == lpo_id);
      if (index > -1) {
        this.approve_lpo_id.splice(index, 1);
      }
    }
    console.log(this.approve_lpo_id);
    
  }


  multipleLpoRejectbtn() {

    this.LPOno = null;

    if (this.approve_lpo_id.length > 0) {
      this.multiple_reject_cmt = 'block';
    } else {
      this.presentToast('Please select LPO.');
      return;
    }

  }

  multipleLpoApprovebtn() {

    this.LPOno = null;

    if (this.approve_lpo_id.length > 0) {
      this.multiple_approve_cmt = 'block';
    } else {
      this.presentToast('Please select LPO.');
      return;
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
