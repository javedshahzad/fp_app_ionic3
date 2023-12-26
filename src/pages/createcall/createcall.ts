import { Component } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { IonicPage,Platform, NavController, NavParams,ToastController,LoadingController,ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';

/**
 * Generated class for the ReceiptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-createcall',
  templateUrl: 'createcall.html',
})
export class createcall {

  createcallForm:FormGroup
  user : any = localStorage.getItem('userData');
  locationList: any;
  buildingList: any;
  unitList: any;
  statusList: any;
  complaintList = [] as any;
  selectedBuilding : any;
  selectedUnit : any;
  selecteduser: any;
  insertedValues: any;
  fileToUpload: File = null;
  file:any= [];
  file_name:any= [];
  size:any= [];
  formData:any;
  imageURI:any= [];
  fileUploadService :any;
  complaint= [] as any;
  unit:any;
  Building:any;
  Location:any;
  ASSIGNED_TO_IDworklist:any;
  uservalue:any;
  ASSIGNED_SITE_MAP_GET_ALL:any;
  selectport:any;
  Assigned:any;
  mobile:any;
  moblie_no_error: any;
  email_validation:any;
  email:any;
  pushnotificationValues:any;
  code = '00971';
  constructor(public platform: Platform ,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
              public authService:RestProvider, public toastCtrl:ToastController,
              public loadingCtrl: LoadingController, public view: ViewController) { 
                
      this.user = this.user ? JSON.parse(this.user) : {};  
        this.createcallForm = this.formBuilder.group({
          code: ['', Validators.compose([Validators.required])],
          building: ['', Validators.compose([Validators.required])],
          unit: ['', Validators.compose([Validators.required])],
          location: ['', Validators.compose([Validators.required])],
          mobile: [],
          email: [],
          complaint: ['', Validators.compose([Validators.required])],
          comments: ['', Validators.compose([Validators.required])],
          file: [],
          Assigned_to: [],
          requestor_name: ['', Validators.compose([Validators.required])]
        });
  }
  ionViewDidLoad() {
    this.getLocationList();
    this.getBuildingList();
    this.getUnitList();
    this.getStatusList();
    this.getComplaintList();
    //this.ASSIGNED_TO_ID();
    this.ASSIGNED_SITE_MAP();
  }
  isReadonly() {
    return this.isReadonly;   //return true/false 
  }
 
  getLocationList(){
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'call_management/LocationList').then((result) => {
      this.locationList = result;
      this.presentLoadingDefault(false);
      if (this.locationList.length > 0) {
      } else {
        this.presentToast("No data found.");
      }
    }, (err) => { 
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }
  
  getBuildingList(){
    this.authService.getData({}, 'call_management/BuildingList/').then((result) => {
      this.buildingList = result;
      if (this.buildingList.length > 0) {
      } else {
        this.presentToast("No data found.");
      }
    }, (err) => {
      this.presentToast(err);
    });
  }

  getUnitList(){
    this.authService.getData({}, 'call_management/UnitList').then((result) => {
      this.unitList = result;
      if (this.unitList.length > 0) {
      } else {
        this.presentToast("No data found.");
      }
    }, (err) => {
      this.presentToast(err);
    });
  }

  getStatusList(){
    this.authService.getData({}, 'call_management/StatusList').then((result) => {
      this.statusList = result;
      if (this.statusList.length > 0) {
      } else {
        this.presentToast("No data found.");
      }
    }, (err) => {
      this.presentToast(err);
    });
  }

  getComplaintList(){
    this.authService.getData({}, 'call_management/ComplaintList').then((result) => {
    //  this.presentLoadingDefault(false);
      this.complaintList = result;
      if (this.complaintList.length > 0) {
      } else {
        this.presentToast("No data found.");
      }
    }, (err) => {
      this.presentToast(err);
    });
  }

  ASSIGNED_TO_ID(){
    this.presentLoadingDefault(true);
    this.authService.getData({},'call_management/ASSIGNED_to_id/').then((result) => {
      this.Assigned = result;
      this.presentLoadingDefault(false);
      this.ASSIGNED_TO_IDworklist = this.Assigned.filter(user => user.TYPE_USER == "Supervisor");
      // if(this.ASSIGNED_TO_IDworklist.length > 0){
      //   this.presentLoadingDefault(false);
      // }else{
      //   this.presentLoadingDefault(false);
      // }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast(err);
    });
  }

  
  ASSIGNED_SITE_MAP(){
    let data ={
      LOCATION_ID : null
    };
    this.presentLoadingDefault(true);
    this.authService.postData(data,'call_management/ASSIGNED_SITE_MAP_GET_ALL/').then((result) => {
      this.presentLoadingDefault(false);
      this.ASSIGNED_SITE_MAP_GET_ALL = result;
      // if(this.ASSIGNED_SITE_MAP_GET_ALL.length > 0){
      //   this.presentLoadingDefault(false);
      // }else{
      //   this.presentLoadingDefault(false);
      // }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast(err);
    });
  }

  insertCallData(){    
    let CreatecallData = this.createcallForm.value;
    CreatecallData.imageURI_data = this.imageURI;
    CreatecallData.name = this.file_name;
    CreatecallData.location = this.Location;
    CreatecallData.building = this.Building;
    CreatecallData.unit = this.unit;
    CreatecallData.Assigned =  this.uservalue;
    CreatecallData.complaint = this.complaint;
    CreatecallData.size_data = this.size;
    CreatecallData.created_by = this.user.UserInfoId;
    CreatecallData.modified_by = this.user.UserInfoId;
    if(CreatecallData.location !=''&& CreatecallData.building !=''&& CreatecallData.unit !=''&& CreatecallData.complaint !=''&& CreatecallData.requestor_name !=''&& CreatecallData.mobile !=''&& CreatecallData.comments !=''){
    this.presentLoadingDefault(true);
    this.authService.postData(CreatecallData,'call_management/Insertcall').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("call  successfully created  "+result);
      this.insertedValues = result;

      var app_platform:string = '';
      if (this.platform.is('ios')) {
        app_platform = 'ios';
      }

      if (this.platform.is('android')) {
        app_platform = 'android';
      }
      let push_message = {} as any;
      push_message.title = this.user.Surname
      push_message.message = this.createcallForm.value.comments;
      push_message.content = 'CALL INSERTED AND CALL NUMBER'+result;
      push_message.app_platform = app_platform;
      this.presentLoadingDefault(true);
        this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
          this.presentLoadingDefault(false);
          this.pushnotificationValues = result;
          this.closeModal();
        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast(err);
        });
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
  }else{
    this.presentToast("Please enter the all values");
  }
}
  resetForm(){
    this.createcallForm.reset();
    this.createcallForm.value.code = '00971';
    //this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }
  loading = this.loadingCtrl.create(); 
  presentLoadingDefault(show) { 
    if(!this.loading){
      this.loading = this.loadingCtrl.create(); 
    }  
    if(show){
      this.loading.present();
    }
    else{
      this.loading.dismissAll();
      this.loading =null
    }
  };

  closeModal() {
    this.view.dismiss();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}
uploadFileToActivity() {
  this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
    console.log(data);
    }, error => {
      console.log(error);
    });
}
onSelectFile(event){
  let file = event.target.files;
  for(let i=0;i<file.length;i++){
    this.file_name.push(file[i].name);
  this.size.push(file[i].size);
   let reader = new FileReader();
   reader.readAsDataURL(file[i]);
   reader.onloadend = (e) => {
     this.imageURI.push(reader.result);
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
  }
}

complaintChange(event: {
  component: IonicSelectableComponent,
  value: any 
}) {
  //console.log(event.value);
  var complaintdata = event.value;
  for(let i=0;i<complaintdata.length;i++){
    this.complaint.push(complaintdata[i].COMPLAINT_ID);
  }
}
unitChange(event: {
  component: IonicSelectableComponent,
  value: any 
}) {
  this.unit = event.value.UNIT_ID;
}
BuildingChange(event: {
  component: IonicSelectableComponent,
  value: any 
}) {
  this.Building =  event.value.BUILDING_ID;
  this.selectedUnit = this.unitList.filter(unit => unit.BUILDING_ID == event.value.BUILDING_ID);
  
}
LocationChange(event: {
  component: IonicSelectableComponent,
  value: any 
}) {
  this.Location = event.value.LOCATION_ID
  this.selectedBuilding = this.buildingList.filter(building => building.LOCATION_ID == event.value.LOCATION_ID);
  let Assigned_to = this.ASSIGNED_SITE_MAP_GET_ALL.filter(user => user.LOCATION_ID == event.value.LOCATION_ID);
  if(Assigned_to.length > 0){
    this.selecteduser = Assigned_to;
  }else{
    this.selecteduser = this.ASSIGNED_SITE_MAP_GET_ALL;
  }
  this.selectport = this.selecteduser[0].RESOURCE_ID;
    this.selectedUnit = [];
}
userChange(event: {
  component: IonicSelectableComponent,
  value: any 
}) {
  this.uservalue = event.value.RESORCE_ID
}
moblie_no_Change(event){
  let moblie_no_length = event.target.value
    if(moblie_no_length.length > 9){
      this.moblie_no_error = "Please Enter the correct number";
      this.mobile = null;
    }else if(moblie_no_length.length < 9){
      this.moblie_no_error = "Please Enter the correct number";
      this.mobile = null;
    }else{
      this.moblie_no_error = "";
    }
  }

  email_Change(event){
    let email_value = event.target.value;
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    let serchfind = regexp.test(email_value);
   if(serchfind == false){
    this.email_validation = 'Enter the email';
    this.email = null;
   }else{
    this.email_validation = '';
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
