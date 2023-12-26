import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, ModalOptions, Modal, ModalController, LoadingController, ViewController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { CallNumber } from '@ionic-native/call-number';
import { CalendarModalOptions } from "ion2-calendar";
import { Constant } from '../../providers/constant/constant';

import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-documenttrackingstatusupdate',
  templateUrl: 'documenttrackingstatusupdate.html',
})
export class DocumentTrackingStatusUpdatePage {
 
  paymentattachmentForm: FormGroup;
  paymentcommentsdetails: any;
  pushnotificationValues: any;
  paymentcommentsForm: FormGroup
  insertedValues: any;
  payment_req_data = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  PAYMENT_DETAIL: any;
  COMMENT_TYPE: any;
  userlist: any;
  paymentattachmentlist1: any;

  resourcedetails: any = localStorage.getItem('resourseData');
  btnTxtApprove: any = "Approve";
  btnTxtReject: any = "Reject";
  btnTxtSave: any = "Save";
  btnTxtYes: any = 'Yes';
  btnTxtApproveandForward: any = 'Approve & Forward';
  btnTxtCheck: any = 'Check';

  lnkceoapp = 0;
  lnkmanagement = 0;
  lbkConf = 0;
  lnkreqejari = 0;
  lnkrevertcheck = 1;
  showDetailsBox = 0;
  showSignedDate = 0;
  showModeOfDelivery = 0;
  showIsHardCopyCheckBox = 0;
  isChecked: boolean = false;
  showejariFile = 0;
  ejariattach = 0;
  LEASE_ID: any = this.payment_req_data[0].LEASE_ID;
  DOCUMENT_DETAIL: any;
  COMMENTS: any;

  paymentattachmentlist: any;
  paymentattachmentDelete: any;
  lpoManagerList: any;

  mlist: any;
  nameOfSignedDate = "";
  options: CalendarModalOptions = {
    title: 'BASIC',
    canBackwardsSelected: true
  };
  calendarshow = 0;

  localDate: any;
  DueDate_change: any;

  modeOfDelivery: any;
  downloadUrl: any;
  url: any;
  file_name: any;
  size: any;
  imageURI: any;
  showApprove = 1;

  commonmasterlist: any;
  commonmasterlist1: any;
  IsCDisp = 0;
  IsFiled = 0;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private callNumber: CallNumber,
    public loadingCtrl: LoadingController, public view: ViewController, public alertCtrl: AlertController,
    public constant: Constant, private file: File, private fileOpener: FileOpener, private formBuilder: FormBuilder,
    private modal: ModalController
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourcedetails = this.resourcedetails ? JSON.parse(this.resourcedetails) : {};
    this.paymentattachmentForm = this.formBuilder.group({
      attachmentfile: ['', Validators.compose([Validators.required])],
      ejariNo: ['', Validators.compose([Validators.required])]
    });
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

  ionViewWillLoad() {
    const Data = this.navParams.get('data');
    this.DOCUMENT_DETAIL = Data[0].DOCUMENT_DETAIL;
    this.LEASE_ID = this.DOCUMENT_DETAIL.LEASE_ID;
    console.log(Data);

    if (Data[0].STATUS_TYPE == 'lnkstatus') {

      this.IsCDisp = 1;

      if (this.DOCUMENT_DETAIL.STATUS == 1 || this.DOCUMENT_DETAIL.STATUS == 4 || (this.DOCUMENT_DETAIL.STATUS == 3 && this.DOCUMENT_DETAIL.LEASE_TYPE_CODE != 'GRS' && this.DOCUMENT_DETAIL.ATTRIBUTE2 == 0)) {
        this.showSignedDate = 1;
      } else {
        this.showSignedDate = 0;
      }

      if (this.DOCUMENT_DETAIL.STATUS == 0 || (this.DOCUMENT_DETAIL.STATUS == 5 && this.DOCUMENT_DETAIL.CUST_DISP == 1)) {
        this.showModeOfDelivery = 1;
      } else {
        this.showModeOfDelivery = 0;
      }

      if (this.DOCUMENT_DETAIL.STATUS == 1) {
        this.nameOfSignedDate = "Client Signed Date";
      } else if (this.DOCUMENT_DETAIL.STATUS == 4) {
        this.nameOfSignedDate = "Mgmt Signed Date";
      } else if (this.DOCUMENT_DETAIL.STATUS == 3 && this.DOCUMENT_DETAIL.LEASE_TYPE_CODE != 'GRS' && this.DOCUMENT_DETAIL.ATTRIBUTE2 == 0) {
        this.nameOfSignedDate = "Landlord Signed Date";
      }


      this.lbkConf = 1;
      this.lnkreqejari = 0;
      this.COMMENTS = 'OK';

    } else if (Data[0].STATUS_TYPE == 'lnkstatus1') {

      this.showSignedDate = 0;
      this.showModeOfDelivery = 0;
      this.lbkConf = 1;
      this.lnkreqejari = 0;
      this.COMMENTS = 'OK';
      this.IsFiled = 1;

    } else if (Data[0].STATUS_TYPE == 'lnkstatus2') {
      this.showSignedDate = 0;
      this.showModeOfDelivery = 0;
      this.lbkConf = 0;
      this.lnkreqejari = 1;
      this.COMMENTS = 'OK';

      if (this.DOCUMENT_DETAIL.EJARI == 0) {
        this.btnTxtApproveandForward = "Request Ejari";
      } else if (this.DOCUMENT_DETAIL.EJARI == 1) {
        this.btnTxtApproveandForward = "Check";
      } else if (this.DOCUMENT_DETAIL.EJARI == 2) {
        this.btnTxtApproveandForward = "Approve";
      }

    } else if (Data[0].STATUS_TYPE == 'lnkstatus3') {

      if (this.DOCUMENT_DETAIL.EJARI_COUNT == 1) {
        this.Getpaymentattachment();
        this.showejariFile = 1;
        this.showApprove = 0;
      } else {
        this.ejariattach = 1;
        this.showejariFile = 0;
        this.showApprove = 0;
      }
    }

    this.presentLoadingDefault(true);
    this.authService.postData(Data[0], 'documenttracking/getDocumentTrackingComments').then((result) => {
      this.paymentcommentsdetails = result;
      console.log(this.paymentcommentsdetails);
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });


  }

  opencalendar() {
    if (this.calendarshow == 1) {
      this.calendarshow = 0;
    } else {
      this.calendarshow = 1;
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

  resetForm() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

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

  Getpaymentattachment() {

    const Data = this.navParams.get('data');
    console.log(Data[0]);

    this.authService.postData(Data[0], 'documenttracking/getDocumentTrackingAttachment').then((result) => {
      this.paymentattachmentlist = result;
      console.log(this.paymentattachmentlist);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  showBtn = -1;
  isOpen = false;
  oldBtn = -1;
  showUndoBtn(index) {
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

  callmobileNumber(mobileno: any) {
    console.log('Call Number', mobileno);
    this.callNumber.callNumber(mobileno, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  ApprovePaymentStatusUpdate() {
    if (this.COMMENTS != null && this.COMMENTS != "") {
      this.updatepaymentstatus();
    } else {
      this.presentToast('Please enter description');
      return;
    }
  }

  lnkreqejari_Click() {
    if (this.COMMENTS != null && this.COMMENTS != "") {
      this.updateEjariStatus();
    } else {
      this.presentToast('Please enter description');
      return;
    }
  }

  updateEjariStatus() {

    let params = {
      link_type: 'Document Tracking',
      text_field_3: null,
      link_id: this.payment_req_data[0].LEASE_ID,
      Common_master_Id: null
    }


    console.log('params', params);

    this.authService.postData(params, 'documenttracking/getCommonMasterList').then((result) => {
      this.commonmasterlist1 = result;
      console.log('Common Master', this.commonmasterlist1);
      let msg = '';      

      if (this.commonmasterlist1.length > 0) {

        if (this.COMMENTS == "" || this.COMMENTS == null || this.COMMENTS == undefined) {

          this.presentToast('Enter Description to proceed.');
          return;

        }

        if (this.commonmasterlist1[0].NUMBER_FIELD_4 == 0) {

          msg = "Requested for Ejari";
          this.insertPaymentComments('DocumentTracking STATUS', msg);
          this.commonmasterlist1[0].NUMBER_FIELD_4 = 1;

        } else if (this.commonmasterlist1[0].NUMBER_FIELD_4 == 1) {

          msg = "Contract Checked";
          this.insertPaymentComments('DocumentTracking STATUS', msg);
          this.commonmasterlist1[0].NUMBER_FIELD_4 = 2;

        } else if (this.commonmasterlist1[0].NUMBER_FIELD_4 == 2) {

          msg = "Ejari Request Approved";
          this.insertPaymentComments('DocumentTracking STATUS', msg);
          this.commonmasterlist1[0].NUMBER_FIELD_4 = 3;

        }

        this.commonmasterlist1[0].MODIFIED_BY = this.user.UserInfoId;

        let updatedata = [{
          old_data: JSON.stringify(this.commonmasterlist1[0]),
          modified_by: this.user.UserInfoId,
          record_type: 'Edit'
        }];

        console.log('Update Data', updatedata[0]);
        this.authService.postData(updatedata[0], 'documenttracking/getUpdateInsertCommonMaster').then((result) => {
          this.insertedValues = result;
          this.presentLoadingDefault(false);
          this.closeModal();
        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast(err);
        });


      }

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  updatepaymentstatus() {

     let params = {
      link_type: 'Document Tracking',
      text_field_3: null,
      link_id: this.payment_req_data[0].LEASE_ID,
      Common_master_Id: null
    }

    console.log(this.modeOfDelivery, this.DueDate_change);

    console.log('params', params);

    this.authService.postData(params, 'documenttracking/getCommonMasterList').then((result) => {
      this.commonmasterlist1 = result;
      console.log('Common Master', this.commonmasterlist1);
      let msg = '';
      let text_date: any = '';
      let end_date: any = '';

      end_date = new Date(this.DOCUMENT_DETAIL.LEASE_TERMINATION_DATE);
      //end_date = moment(end_date).format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A');

      if (this.DueDate_change != undefined && this.DueDate_change != '' && this.DueDate_change != null) {
        text_date = new Date(this.DueDate_change);
        //text_date = moment(this.DueDate_change).format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A');
      } else {
        text_date = '';
      }


      if (this.commonmasterlist1.length > 0) {

        if (this.commonmasterlist1[0].NUMBER_FIELD_1 == 1) {


          console.log(end_date, text_date);

          if (text_date == "" || text_date == undefined || text_date == null) {
            this.presentToast('Date cannot be blank');
            return;
          }

          if (!(text_date < end_date)) {
            this.presentToast('Date cannot be grater than End date');
            return;
          }

          msg = "Pending to Receive from client";
          this.insertPaymentComments('DocumentTracking STATUS', msg);
          this.commonmasterlist1[0].DATE_FIELD_1 = moment(text_date).format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A');

        } else if (this.commonmasterlist1[0].NUMBER_FIELD_1 == 2) {

          msg = "Pending to sent for Mgmt Sign";
          this.insertPaymentComments('DocumentTracking STATUS', msg);

        } else if (this.commonmasterlist1[0].NUMBER_FIELD_1 == 3) {

          if (this.DOCUMENT_DETAIL.LEASE_TYPE_CODE != 'GRS' && this.DOCUMENT_DETAIL.ATTRIBUTE2 == 0) {

            if (text_date == "" || text_date == undefined || text_date == null) {
              this.presentToast('Date cannot be blank');
              return;
            }

            if (!(text_date < end_date)) {
              this.presentToast('Date cannot be grater than End date');
              return;
            }

            msg = "Pending to Receive from Landlord sign";
            this.insertPaymentComments('DocumentTracking STATUS', msg);

            this.commonmasterlist1[0].NUMBER_FIELD_2 = 1;
            this.commonmasterlist1[0].NUMBER_FIELD_1 += 1;
            this.commonmasterlist1[0].DATE_FIELD_2 = moment(text_date).format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A');

          } else {
            msg = "sent for Mgmt Sign, To be Received";
            this.insertPaymentComments('DocumentTracking STATUS', msg);
          }

        } else if (this.commonmasterlist1[0].NUMBER_FIELD_1 == 4) {

          if (text_date == "" || text_date == undefined || text_date == null) {
            this.presentToast('Date cannot be blank');
            return;
          }

          if (!(text_date < end_date)) {
            this.presentToast('Date cannot be grater than End date');
            return;
          }

          msg = "Received from Management sign";
          this.insertPaymentComments('DocumentTracking STATUS', msg);
          this.commonmasterlist1[0].DATE_FIELD_2 = moment(text_date).format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A');

        } else if (this.commonmasterlist1[0].NUMBER_FIELD_1 == 5) {

          if (this.IsCDisp == 1) {

            if (this.commonmasterlist1[0].NUMBER_FIELD_2 == 0) {

              msg = "Handover to Leasing For Client Copy Dispatch";
              this.insertPaymentComments('DocumentTracking STATUS', msg);

              this.commonmasterlist1[0].NUMBER_FIELD_2 = 1;
              this.commonmasterlist1[0].NUMBER_FIELD_1 -= 1;

            } else {

              if (this.modeOfDelivery == '0') {
                this.presentToast('Select Mode Of Delivery to proceed.');
                return;
              }
              msg = "Pending for client dispatch";
              this.insertPaymentComments('DocumentTracking STATUS', msg);

              this.commonmasterlist1[0].NUMBER_FIELD_2 = 2;
              this.commonmasterlist1[0].TEXT_FIELD_2 = this.modeOfDelivery;

              if (this.commonmasterlist1[0].NUMBER_FIELD_3 == 0) {
                this.commonmasterlist1[0].NUMBER_FIELD_1 -= 1;
              }

            }

          } else if (this.IsFiled == 1) {

            msg = "Pending for to be filed";
            this.insertPaymentComments('DocumentTracking STATUS', msg);

            this.commonmasterlist1[0].NUMBER_FIELD_3 == 1;
            if (this.commonmasterlist1[0].NUMBER_FIELD_2 == 0 || this.commonmasterlist1[0].NUMBER_FIELD_2 == 1) {
              this.commonmasterlist1[0].NUMBER_FIELD_1 -= 1;
            }

          }

        }

        this.commonmasterlist1[0].NUMBER_FIELD_1 += 1;
        msg = this.COMMENTS;
        this.insertPaymentComments('DocumentTracking COMMENT', msg);
        this.commonmasterlist1[0].MODIFIED_BY = this.user.UserInfoId;

        let updatedata = [{
          old_data: JSON.stringify(this.commonmasterlist1[0]),
          modified_by: this.user.UserInfoId,
          record_type: 'Edit'
        }];

        console.log('Update Data', updatedata[0]);
        this.authService.postData(updatedata[0], 'documenttracking/getUpdateInsertCommonMaster').then((result) => {
          this.insertedValues = result;
          this.presentLoadingDefault(false);
          this.closeModal();
        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast(err);
        });

      } else {

        if (this.COMMENTS == "" || this.COMMENTS == null || this.COMMENTS == undefined) {
          this.presentToast('Enter Description to proceed.');
          return;
        }

        if (this.modeOfDelivery == '0') {
          this.presentToast('Select Mode Of Delivery to proceed.');
          return;
        }
        msg = "Sent to client sign";
        this.insertPaymentComments('DocumentTracking STATUS', msg);

        let insertData = {
          LINK_TYPE: 'Document Tracking',
          LINK_ID: this.payment_req_data[0].LEASE_ID,
          NUMBER_FIELD_1: 1,
          TEXT_FIELD_1: this.modeOfDelivery,
          modified_by: this.user.UserInfoId,
          record_type: 'Add'
        }

        console.log('insertData', insertData);
        this.authService.postData(insertData, 'documenttracking/getUpdateInsertCommonMaster').then((result) => {
          this.insertedValues = result;

          msg = this.COMMENTS;
          this.insertPaymentComments('DocumentTracking COMMENT', msg);

          this.closeModal();
        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast(err);
        });


      }

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }


  insertPaymentComments(type: any, COMMENTS: any) {

    let paymentcommentsData = [{
      PAYMENT_REQUEST_ID: this.payment_req_data[0].LEASE_ID,
      modified_by: this.user.UserInfoId,
      ReferenceType: type,
      COMMENTS: COMMENTS
    }];

    let _valid = true;

    if (_valid) {
      this.authService.postData(paymentcommentsData[0], 'payment/getInsertFinancepaymentcommentsinsert').then((result) => {
        this.insertedValues = result;
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      console.log('Comment not inserted.');
    }
  }

  getfile(row_no, ATTACHMENT_ID: any, item: any) {

    const Data = this.navParams.get('data');
    Data[0].attachment_id = ATTACHMENT_ID;
    console.log(Data[0]);

    this.authService.postData(Data[0], 'payment/getFinancePaymentAttachmentById').then((result) => {
      this.paymentattachmentlist1 = result;
      console.log(this.paymentattachmentlist1);

      let objFile = this.paymentattachmentlist1[0];
      console.log(objFile);
      let file_name = objFile.FILE_NAME;
      let nameSplit = file_name.split('.');
      let extn = nameSplit[nameSplit.length - 1];
      this.downloadUrl = new Blob([new Uint8Array(objFile.FILE_CONTENT.data)]);
      let content_type = this.constant.fileTypes.filter(ext => ext.name == extn.toUpperCase())
      this.saveAndOpenPdf(this.downloadUrl, file_name, content_type[0]);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  saveAndOpenPdf(pdf: any, filename: any, content_type: any) {
    const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
    this.file.writeFile(writeDirectory, filename, pdf, { replace: true })
      .then(() => {
        this.fileOpener.open(writeDirectory + filename, content_type.type)
          .catch(() => {
            console.log('Error opening pdf file');
          });
      })
      .catch((err) => {
        console.log(err);
        console.error('Error writing pdf file');
      });
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


  insertAttachments() {

    let uploadData = this.paymentattachmentForm.value;
    uploadData.PAYMENT_REQUEST_ID = this.payment_req_data[0].LEASE_ID
    uploadData.created_by = this.user.UserInfoId;
    uploadData.modified_by = this.user.UserInfoId;
    uploadData.imageURI_data = this.imageURI;
    uploadData.name = this.file_name;
    uploadData.size_data = this.size;
    uploadData.type_code = 'EJARI'

    console.log(uploadData);

    if (uploadData.ejariNo == "" || uploadData.ejariNo == null || uploadData.ejariNo == undefined) {
      this.presentToast('Ejari no cannot be empty.');
      return;
    }

    if (!(this.stringValidate(uploadData.ejariNo))) {
      this.presentToast('Enter a valid ejari no to proceed.');
      return;
    }

    let params = {
      link_type: 'Document Tracking',
      text_field_3: uploadData.ejariNo,
      link_id: null,
      Common_master_Id: null
    }

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'documenttracking/getCommonMasterList').then((result) => {
      this.commonmasterlist = result;
      console.log(this.commonmasterlist);
      if (this.commonmasterlist.length > 0) {
        this.presentToast('Ejari no is already available.');
        return;
      } else {
        this.getInsertCommonAttach();
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  getInsertCommonAttach() {

    let uploadData = this.paymentattachmentForm.value;
    uploadData.PAYMENT_REQUEST_ID = this.payment_req_data[0].LEASE_ID
    uploadData.created_by = this.user.UserInfoId;
    uploadData.modified_by = this.user.UserInfoId;
    uploadData.imageURI_data = this.imageURI;
    uploadData.name = this.file_name;
    uploadData.size_data = this.size;
    uploadData.type_code = 'EJARI'

    if (uploadData.imageURI_data != undefined) {

      this.authService.postData(uploadData, 'payment/getInsertFinancePaymentattachment').then((result) => {

        let params = {
          link_type: 'Document Tracking',
          text_field_3: null,
          link_id: this.payment_req_data[0].LEASE_ID,
          Common_master_Id: null
        }

        this.authService.postData(params, 'documenttracking/getCommonMasterList').then((result) => {
          this.commonmasterlist1 = result;
          console.log(this.commonmasterlist1);

          if (this.commonmasterlist1.length > 0) {

            this.commonmasterlist1[0].TEXT_FIELD_3 = uploadData.ejariNo;
            this.commonmasterlist1[0].MODIFIED_BY = this.user.UserInfoId;

            let updatedata = [{
              old_data: JSON.stringify(this.commonmasterlist1[0]),
              modified_by: this.user.UserInfoId,
              record_type: 'Edit'
            }];

            console.log(updatedata[0]);
            this.authService.postData(updatedata[0], 'documenttracking/getUpdateInsertCommonMaster').then((result) => {
              this.insertedValues = result;
              this.presentLoadingDefault(false);
              this.closeModal();
            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast(err);
            });

          }

        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast(err);
        });

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });

    } else {
      this.presentToast('Pleaase select file to upload.');
      return;
    }

  }


  stringValidate(str: any) {
    var regex = /^[A-Za-z0-9._]+$/

    var isValid = regex.test(str);

    if (!isValid) {
      console.log("Contains Special Characters.");
    } else {
      console.log("Does not contain Special Characters.");
    }

    return isValid;
  }

  uploadAudio(i: number, data: any) {

    console.log(i, data);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: this.user.UserInfoId,
      comments_id: data.REFERENCE_ID,
      comments_child_id: data.COMMENT_ID,
      module_type: 'DOCUMENT TRACKING'
    }]


    let modelpage = '';
    modelpage = 'AudioCommentsPage';

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });

  } 

  uploadAudioNewComment() {
    
    let PAYMENT_REQUEST_ID = this.payment_req_data[0].LEASE_ID;
    
    let paymentcommentsData = [{
      PAYMENT_REQUEST_ID: this.payment_req_data[0].LEASE_ID,
      modified_by: this.user.UserInfoId,
      ReferenceType: 'DocumentTracking COMMENT',
      COMMENTS: 'Recording'
    }];
    
    console.log(paymentcommentsData);

    this.presentLoadingDefault(true);
    this.authService.postData(paymentcommentsData, 'payment/getInsertFinancePaymentCommentsWhileAudioRecording').then((result) => {      
      this.insertedValues = result;
      console.log(result);
      this.presentLoadingDefault(false);

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };
  
      let myModalData = [{
        user_info_id: this.user.UserInfoId,
        comments_id: PAYMENT_REQUEST_ID,
        comments_child_id: result,
        module_type: 'DOCUMENT TRACKING'
      }]
    
      let modelpage = '';
      modelpage = 'AudioCommentsPage';
  
      let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);
  
      myModal.present();
      myModal.onDidDismiss((data) => {
          this.ionViewWillLoad();
      });
      myModal.onWillDismiss((data) => {
      });

    }, (err) => {
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