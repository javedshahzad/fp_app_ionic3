import { Component, ViewChild } from '@angular/core';
import { IonicPage,Platform, NavController, NavParams,ToastController,LoadingController,ViewController } from 'ionic-angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { Constant } from '../../providers/constant/constant';
import { IonicSelectableModule  } from 'ionic-selectable';


@IonicPage()
@Component({
  selector: 'page-contractattachment',
  templateUrl: 'contractattachment.html',
})
export class ContractAttachmentPage {


    paymentattachmentForm:FormGroup
    insertedValues: any;
    url:any;
    file_name:any;
    size:any;
    imageURI:any;
    paymentattachmentlist:any;
    downloadUrl:any;
    user : any = localStorage.getItem('userData');
    payment_req_id = this.navParams.get('data');
    attachment_type: any;

    commonattachmentfilelist: any;
    paymentattachmentlist1: any;

    constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService:RestProvider, public toastCtrl:ToastController,public loadingCtrl: LoadingController, 
        public view: ViewController,public constant:Constant, private file: File, private fileOpener: FileOpener ) {
            this.user = this.user ? JSON.parse(this.user) : {};  
            this.paymentattachmentForm = this.formBuilder.group({
                attachmentfile: ['', Validators.compose([Validators.required])],
                type_code: ['', Validators.compose([Validators.required])]
            });
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

  changeListener(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.paymentattachmentForm.get('attachmentfile').setValue(event.target.files[0]);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  insertAttachments(){
    let uploadData = this.paymentattachmentForm.value;
    uploadData.CONTRACTID = this.payment_req_id[0].CONTRACTID
    uploadData.created_by = this.user.UserInfoId;
    uploadData.modified_by = this.user.UserInfoId;
    uploadData.imageURI_data = this.imageURI;
    uploadData.name = this.file_name;
    uploadData.size_data = this.size; 

    console.log(uploadData);

    this.presentLoadingDefault(true);
    this.authService.postData(uploadData,'contract/getInsertContractAttachment').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("File uploaded successfully.");
      this.insertedValues = result;
      this.Getpaymentattachment();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  ionViewWillLoad() {
    console.log(this.payment_req_id);
    this.Getpaymentattachment();
  }

  resetForm(){
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  addAttchmentType(event: { component: IonicSelectableModule , value: any }) {
    console.log(event.value);
    this.attachment_type = event.value;
  }

  
  onSelectFile(event) {
    let file = event.target.files[0];
    this.file_name = file.name;
    this.size = file.size;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    console.log(reader.result);
    reader.onloadend = (e) => {
      this.imageURI = reader.result;
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position:'middle'
    });
    toast.present();
  }
  closeModal() {
    this.view.dismiss();
  }
 
 Getpaymentattachment(){

    const Data = this.navParams.get('data');
    Data[0].ref_code = 'GENERAL';
    console.log(Data[0]);

    this.presentLoadingDefault(true);
    this.authService.postData(Data[0],'contract/getContractAttachmentByRefId').then((result) => {
      this.paymentattachmentlist = result;
      this.presentLoadingDefault(false);
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

  getfile(row_no,ATTACHMENT_ID:any, item: any) {

    const Data = this.navParams.get('data');
    Data[0].ref_code = 'GENERAL';
    Data[0].attachment_id = ATTACHMENT_ID;
    console.log(Data[0]);
      
    let objFile = this.paymentattachmentlist.filter(x=> x.CONTRACT_IMAGE_ID == ATTACHMENT_ID);
    console.log(objFile);
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];
    this.downloadUrl = new Blob([new Uint8Array(objFile.FILE_CONTENT.data)]);
    let content_type = this.constant.fileTypes.filter(ext => ext.name == extn.toUpperCase())
    this.saveAndOpenPdf(this.downloadUrl,file_name,content_type[0]);
          
    
  }

  saveAndOpenPdf(pdf: any, filename: any,content_type:any) {
    const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
    this.file.writeFile(writeDirectory, filename, pdf, {replace: true})
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