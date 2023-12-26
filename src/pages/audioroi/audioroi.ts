import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, ViewController, LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Base64 } from "@ionic-native/base64";

import { Timer } from '../../app/timer';
import { State } from '../../app/state';

import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';

@IonicPage()
@Component({
  selector: 'page-audioroi',
  templateUrl: 'audioroi.html',
})

export class AudioRoiPage {

  @ViewChild('myvideo') myVideo: any;

  isAndroid: boolean = false;
  today: any;
  user: any = localStorage.getItem('userData');
  userdata: any = JSON.parse(this.user);
  taskmodal = this.navParams.get('data');
  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  audioList: any;
  status: string = 'Tab the button to start recording';
  serverAudioFileLocation = '';
  _path: any;
  audio_base64: any;
  fileUri: any
  fileExtn: any;
  pet: string = "pending";
  tab_name: any;
  audio_playing = 0;
  showfooter = 0;
  private btnPlay: string = 'START';

  private timer: Timer = new Timer();
  private state: State = new State();
  twoDigit = '00';
  mediaFiles = [];
  roiCommentList: any;
  message = '';


  constructor(public platform: Platform, public navCtrl: NavController,
    private file: File, public view: ViewController, public toastCtrl: ToastController,
    public authService: RestProvider, private base64: Base64, public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private media: Media,
    private streamingMedia: StreamingMedia

  ) {
    this.isAndroid = platform.is('android');
    this.user = this.user ? JSON.parse(this.user) : {};
    this.today = Date.now();
  }

  ionViewWillEnter() {
    console.log(this.taskmodal);
    this.getAudioList();
  }

  closeModal() {
    this.view.dismiss();
  }

  getAudioList() {

    let commentsData = {
      user_info_id: this.user.UserInfoId,
      comments_id: this.taskmodal[0].comments_id,
      comments_child_id: this.taskmodal[0].comments_child_id,
      module_name: 'ROI'
    }

    this.presentLoadingDefault(true);
    this.authService.postData(commentsData, 'task/getRoiAudioListByType').then((result) => {
      this.audioList = result;
      this.getRoiCommentList();
      this.presentLoadingDefault(false);
      console.log('result', this.audioList);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  getRoiCommentList() {

    let commentsData = {
      user_info_id: this.user.UserInfoId,
      comments_id: this.taskmodal[0].comments_id,
      comments_child_id: this.taskmodal[0].comments_child_id,
      module_name: 'ROI'
    }

    this.authService.postData(commentsData, 'task/getRoiCommentById').then((result) => {
      this.roiCommentList = result;
      console.log('Roi Comment', this.roiCommentList);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
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

  startRecord() {
    let _month = new Date().getMonth() + 1

    if (this.platform.is('ios')) {
      this.fileName = 'roi_' + this.taskmodal[0].comments_child_id + '_' + new Date().getDate() + _month + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.m4a';
      this.filePath = this.file.documentsDirectory + this.fileName;
      this._path = this.file.documentsDirectory;
      this.audio = this.media.create(this.filePath);
      this.audio.startRecord();
      this.status = 'Recording...';
      this.timer.start();
      this.state.setPlay();
      this.btnPlay = 'START';
      this.recording = true;

    } else if (this.platform.is('android')) {
      this.fileName = 'roi_' + this.taskmodal[0].comments_child_id + '_' + new Date().getDate() + _month + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
      this._path = this.file.externalDataDirectory;
      console.log(this.filePath);
      this.audio = this.media.create(this.filePath);

      this.audio.onStatusUpdate.subscribe(status => console.log(status));
      this.audio.onSuccess.subscribe(() => console.log('Action is successful'));
      this.audio.onError.subscribe(error => console.log('Error!', error));

      this.audio.startRecord();
      this.status = 'Recording...';
      this.timer.start();
      this.state.setPlay();
      this.btnPlay = 'START';
      this.recording = true;

    } else {
      return false;
    }

  }

  stopRecord() {
    this.audio.stopRecord();
    this.status = 'Uploading...';
    this.timer.stop();
    this.state.setStop();
    this.timer.reset();
    this.btnPlay = 'START';
    this.recording = false;

    let filePath: string = this.filePath;

    console.log(filePath);

    this.base64.encodeFile(filePath).then((base64File: string) => {

      var x = base64File.substr(13, base64File.length);
      x = "data:audio/mpeg;" + x;

      let data = {
        size_data: 0,
        created_by: this.userdata.UserInfoId,
        modified_by: this.userdata.UserInfoId,
        imageURI_data: x,
        name: this.fileName,
        userid: this.userdata.UserInfoId,
        ID: 0,
        comments_id: this.taskmodal[0].comments_id,
        comments_child_id: this.taskmodal[0].comments_child_id,
        file_name: this.fileName,
        module_name: 'ROI'
      }

      this.authService.postData(data, 'task/uploadroiaudiofilev2').then((result: any) => {
        if (result) {
          this.presentToast("Audio Updated Successfully.");
          this.status = 'Tab the button to start recording';

          if (this.roiCommentList[0].MANAGER_ID != null) {
            if (this.user.UserInfoId != parseInt(this.roiCommentList[0].MANAGER_ID)) {

              var app_platform: string = '';
              let trans_type = '';

              if (this.platform.is('ios')) {
                app_platform = 'ios';
              }

              if (this.platform.is('android')) {
                app_platform = 'android';
              }

              this.message = 'Roi Comment Id: ' + this.taskmodal[0].comments_id + ' - New Recording by ' + this.user.Surname;
              trans_type = 'ROI AUDIO';

              let push_message = {
                title: this.user.Surname,
                content: 'Audio',
                message: this.message,
                app_platform: app_platform,
                user_info_id: this.roiCommentList[0].MANAGER_ID,
                loggedin_user_id: this.user.UserInfoId,
                trans_type: trans_type,
                roi_comments_id: this.taskmodal[0].comments_id,
                roi_comments_child_id: this.taskmodal[0].comments_child_id
              };

              this.authService.postData(push_message, 'pushnotification/pushnotificationsinglechat').then((result) => {
                this.message = "";
              }, (err) => {
                this.presentToast(err);
              });
            }
          }

          this.ionViewWillEnter();
        }
      }, (err) => {
        this.presentToast(err);
      });

    }, (err) => {
      console.log(err);
    });
  }


  playAudio(file: any, file_path: any, idx: any) {

    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      orientation: 'landscape',
      shouldAutoClose: true,
      controls: false
    };

    if (this.platform.is('ios')) {
      this.filePath = file_path;
      //this.audio = this.media.create(this.filePath);
      this.streamingMedia.playAudio(this.filePath, options);
    } else if (this.platform.is('android')) {
      this.filePath = file_path;
      //this.audio = this.media.create(this.filePath);
      this.streamingMedia.playAudio(this.filePath, options);
    }

  }

  pauseAudio(file: any, file_path: any, idx: any) {
    this.audio.pause();
    this.audio_playing = 0;
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  segmentChanged(event) {
    console.log(event.value);
    let tabValue = event.value;
    this.tab_name = event.value;
    if (tabValue == 'pending') {
      this.showfooter = 0;
    } else if (tabValue == 'confirm') {
      this.showfooter = 1;
    }
  }

  play() {
    this.timer.start();
    this.state.setPlay();
    this.btnPlay = 'CONTINUE';
  }

  stop() {
    this.timer.stop();
    this.state.setStop();
  }

  backward() {
    this.timer.reset();
    this.state.setBackward();
    this.btnPlay = 'START';
  }


  deleteAudio(id: any, comments_id: any, comments_child_id: any) {

    this.presentLoadingDefault(true);
    let task_insert_data = {
      id: id,
      comments_id: comments_id,
      comments_child_id: comments_child_id,
      user_info_id: this.user.UserInfoId
    }

    this.authService.postData(task_insert_data, 'task/getDeleteRoiAudio').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Audio is deleted Successfully.");
      this.ionViewWillEnter();
    }, err => {
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

}
