import { Component, ViewChild } from '@angular/core';
import { IonicPage, Platform, ActionSheetController, NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { AlertController } from 'ionic-angular';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { Constant } from '../../providers/constant/constant'
// import { FileTransfer } from '@ionic-native/file-transfer';
// import { File } from '@ionic-native/file';


import { AngularCropperjsComponent } from 'angular-cropperjs';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-taskattachment',
  templateUrl: 'taskattachment.html',
})
export class TaskFileUploadsPage {
  
  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
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
  
  myImage = null;
  scaleValX = 1;
  scaleValY = 1;
  show_profile_image = 0;
  show_profile_image_crop = 1;
  public profileImg: string;
  public base64Image: string;  
  public photos: any = [];
  
  cropperOptions: any;
  croppedImage = null;
  base64Str: any;
  kbytes: number;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
              public authService: RestProvider, public toastCtrl: ToastController, public atrCtrl: AlertController,
              public loadingCtrl: LoadingController, public view: ViewController,  public constant:Constant, private file: File, 
              private fileOpener: FileOpener, private actionsheetCtrl: ActionSheetController, private camera: Camera,
              private alertCtrl: AlertController
  ){

    this.cropperOptions = {
      dragMode: 'crop',
      aspectRatio: 1,
      autoCrop: true,
      movable: true,
      zoomable: true,
      scalable: true,
      autoCropArea: 0.8,
    };

    this.user = this.user ? JSON.parse(this.user) : {};
    this.today = Date.now();
    this.taskUploadsForm = this.formBuilder.group({
      TASK_ID: ['', Validators.compose([Validators.required])]
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

  insertTaskFileUpload() {
    let taskuploadsData = this.taskUploadsForm.value;
    taskuploadsData.CREATED_BY = this.user.UserInfoId;
    taskuploadsData.MODIFIED_BY = this.user.UserInfoId;
    taskuploadsData.USERNAME = this.user.Surname;
    taskuploadsData.imageURI_data = this.imageURI;
    taskuploadsData.name = this.file_name;
    taskuploadsData.size_data = this.size;
    this.presentLoadingDefault(true);
    this.authService.postData(taskuploadsData, 'task/TaskInsertFile').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("File upload is successfully saved");
      this.insertedValues = result;
      this.closeModal();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  // DeleteTaskUploadedFile(TASK_ID: any, TASK_FILE_ID: any, FILE_NAME: any, FILE_TYPE: any) {
  //   let alertConfirm = this.atrCtrl.create({
  //     title: '',
  //     message: 'Are you sure you want to permanently delete this file?',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('No clicked');
  //         }
  //       },
  //       {
  //         text: 'Yes',
  //         handler: () => {
  //           console.log('Yes clicked');
  //           let taskDeleteFileDetails = {} as any;
  //           taskDeleteFileDetails.task_file_id = TASK_FILE_ID;
  //           taskDeleteFileDetails.task_id = TASK_ID;
  //           taskDeleteFileDetails.task_file_name = FILE_NAME;
  //           taskDeleteFileDetails.task_file_type = FILE_TYPE;
  //           taskDeleteFileDetails.created_by = this.user.UserInfoId;
  //           taskDeleteFileDetails.modified_by = this.user.UserInfoId;

  //           debugger;
  //           this.presentLoadingDefault(true);
  //           this.authService.postData(taskDeleteFileDetails, 'drec/DrecDeleteUploadedFile').then((result) => {
  //             this.presentLoadingDefault(false);
  //             this.presentToast("File removed successfully.");
  //           }, (err) => {
  //             this.presentLoadingDefault(false);
  //             this.presentToast(err);
  //           });

  //         }
  //       }
  //     ]
  //   });
  //   alertConfirm.present();
  // }

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

  ionViewWillLoad() {
    const Data = this.navParams.get('data');
    let myTitle = 'Task Uploads';
    let TASK_ID = Data[0].TASK_ID;
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/TaskUploadedFileList/' + TASK_ID).then((result) => {
      this.taskuploadsdetails = result;
      console.log(this.taskuploadsdetails);
      this.presentLoadingDefault(false);
      if (this.taskuploadsdetails.length > 0) {
        this.presentLoadingDefault(false);
      } else {
        this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
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
    console.log(objFile);
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];
    //this.downloadUrl = window.URL.createObjectURL(new Blob([new Uint8Array(item.FILE_CONTENT.data)]));
    this.downloadUrl = new Blob([new Uint8Array(item.FILE_CONTENT.data)]);
    let content_type = this.constant.fileTypes.filter(ext => ext.name == extn.toUpperCase())
    this.saveAndOpenPdf(this.downloadUrl,file_name,content_type[0]);

    console.log('DataURL:', this.downloadUrl);

    // const a = document.createElement('a');
    // a.setAttribute('style', 'display:none;');
    // document.body.appendChild(a);

    // a.href = this.downloadUrl;
    // a.download = file_name;
    // a.click();
    // if (extn == 'pdf') {
    //   return `data:image/${extn};base64,${this.encode(bytes)}`;
    // } else {
    //   return `./assets/imgs/no-found-photo.png`
    // }

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


  rotate() {
    this.angularCropper.cropper.rotate(90);
  }

  reset() {
    this.angularCropper.cropper.reset();
  }

  zoom(zoomIn: boolean) {
    let factor = zoomIn ? 0.1 : -0.1;
    this.angularCropper.cropper.zoom(factor);
  }

  scaleX() {
    this.scaleValX = this.scaleValX * -1;
    this.angularCropper.cropper.scaleX(this.scaleValX);
  }

  scaleY() {
    this.scaleValY = this.scaleValY * -1;
    this.angularCropper.cropper.scaleY(this.scaleValY);
  }

  move(x, y) {
    this.angularCropper.cropper.move(x, y);
  }

  openBrowser() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Option',
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
      quality: 50, 
      destinationType: this.camera.DestinationType.DATA_URL,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      //this.photos.push(this.base64Image);
      this.imageURI = this.base64Image;
      this.myImage  = this.base64Image;      
      this.show_profile_image = 1;
      this.show_profile_image_crop = 0;
    }, (err) => {
      console.log(err);
    });
  }

  openGallery() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }

    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imageURI = this.base64Image;
      this.myImage  = this.base64Image;
      this.show_profile_image = 1;
      this.show_profile_image_crop = 0;
    }, (err) => {
      // Handle error
    })
  }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: 'Sure you want to delete this photo? There is NO undo!',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }

  upload_then_deletePhoto(index) {
    this.photos.splice(index, 1);
  }

  save() {
    let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
    this.croppedImage = croppedImgB64String;
    this.imageURI = croppedImgB64String;
    this.photos.push(croppedImgB64String);
    this.show_profile_image = 0;
    this.show_profile_image_crop = 1;
    this.photos.reverse();
  }

  calculateImageSize(base64String) {
    let padding;
    let inBytes;
    let base64StringLength;
    if (base64String.endsWith('==')) { padding = 2; }
    else if (base64String.endsWith('=')) { padding = 1; }
    else { padding = 0; }

    base64StringLength = base64String.length;
    console.log(base64StringLength);
    inBytes = (base64StringLength / 4) * 3 - padding;
    console.log(inBytes);
    this.kbytes = inBytes / 1000;
    return this.kbytes;
  }

  Uploadmyprofile(id: any) {
    let _month = new Date().getMonth() + 1;
    const Data = this.navParams.get('data');
    let TASK_ID = Data[0].TASK_ID;

    this.base64Str = this.photos[id].split(',');
    let file_size = this.calculateImageSize(this.base64Str[1]);
    this.file_name = 'task_' + TASK_ID + '_' + new Date().getDate() + _month + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.jpeg';
    console.log(file_size);

    let taskuploadsData = this.taskUploadsForm.value;
    taskuploadsData.CREATED_BY = this.user.UserInfoId;
    taskuploadsData.MODIFIED_BY = this.user.UserInfoId;
    taskuploadsData.USERNAME = this.user.Surname;
    taskuploadsData.imageURI_data = this.photos[id];
    taskuploadsData.name = this.file_name;
    taskuploadsData.size_data = file_size;

    debugger;
    console.log(taskuploadsData);
    this.presentLoadingDefault(true);
    this.authService.postData(taskuploadsData, 'task/TaskInsertFile').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("File upload is successfully saved");
      this.insertedValues = result;
      this.closeModal();
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