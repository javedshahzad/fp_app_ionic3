import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { AlertController } from 'ionic-angular';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { Constant } from '../../providers/constant/constant'

@IonicPage()
@Component({
  selector: 'page-taskattachment',
  templateUrl: 'weeklycmtattachment.html',
})

export class WeeklyCmtFileUploadsPage {
  taskuploadsdetails: any
  taskUploadsForm: FormGroup
  insertedValues: any;
  file_name: any;
  size: any;
  imageURI: any;
  downloadUrl: any;
  today:any;
  taskdata = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController, public atrCtrl: AlertController,
    public loadingCtrl: LoadingController, public view: ViewController,  public constant:Constant, private file: File, private fileOpener: FileOpener ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.today = Date.now();
    this.taskUploadsForm = this.formBuilder.group({
      COMMENTS_ID: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewWillLoad() {
    const Data = this.navParams.get('data');
    this.presentLoadingDefault(true); 
    let COMMENTS_ID = Data[0].comment_child_id;   
    this.Getfilelist(COMMENTS_ID);
    
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

  insertTaskFileUpload(){
    const Data = this.navParams.get('data');
    let taskuploadsData = this.taskUploadsForm.value;
    taskuploadsData.created_by = this.user.UserInfoId;
    taskuploadsData.modified_by = this.user.UserInfoId;
    taskuploadsData.imageURI_data = this.imageURI;
    taskuploadsData.name = this.file_name;
    taskuploadsData.size_data = this.size;
    this.presentLoadingDefault(true);
    this.authService.postData(taskuploadsData, 'task/dailycommentsInsertFile').then((result) => {
      this.presentLoadingDefault(false);
      this.Getfilelist(Data[0].comment_child_id);
      this.presentToast("File upload is successfully saved");
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  Getfilelist(COMMENTS_ID){
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/weeklyUploadedFileList/' + COMMENTS_ID).then((result) => {
      this.taskuploadsdetails = result;
      this.presentLoadingDefault(false);
      if (this.taskuploadsdetails.length > 0) {
        this.presentLoadingDefault(false);
      } else {
        this.presentLoadingDefault(false);
        //this.presentToast(`No data found `);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  onSelectFile(event) {
    let file = event.target.files[0];
    this.file_name = file.name;
    this.size = file.size;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e) => {
      this.imageURI = reader.result;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
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

  bytesToSize(bytes) {
    return(bytes / 1048576).toFixed(3) + " MB";
 }


  getfile(row_no, item: any) {

    let objFile = this.taskuploadsdetails.find(o => o.ROW_NO === row_no);
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];
    //this.downloadUrl = window.URL.createObjectURL(new Blob([new Uint8Array(item.FILE_CONTENT.data)]));
    this.downloadUrl = new Blob([new Uint8Array(item.FILE_CONTENT.data)]);
    let content_type = this.constant.fileTypes.filter(ext => ext.name == extn.toUpperCase())
    this.saveAndOpenPdf(this.downloadUrl,file_name,content_type[0]);
  }

  saveAndOpenPdf(pdf: any, filename: any,content_type:any) {
    const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
    this.file.writeFile(writeDirectory, filename, pdf, {replace: true})
      .then(() => {
          //this.loading.dismiss();
          this.fileOpener.open(writeDirectory + filename, content_type.type)
              .catch(() => {
                  console.log('Error opening pdf file');
                  //this.loading.dismiss();
              });
      })
      .catch(() => {
          console.error('Error writing pdf file');
          //this.loading.dismiss();
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