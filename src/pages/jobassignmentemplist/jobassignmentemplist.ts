import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Modal, ModalController, ModalOptions,ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';


@IonicPage()
@Component({
  selector: 'page-jobassignmentemp',
  templateUrl: 'jobassignmentemplist.html',
})

export class JobAssignmentEmpListPage {

    jobassignmentdatall: any;
    insertedValues: any;
    jobassignmentsearch: any;
    searchData = {"search_value": ""};    
    
    user :any =  localStorage.getItem('userData');
    constructor(public navCtrl: NavController, public navParams: NavParams,
                public authService:RestProvider, public toastCtrl:ToastController,
                private modal: ModalController,
                public loadingCtrl: LoadingController, public view: ViewController) {
                    this.user = this.user ? JSON.parse(this.user) : {};  
                }

      presentToast(msg) {
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 2000,
          position:'middle'
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

      goBack(){
        this.navCtrl.setRoot(DashboardPage);
      }

      jobAssignmentDetails(){
          const Data = this.navParams.get('data');
          let DEPARTMENT_NAME = Data[0].DEPARTMENT_NAME;
          let myTitle = 'Employees';
          this.presentLoadingDefault(true);
          this.authService.getData({},'jobdescription/JobAssignmentEmpList/'+DEPARTMENT_NAME).then((result) => {
              this.jobassignmentdatall = result;
              this.jobassignmentsearch = result;
              this.presentLoadingDefault(false);
              if(this.jobassignmentdatall.length > 0){
                  this.presentLoadingDefault(false);
                  //this.presentToast(`Data found in ${myTitle}`);
              }else{
                  this.presentLoadingDefault(false);
                  this.presentToast(`No data found in ${myTitle}`);
              }
          }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast(err);
          });
      }

      ionViewDidLoad() {         
          this.jobAssignmentDetails();
      }

      closeModal() {
        this.view.dismiss();
      }

      openModal(DEP_NAME: any, EMP_NAME:any) {
        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };

        let myModalData = [{
            DEPARTMENT_NAME: DEP_NAME,
            EMP_NAME: EMP_NAME
        }];

        let myModal: Modal = this.modal.create('JobDescriptionListPage', { data: myModalData }, myModalOptions);

        myModal.present();

        myModal.onDidDismiss((data) => {
            // console.log("I have dismissed.");
            // console.log(data);
        });

        myModal.onWillDismiss((data) => {
            // console.log("I'm about to dismiss");
            // console.log(data);
        });
    }
      
      SearchdrecDetail(){
          let drec_val = this.searchData.search_value;
          if(drec_val !=''){
              this.jobassignmentsearch = this.jobassignmentsearch.filter(item => (item.DESCRIPTION ? item.DESCRIPTION.includes(drec_val):''));             
          }else{
              this.jobassignmentsearch = this.jobassignmentdatall;              
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