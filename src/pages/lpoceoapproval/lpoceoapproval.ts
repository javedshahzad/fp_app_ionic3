import { Component } from '@angular/core';
import { NavController, Platform, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';

import { RestProvider } from '../../providers/rest/rest';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'page-lpoceoapproval',
  templateUrl: 'lpoceoapproval.html',
})
export class LpoCeoApprovalPage {

  selectedSegment = "fp";
  petSev = "urgent";
  branchListdetails: any =  [{
    "ID": 1,
    "NAME": "FP",
    "KEY": "fp"
},
{
    "ID": 2,
    "NAME": "TREPPAN",
    "KEY": "treppan"
},
{
    "ID": 3,
    "NAME": "UK",
    "KEY": "uk"
},
{
    "ID": 4,
    "NAME": "UGANDA",
    "KEY": "uganda"
},
{
    "ID": 5,
    "NAME": "OA",
    "KEY": "oa"
}
];
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
  iSmaterial = 'none';
  imagelistdata: any;
  downloadUrl: any;
  LPOno: any;
  specialAttention:Number = 0;
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

  user_type: any;
  user_type_id: any;
  user_resource_id: any;
  showescalateddays = 0;
  insertedValues: any;
  Lpomanament_dataAll: any;
  tab_name: any = "fp";

  searchlpodetails_ug: any;
  searchlpodetails_uk: any;
  searchlpodetails_fp: any;
  searchlpodetails_treppan: any;
  searchlpodetails_oa: any;

  // itemsToDisplay_ug = [];
  // itemsToDisplay_uk = [];
  // itemsToDisplay_treppan = [];
  // itemsToDisplay_oa = [];
  // itemsToDisplay_fp = [];
  itemsToDisplay = [];

  paymentBudgetHistory: any;
  

  constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController, private formBuilder: FormBuilder,
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
    // this.selectedSegment= "fp";
  }

  ionViewDidLoad() {
    this.tab_name = "fp";
    this.Lpomanament_data = this.Lpomanament[0].Lpomanament;
    this.type = this.Lpomanament[0].type;
    // this.getBranchList();
    this.getLpoData();
    this.setPageTitle(this.type);
    this.GetAllresourse_list();

    if (this.type == 'Escalation to COO/CEO') {
      this.showescalateddays = 1;
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
      this.loading.dismissAll();
      this.loading = null
    }
  };
  segmentIonChanged(event) {
    console.log("segmentIonChangeddddddddd", event.value);
    // this.petSev = event.value;
  }
  segmentChanged(event) {
    this.selectedSegment = event;
    console.log("petttttttttttttttt", this.selectedSegment);
    console.log("eventttttttttttttttt", event);
    let tabValue = event;
    this.tab_name = event;
    if (tabValue == 'fp') {
      console.log("fp eventttttttttttttttt", event);
      this.onCloseHand('All');
      this.getLpoData();
    } else if (tabValue == 'uganda') {
      console.log("uganda eventttttttttttttttt", event);
      this.onCloseHand('All');
      this.getLpoData();
    } else if (tabValue == 'uk') {
      console.log("uk eventttttttttttttttt", event);
      this.onCloseHand('All');
      this.getLpoData();
    } else if (tabValue == 'treppan') {
      console.log("treppan eventttttttttttttttt", event);
      this.onCloseHand('All');
      this.getLpoData();
    }else if (tabValue == 'oa') {
      console.log("oa eventttttttttttttttt", event);
      this.onCloseHand('All');
      this.getLpoData();
    }
  }

  segmentChangedSev(event) {
    this.petSev = event.value;
    console.log("petSevvvvvvvvvvvv", this.petSev);
    let subTabValue = event.value;
    // this.tab_name = event;
    if (subTabValue == 'urgent') {
      this.onCloseHand('All');
      this.getLpoData();
    } else if (subTabValue == 'important') {
      this.onCloseHand('All');
      this.getLpoData();
    } else if (subTabValue == 'priority') {
      this.onCloseHand('All');
      this.getLpoData();
    } else if (subTabValue == 'normal') {
      this.onCloseHand('All');
      this.getLpoData();
    }
  }

  getBranchList() {
    let time_bf = new Date();
    this.authService.getData({}, 'Lpo/getBranchistDAL').then((result) => {
      this.branchListdetails = result;
      console.log("typeof resulttttt", typeof result, typeof this.branchListdetails);
      console.log('resulttttt Seconds:', this.branchListdetails);
      console.log('branch Seconds:', this.branchListdetails);
      // this.selectedSegment = this.branchListdetails[0].KEY;
    }, (err) => {
      console.log('branch Seconds error', err);
    });

  }

  setPageTitle(uType) {
    if (uType == 'Manager') {
      this.title_page = 'LPO (Waiting Manager Verification)';
    }
    else if (uType == 'Finance-MGR') {
      this.title_page = 'LPO (Waiting Finance Confirm)';
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
    else if (uType == 'Escalation to COO/CEO') {
      this.title_page = 'LPO (Escalation to COO/CEO)';

    } else if (uType == 'CEO APPROVAL WITH OTHER MANAGERS') {
      this.title_page = 'LPO(CEO Approval With Other Manager)';
    }
    else if (uType == 'USER_BASED') {
      this.title_page = 'Pending Approval';
    }
  }

  getLpoData() {

    let uType = this.type;

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
    else if (uType == 'Escalation to COO/CEO')
      _utype = 'ESCALATION';
    else if (uType == 'USER_BASED')
      _utype = 'USER_BASED';
    else if (uType == 'CEO APPROVAL WITH OTHER MANAGERS')
      _utype = 'WCAOMV';

    this.ResourseList = this.resourse;

    let params = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      resourceTypeId: this.ResourseList.TYPE_ID,
      resourceTypeUser: this.ResourseList.TYPE_USER,
      isteppan: this.ResourseList.ISTEPPAN,
      isfm: this.ResourseList.ISFM,
      isalllpo: this.ResourseList.ISALLLPO,
      LBL_TYPE: _utype,
      USER_ID: this.user.UserInfoId
    }

    if (this.searchData.search_value == null || this.searchData.search_value == '' || this.searchData.search_value == undefined) {
      if (this.Lpomanament[0].search_value != '' && this.Lpomanament[0].search_value != undefined && this.Lpomanament[0].search_value != null) {
        this.searchData.search_value = this.Lpomanament[0].search_value;
      } else {
        this.searchData.search_value = null;
      }
    }

    this.presentLoadingDefault(true);
    let time_bf = new Date();
    this.authService.postData(params, 'Lpo/GetLpoListByUser').then((result) => {
      this.Lpomanament_data = result;
      this.Lpomanament_dataAll = result;
      this.searchLpoList = result;
      console.log(this.searchLpoList);

      if(this.tab_name == 'uganda'){
        if(this.petSev == 'normal'){
        this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'UG' && x.SEVERITY_TYPE == 'Normal');
        }else if(this.petSev == 'urgent'){
          this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'UG' && x.SEVERITY_TYPE == 'Urgent');
          }else if(this.petSev == 'important'){
            this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'UG' && x.SEVERITY_TYPE == 'Emergency');
            }else if(this.petSev == 'priority'){
              this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'UG' && x.SEVERITY_TYPE == 'Priority');
              }
      }else if(this.tab_name == 'uk'){
        if(this.petSev == 'normal'){
        this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'HMAF-UK Operating Unit' || x.OPERATIONAL_UNIT_NAME == 'FP-UK Operating Unit' || x.OPERATIONAL_UNIT_NAME == 'UKBRCNL Operating Unit'|| x.OPERATIONAL_UNIT_NAME == 'HINDHEAD Operating Unit' || x.OPERATIONAL_UNIT_NAME == 'LEO Operating Unit'|| x.OPERATIONAL_UNIT_NAME == 'DUNSTY Operating Unit' && x.SEVERITY_TYPE == 'Normal');
        }else if(this.petSev == 'urgent'){
          this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'HMAF-UK Operating Unit' || x.OPERATIONAL_UNIT_NAME == 'FP-UK Operating Unit' || x.OPERATIONAL_UNIT_NAME == 'UKBRCNL Operating Unit'|| x.OPERATIONAL_UNIT_NAME == 'HINDHEAD Operating Unit' || x.OPERATIONAL_UNIT_NAME == 'LEO Operating Unit'|| x.OPERATIONAL_UNIT_NAME == 'DUNSTY Operating Unit' && x.SEVERITY_TYPE == 'Urgent');
          }else if(this.petSev == 'important'){
            this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'HMAF-UK Operating Unit' || x.OPERATIONAL_UNIT_NAME == 'FP-UK Operating Unit' || x.OPERATIONAL_UNIT_NAME == 'UKBRCNL Operating Unit'|| x.OPERATIONAL_UNIT_NAME == 'HINDHEAD Operating Unit' || x.OPERATIONAL_UNIT_NAME == 'LEO Operating Unit'|| x.OPERATIONAL_UNIT_NAME == 'DUNSTY Operating Unit' && x.SEVERITY_TYPE == 'Emergency');
            }else if(this.petSev == 'priority'){
              this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'HMAF-UK Operating Unit' || x.OPERATIONAL_UNIT_NAME == 'FP-UK Operating Unit' || x.OPERATIONAL_UNIT_NAME == 'UKBRCNL Operating Unit'|| x.OPERATIONAL_UNIT_NAME == 'HINDHEAD Operating Unit' || x.OPERATIONAL_UNIT_NAME == 'LEO Operating Unit'|| x.OPERATIONAL_UNIT_NAME == 'DUNSTY Operating Unit' && x.SEVERITY_TYPE == 'Priority');
              }
      }else if(this.tab_name == 'treppan'){
        if(this.petSev == 'normal'){
        this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'TREPPAN' && x.SEVERITY_TYPE == 'Normal');
        }else if(this.petSev == 'urgent'){
          this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'TREPPAN' && x.SEVERITY_TYPE == 'Urgent');
        }else if(this.petSev == 'important'){
          this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'TREPPAN' && x.SEVERITY_TYPE == 'Emergency');
        }else if(this.petSev == 'priority'){
          this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'TREPPAN' && x.SEVERITY_TYPE == 'Priority');
        }
      }else if(this.tab_name == 'oa'){
        if(this.petSev == 'normal'){
        this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'OA' && x.SEVERITY_TYPE == 'Normal');
        }else if(this.petSev == 'urgent'){
          this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'OA' && x.SEVERITY_TYPE == 'Urgent');
          }else if(this.petSev == 'important'){
            this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'OA' && x.SEVERITY_TYPE == 'Emergency');
            }else if(this.petSev == 'priority'){
              this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'OA' && x.SEVERITY_TYPE == 'Priority');
              }
      }else{
        if(this.petSev == 'normal'){
        this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME != 'HMAF-UK Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'FP-UK Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'UKBRCNL Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'HINDHEAD Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'LEO Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'DUNSTY Operating Unit' &&  x.OPERATIONAL_UNIT_NAME != 'UG' && x.OPERATIONAL_UNIT_NAME != 'TREPPAN' && x.SEVERITY_TYPE == 'Normal');
        }else if(this.petSev == 'urgent'){
          this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME != 'HMAF-UK Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'FP-UK Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'UKBRCNL Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'HINDHEAD Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'LEO Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'DUNSTY Operating Unit' &&  x.OPERATIONAL_UNIT_NAME != 'UG' && x.OPERATIONAL_UNIT_NAME != 'TREPPAN' && x.SEVERITY_TYPE == 'Urgent');
          }else if(this.petSev == 'important'){
            this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME != 'HMAF-UK Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'FP-UK Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'UKBRCNL Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'HINDHEAD Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'LEO Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'DUNSTY Operating Unit' &&  x.OPERATIONAL_UNIT_NAME != 'UG' && x.OPERATIONAL_UNIT_NAME != 'TREPPAN' && x.SEVERITY_TYPE == 'Emergency');
            }else if(this.petSev == 'priority'){
              this.Lpomanament_data = this.Lpomanament_dataAll.filter(x=> x.OPERATIONAL_UNIT_NAME != 'HMAF-UK Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'FP-UK Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'UKBRCNL Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'HINDHEAD Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'LEO Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'DUNSTY Operating Unit' &&  x.OPERATIONAL_UNIT_NAME != 'UG' && x.OPERATIONAL_UNIT_NAME != 'TREPPAN' && x.SEVERITY_TYPE == 'Priority');
              }
      }
    
      // this.itemsToDisplay_ug = [];
      // this.itemsToDisplay_uk = [];
      // this.itemsToDisplay_treppan = [];
      // this.itemsToDisplay_oa = [];
      // this.itemsToDisplay_fp = [];
      this.itemsToDisplay = [];

      let total_count = 10;
      let array_len   = 0;

      if (total_count < this.Lpomanament_data.length) {
        array_len = total_count;
      } else {
        array_len = this.Lpomanament_data.length;
      }

      // if(this.tab_name == 'uganda'){
      //   for (let i = 0; i < array_len; i++) {
      //     this.itemsToDisplay_ug.push(this.Lpomanament_data[i]);
      //   }
      // }else if(this.tab_name == 'uk'){
      //   for (let i = 0; i < array_len; i++) {
      //     this.itemsToDisplay_uk.push(this.Lpomanament_data[i]);
      //   }
      // }else if(this.tab_name == 'treppan'){
      //   for (let i = 0; i < array_len; i++) {
      //     this.itemsToDisplay_treppan.push(this.Lpomanament_data[i]);
      //   }
      // }else if(this.tab_name == 'oa'){
      //   for (let i = 0; i < array_len; i++) {
      //     this.itemsToDisplay_oa.push(this.Lpomanament_data[i]);
      //   }
      // }else{
      //   for (let i = 0; i < array_len; i++) {
      //     this.itemsToDisplay_fp.push(this.Lpomanament_data[i]);
      //   }
      // }

      for (let i = 0; i < array_len; i++) {
             this.itemsToDisplay.push(this.Lpomanament_data[i]);
           }
      
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log('Seconds:', seconds);

      this.presentLoadingDefault(false);

      if (this.searchData.search_value != '' && this.searchData.search_value != undefined && this.searchData.search_value != null) {
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

    this.user_type = this.ResourseList.TYPE_USER;
    this.user_type_id = this.ResourseList.TYPE_ID;
    this.user_resource_id = this.ResourseList.RESOURCE_ID;

    if (this.ResourseList.TYPE_USER === "COO") {
      this.rejectbtn_approvebtn_show = 'block';
    } else if (this.ResourseList.TYPE_USER === "CEO") {
      this.rejectbtn_approvebtn_show = 'block';
    } else {
      this.rejectbtn_approvebtn_show = 'none';
    }
  }


  SearchManagement() {
    let _id = parseInt(this.searchData.search_value);
    let item = this.searchData.search_value;
    if (this.title_btn == 'Close') {
      let case_val = this.searchData.search_value;
      if (case_val != '') {
        let filterData = this.Lpomanament_dataAll.filter(item => this.filter(item));
        this.Lpomanament_data = filterData;
        // this.itemsToDisplay_ug = [];
        // this.itemsToDisplay_uk = [];
        // this.itemsToDisplay_treppan = [];
        // this.itemsToDisplay_oa = [];
        // this.itemsToDisplay_fp = [];
        this.itemsToDisplay = [];
        
        // if(this.tab_name == 'uganda'){
        //   for (let i = 0; i < this.Lpomanament_data.length; i++) {
        //     this.itemsToDisplay_ug.push(this.Lpomanament_data[i]);
        //   }
        // }else if(this.tab_name == 'uk'){
        //   for (let i = 0; i < this.Lpomanament_data.length; i++) {
        //     this.itemsToDisplay_uk.push(this.Lpomanament_data[i]);
        //   }
        // }else if(this.tab_name == 'treppan'){
        //   for (let i = 0; i < this.Lpomanament_data.length; i++) {
        //     this.itemsToDisplay_treppan.push(this.Lpomanament_data[i]);
        //   }
        // }else if(this.tab_name == 'oa'){
        //   for (let i = 0; i < this.Lpomanament_data.length; i++) {
        //     this.itemsToDisplay_oa.push(this.Lpomanament_data[i]);
        //   }
        // }else{
        //   for (let i = 0; i < this.Lpomanament_data.length; i++) {
        //     this.itemsToDisplay_fp.push(this.Lpomanament_data[i]);
        //   }
        // }

        for (let i = 0; i < this.Lpomanament_data.length; i++) {
               this.itemsToDisplay.push(this.Lpomanament_data[i]);
             }

      } else {
        this.Lpomanament_data = this.Lpomanament_dataAll;

        // this.itemsToDisplay_ug = [];
        // this.itemsToDisplay_uk = [];
        // this.itemsToDisplay_treppan = [];
        // this.itemsToDisplay_oa = [];
        // this.itemsToDisplay_fp = [];
        this.itemsToDisplay = [];

        for (let i = 0; i < this.Lpomanament_data.length; i++) {
          this.itemsToDisplay.push(this.Lpomanament_data[i]);
        }

        // if(this.tab_name == 'uganda'){
        //   for (let i = 0; i < this.Lpomanament_data.length; i++) {
        //     this.itemsToDisplay_ug.push(this.Lpomanament_data[i]);
        //   }
        // }else if(this.tab_name == 'uk'){
        //   for (let i = 0; i < this.Lpomanament_data.length; i++) {
        //     this.itemsToDisplay_uk.push(this.Lpomanament_data[i]);
        //   }
        // }else if(this.tab_name == 'treppan'){
        //   for (let i = 0; i < this.Lpomanament_data.length; i++) {
        //     this.itemsToDisplay_treppan.push(this.Lpomanament_data[i]);
        //   }
        // }else if(this.tab_name == 'oa'){
        //   for (let i = 0; i < this.Lpomanament_data.length; i++) {
        //     this.itemsToDisplay_oa.push(this.Lpomanament_data[i]);
        //   }
        // }else{
        //   for (let i = 0; i < this.Lpomanament_data.length; i++) {
        //     this.itemsToDisplay_fp.push(this.Lpomanament_data[i]);
        //   }
        // }

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

  filter(item) {
    let _val = this.searchData.search_value;
    let _case_val = item['LPO_ID'] ? item['LPO_ID'].toString().toUpperCase() : '';
    let _lease_val = item['SUPPLIER_NAME'] ? item['SUPPLIER_NAME'].toString().toUpperCase() : '';
    return (_case_val.includes(_val.toUpperCase()) || _lease_val.includes(_val.toUpperCase()));
  }


  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    let len = 0; //this.itemsToDisplay.length;

    // if(this.tab_name == 'uganda'){ 
    //   len = this.itemsToDisplay_ug.length;      
    // }else if(this.tab_name == 'uk'){      
    //   len = this.itemsToDisplay_uk.length;     
    // }else if(this.tab_name == 'treppan'){      
    //   len = this.itemsToDisplay_treppan.length;      
    // }else if(this.tab_name == 'oa'){      
    //   len = this.itemsToDisplay_oa.length;      
    // }else{      
    //   len = this.itemsToDisplay_fp.length;      
    // }
    len = this.itemsToDisplay.length;   

    setTimeout(() => {

      let total_count = len + 10;
      let array_len = 0;
      if (total_count < this.Lpomanament_data.length) {
        array_len = total_count;
      } else {
        array_len = this.Lpomanament_data.length;
      }

      // if(this.tab_name == 'uganda'){        
      //   for (let i = len; i < array_len; i++) {
      //     this.itemsToDisplay_ug.push(this.Lpomanament_data[i]);
      //   }
      // }else if(this.tab_name == 'uk'){
      //   for (let i = len; i < array_len; i++) {
      //     this.itemsToDisplay_uk.push(this.Lpomanament_data[i]);
      //   }
      // }else if(this.tab_name == 'treppan'){
      //   for (let i = len; i < array_len; i++) {
      //     this.itemsToDisplay_treppan.push(this.Lpomanament_data[i]);
      //   }
      // }else if(this.tab_name == 'oa'){
      //   for (let i = len; i < array_len; i++) {
      //     this.itemsToDisplay_oa.push(this.Lpomanament_data[i]);
      //   }
      // }else{
      //   for (let i = len; i < array_len; i++) {
      //     this.itemsToDisplay_fp.push(this.Lpomanament_data[i]);
      //   }
      // }

      for (let i = len; i < array_len; i++) {
           this.itemsToDisplay.push(this.Lpomanament_data[i]);
           }
      
     
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

  closeModal() {
    if (this.title_btn == 'Close') {
      this.view.dismiss();
    } else {
      this.setPageTitle(this.type);
      this.title_btn = 'Close';
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

  goBack() {
    this.view.dismiss();
  }

  resetForm() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  openModal(LPO_ID: any, master_id: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = [{
      LPO_ID: LPO_ID,
      MANAGER_MASTER_ID: master_id
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

  ApprovebtnWithSA(LPO_ID: any) {
    this.specialAttention = 1;
    this.LPOno = LPO_ID;
    this.approve_cmt = 'block';
    this.Approve_with_special_attention();
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
      this.getLpoData();
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
    this.btnTxt = 'In Progress...';
    this.authService.postData(approvedata, 'Lpo/Approvedatainsert').then((result) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save';
      this.approve_cmt = 'none';
      this.getLpoData();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save';
      this.approve_cmt = 'none';
      this.presentToast(err);
    });
  }

  Approve_with_special_attention() {
    var approvedata = {
    LPO_ID : this.LPOno,
    SPECIAL_ATTENTION : 1,
    modified_by : this.user.UserInfoId
    }
    this.authService.postData(approvedata, 'Lpo/update_lpo_special_attention').then((result) => {
      console.log("special attention added");
    }, (err) => {
      console.log("special attention added failed");
    });
  }

  Getallimagelist(LPO_ID: any, count: any) {
    if (count > 0) {
      this.presentLoadingDefault(true);
      this.authService.getData({}, 'Lpo/GetLpoImagelist/' + LPO_ID + '').then((result) => {
        this.presentLoadingDefault(false);
        this.ImageList = result;
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
        const myModalData = [{
          ImageList: this.ImageList,
          page_name: 'LPO'
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


  openLpoItemInModal(product_id: any, type: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      product_id: product_id,
      type: type
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

      let running_total = this.lpoLedgerReportHeader[0].OPENING_BALANCE;

      if (this.lpoLedgerReportHeader.length > 0) {

        this.authService.postData(params, 'Lpo/getLpoLedgerReport').then((result) => {
          this.lpoLedgerReport = result;
          console.log('Ledger Report', this.lpoLedgerReport);

          for (let i = 0; i < this.lpoLedgerReport.length; i++) {
            this.lpoLedgerReport[i].CREATED_ON = moment(this.lpoLedgerReport[i].CREATED_ON).format("DD-MM-YYYY");
            this.lpoLedgerReport[i].RUNNING_AMOUNT = parseInt(running_total) + parseInt(this.lpoLedgerReport[i].BALANCE_QTY);
            running_total = parseInt(running_total) + parseInt(this.lpoLedgerReport[i].BALANCE_QTY)
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
              this.table(this.lpoLedgerReport, ['ROW_NUMBER', 'CREATED_ON', 'TYPE', 'SOURCE', 'IN_QTY', 'OUT_QTY', 'RUNNING_AMOUNT', 'STORE_NAME'], ['S.No', 'Date', 'Type', 'Source', 'In', 'Out', 'Bal', 'Store'])

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

  uploadAudioForApprove() {

    let lpoid = this.LPOno;

    let LpoCommentsData: any = {
      LPO_ID: lpoid,
      created_by: this.user.UserInfoId,
      modified_by: this.user.UserInfoId,
      ReferenceType: 'LPO COMMENT',
      COMMENTS: 'LPO Approve Recording'
    }

    LpoCommentsData.USER = JSON.stringify(LpoCommentsData.USER);
    this.presentLoadingDefault(true);
    console.log(LpoCommentsData);

    this.authService.postData(LpoCommentsData, 'Lpo/LpoCommentsinsert').then((result) => {
      this.insertedValues = result;
      this.presentLoadingDefault(false);

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [{
        user_info_id: this.user.UserInfoId,
        comments_id: lpoid,
        comments_child_id: result,
        module_type: 'LPO',
        comment_created_by: this.user.UserInfoId
      }]


      let modelpage = '';
      modelpage = 'AudioCommentsPage';

      let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

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

  onCloseHand(mode) {
    if (mode == 'reject') {
      this.clearvalues();
      this.reject_cmt = 'none';
    } else if (mode == 'approve') {
      this.clearvalues();
      this.approve_cmt = 'none';
    } else if (mode == 'material') {
      this.clearvalues();
      this.iSmaterial = 'none';
    }else{
      this.clearvalues();
      this.reject_cmt = 'none';
      this.approve_cmt = 'none';
      this.iSmaterial = 'none';
    }
  }

  clearvalues() {
    this.ApproveForm.reset();
    this.RejectForm.reset();
    return false;
  }

}
