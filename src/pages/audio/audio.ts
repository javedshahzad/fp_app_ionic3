import { Component } from '@angular/core';
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
  selector: 'page-audio',
  templateUrl: 'audio.html',
})

export class AudioPage {


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
  notification_user = [] as any;

  constructor(public platform: Platform, public navCtrl: NavController, private media: Media,
    private file: File, public view: ViewController, public toastCtrl: ToastController,
    public authService: RestProvider, private base64: Base64, public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private streamingMedia: StreamingMedia
  ) {
    this.isAndroid = platform.is('android');
    this.user = this.user ? JSON.parse(this.user) : {};
    this.today = Date.now();
  }



  ionViewWillEnter() {

    let Data = this.navParams.get('data');
    console.log(Data);
    var action_by_array = Data[0].action_by_id.split(',');
    console.log('Action by array', action_by_array);

    for (let j = 0; j < action_by_array.length; j++) {

      let action_by = parseInt(action_by_array[j]);

      if (this.notification_user.indexOf(action_by) === -1) {
        this.notification_user.push(action_by);
        console.log('Notification User', this.notification_user);
      }
    }

    this.getAudioList();
  }

  closeModal() {
    this.view.dismiss();
  }

  getAudioList() {

    let commentsData = {

      user_info_id: this.user.UserInfoId,
      mom_id: this.taskmodal[0].mom_id,
      mom_action_point_id: this.taskmodal[0].mom_action_point_id
    }

    this.presentLoadingDefault(true);
    this.authService.postData(commentsData, 'task/getMomAudioList').then((result) => {
      this.audioList = result;
      this.presentLoadingDefault(false);
      console.log('result', result);
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
      this.fileName = 'mom_' + this.taskmodal[0].mom_action_point_id + '_' + new Date().getDate() + _month + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.wav';
      //this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.filePath = this.file.documentsDirectory + this.fileName;
      this._path = this.file.documentsDirectory;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.fileName = 'mom_' + this.taskmodal[0].mom_action_point_id + '_' + new Date().getDate() + _month + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.wav';
      //this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.filePath = this.file.externalDataDirectory + this.fileName;
      this._path = this.file.externalDataDirectory;
      this.audio = this.media.create(this.filePath);
    } else {

    }

    this.audio.startRecord();
    this.status = 'Recording...';
    this.timer.start();
    this.state.setPlay();
    this.btnPlay = 'START';
    this.recording = true;

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
        mom_id: this.taskmodal[0].mom_id,
        mom_action_point_id: this.taskmodal[0].mom_action_point_id,
        file_name: this.fileName
      }

      this.authService.postData(data, 'task/uploadaudiofile').then((result: any) => {
        if (result) {
          this.presentToast("Audio Updated Successfully.");
          this.status = 'Tab the button to start recording';

          var app_platform: string = '';
          if (this.platform.is('ios')) {
            app_platform = 'ios';
          }

          if (this.platform.is('android')) {
            app_platform = 'android';
          }

          for (let j = 0; j < this.notification_user.length; j++) {

            let action_by = parseInt(this.notification_user[j]);

            if (action_by != this.user.UserInfoId) {

              let push_message = {} as any;
              push_message.title = this.user.Surname;
              push_message.content = 'Minutes Of Meeting ';
              push_message.message = 'Recording';
              push_message.app_platform = app_platform;
              push_message.user_info_id = action_by;
              push_message.loggedin_user_id = this.user.UserInfoId;
              push_message.mom_id = this.taskmodal[0].mom_id;
              push_message.roi_comments_id = this.taskmodal[0].mom_action_point_id;
              push_message.payment_details = this.taskmodal[0].action_by_id;
              push_message.trans_type = 'MOM AUDIO';

              console.log(push_message);

              this.authService.postData(push_message, 'pushnotification/pushNotificationMomRecording').then((result) => {
                  console.log('Notification is sent', result);
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

    // if (this.audio_playing == 0) {
    //   this.audio_playing = 1;
    //   this.audio.play();
    // } else {
    //   this.audio_playing = 0;
    //   this.audio.pause();
    // }
    // this.audio.setVolume(0.8);

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


  deleteAudio(id: any, mom_id: any, mom_action_point_id: any) {

    this.presentLoadingDefault(true);
    let task_insert_data = {
      id: id,
      mom_id: mom_id,
      mom_action_point_id: mom_action_point_id,
      user_info_id: this.user.UserInfoId
    }

    this.authService.postData(task_insert_data, 'task/getDeleteMomAudio').then((result) => {
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
