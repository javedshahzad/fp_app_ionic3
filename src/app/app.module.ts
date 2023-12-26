import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { HTTP } from '@ionic-native/http';
import { Network } from '@ionic-native/network';
import { LocalNotifications } from "@ionic-native/local-notifications"; 
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ceoportal } from './app.component';
import { LoginPage } from '../pages/login/login';
import { AssetpreventivemaintancePage } from '../pages/assetpreventivemaintance/assetpreventivemaintance';
import { HomePage } from '../pages/home/home';
import { SearchPage } from '../pages/search/search';
import { InventoryPage } from '../pages/inventory/inventory';
import { ItemlistModelPage } from '../pages/itemlist-model/itemlist-model';
import { ReceiptPage } from '../pages/receipt/receipt';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { CasemanagementlablePage } from '../pages/casemanagementlable/casemanagementlable';
import { CallmanagementPage } from '../pages/callmanagement/callmanagement';
import { PaymentRequestListPage } from '../pages/paymentrequestlist/paymentrequestlist';
import { DrecPage } from '../pages/drec/drec';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestProvider } from '../providers/rest/rest';
import { TextImage } from '../directives/text-img/text-img';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { ChequePage } from '../pages/chequelist/cheque';
import { ChequeListLabelPage } from '../pages/chequelistlabel/chequelistlabel';
import { RentPage } from '../pages/rentrefund/rent';
import { HotoPage } from '../pages/hoto/hoto';
import { lpoPageModule } from '../pages/lpo/lpo';
import { MgresclatedPage } from '../pages/mgresclated/mgresclated';
import { CeoesclatedPage } from '../pages/ceoesclated/ceoesclated';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { PropertyManagementPage } from '../pages/propertymanagement/propertymanagement';
import { CustomerServicePage } from '../pages/customerserviceproperty/customerservice';
import { TaskManagementPage } from '../pages/taskmanagement/taskmanagement';
import { CreateTaskPage } from '../pages/createtask/createtask';
import { SelectSearchableModule } from'ionic-select-searchable';
import { SecurityDepositUnitPage } from '../pages/securitydeposit/securitydepositunit';
import { FilterPipe } from '../providers/util/filterpipe';
import { ReturnChequeListPage } from '../pages/returnchequelist/returnchequelist';
import { EsculationPage } from '../pages/esculation/esculation';
import { JobAssignmentListPage } from '../pages/jobassignment/jobassignment';
import { FinanceListPage } from '../pages/finance/finance';
import { CommentsPage } from '../pages/comments/comments';
import { CommentsToCommentsPage } from '../pages/commentstocomments/commentstocomments';
import { CommentsLabelsPage } from '../pages/commentslabels/commentslabels';
import { NotificationPage } from '../pages/notification/notification';
import { ChatPage } from '../pages/chat/chat';
import { PopoverChatPage } from '../pages/popover-chat/popover-chat';
import { Badge } from '@ionic-native/badge';
import { DailytaskcommentPage } from '../pages/dailytaskcomment/dailytaskcomment';
import { CalendarViewEditPage } from '../pages/calendarviewedit/calendarviewedit';


import { FCM } from '@ionic-native/fcm';
import { MyprofilePage } from '../pages/myprofile/myprofile';
import { FileOpener } from '@ionic-native/file-opener';
import { Constant } from '../providers/constant/constant';
import { IonicSelectableModule  } from 'ionic-selectable';
import { CallNumber } from '@ionic-native/call-number';
import { CalendarModule } from "ion2-calendar";
import { ThreeDeeTouch} from '@ionic-native/three-dee-touch';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { DatePipe } from '@angular/common';
import { MinutesOfMeetingPage } from '../pages/minutesofmeeting/minutesofmeeting';
import { NotesPage } from '../pages/notes/notes';

import { OpenWebsitePage } from '../pages/openwebsite/openwebsite';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ChatProvider } from '../providers/chat/chat';
import { Chooser } from '@ionic-native/chooser';

import { Media } from '@ionic-native/media';
import { Base64 } from "@ionic-native/base64";

import { SecurityDepositListPage } from '../pages/securitydepositlist/securitydepositlist';

import { RentalBalanceLabelPage } from '../pages/rentalbalancelabel/rentalbalancelabel';
import { RentalOverdueLabelPage } from '../pages/rentaloverduelabel/rentaloverduelabel';
import { FinancePaymentDetailPage } from '../pages/financepaymentrequestdetails/financepaymentrequestdetails';
import { DocumentTrackingLabelsPage } from '../pages/documenttrackinglabels/documenttrackinglabels';
 
import { ContractLabelsPage } from '../pages/contractlabels/contractlabels';

import { UtilityPage } from '../pages/utility/utility';

import { AttendancePage } from '../pages/attendance/attendance';

import { EsculationLabelPage } from '../pages/esculationlabel/esculationlabel';

import { MediaCapture} from '@ionic-native/media-capture';

import { IonicStorageModule } from '@ionic/storage';


import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { FinancePaymentRequestLabelPage } from '../pages/financepaymentrequestlabel/financepaymentrequestlabel';

import { MyMeetingsPage } from '../pages/mymeetings/mymeetings';

import { FinancePaymentCeoApprovalPage } from '../pages/financepaymentceoapproval/financepaymentceoapproval';
import { FinancePaymentMultipleApprovalPage } from '../pages/financepaymentmultipleapproval/financepaymentmultipleapproval';

import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { DrecLabelPage } from '../pages/dreclabel/dreclabel';
import { ParkingPage } from '../pages/parking/parking';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { LpoCeoApprovalPage } from '../pages/lpoceoapproval/lpoceoapproval';
import { Device } from '@ionic-native/device';

const config = {
  apiKey: "AIzaSyDvV9BU6trshxtKLNn3Tehfm9D0HrEwn0U",
  authDomain: "fp-app-8afb9.firebaseapp.com",
  databaseURL: "https://fp-app-8afb9.firebaseio.com",
  projectId: "fp-app-8afb9",
  storageBucket: "fp-app-8afb9.appspot.com",
  messagingSenderId: "349794714049",
  appId: "1:349794714049:web:e41aefa76bf21ca3e9af40",
  measurementId: "G-N20CPMR2ZS" 
}

@NgModule({
  declarations: [
    ceoportal,
    FilterPipe,
    TextImage,
    LoginPage,
    AssetpreventivemaintancePage,
    HomePage,
    SearchPage,
    InventoryPage,
    ItemlistModelPage,
    ReceiptPage,
    DashboardPage,
    CasemanagementlablePage,
    CallmanagementPage,
    PaymentRequestListPage,
    DrecPage,
    ReturnChequeListPage,
    ChequeListLabelPage,
    RentPage,
    HotoPage,
    PropertyManagementPage,
    CustomerServicePage,
    TaskManagementPage,
    CreateTaskPage,
    SecurityDepositUnitPage,
    EsculationPage,
    JobAssignmentListPage,
    FinanceListPage,
    CommentsPage,
    NotificationPage,
    MyprofilePage,
    ChequePage,
    CommentsToCommentsPage,
    CommentsLabelsPage,
    lpoPageModule,
    MgresclatedPage,
    CeoesclatedPage,
    PopoverChatPage,
    DailytaskcommentPage,
    MinutesOfMeetingPage,
    NotesPage,
    CalendarViewEditPage,
    OpenWebsitePage,
    SecurityDepositListPage,
    RentalBalanceLabelPage,
    RentalOverdueLabelPage,
    DocumentTrackingLabelsPage,
    ContractLabelsPage,
    UtilityPage,
    AttendancePage,
    EsculationLabelPage,
    FinancePaymentRequestLabelPage,
    FinancePaymentDetailPage,
    MyMeetingsPage,
    FinancePaymentCeoApprovalPage,
    FinancePaymentMultipleApprovalPage,
    DrecLabelPage,
    ParkingPage,
    ChatPage,
    LpoCeoApprovalPage
    ],
  imports: [   
    FormsModule, 
    BrowserModule,HttpClientModule,
    IonicModule.forRoot(ceoportal),
    BrowserAnimationsModule,
    SelectSearchableModule,
    IonicSelectableModule,
    CalendarModule,
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularCropperjsModule,
    IonicStorageModule.forRoot()

  ],
  exports: [TextImage],
  bootstrap: [IonicApp],
  entryComponents: [
    ceoportal,
    HomePage,
    LoginPage,
    AssetpreventivemaintancePage,
    SearchPage,
    InventoryPage,
    ItemlistModelPage,
    ReceiptPage,
    DashboardPage,
    CasemanagementlablePage,
    CallmanagementPage,
    PaymentRequestListPage,
    DrecPage,
    ReturnChequeListPage,
    ChequeListLabelPage,
    RentPage,
    HotoPage,
    PropertyManagementPage,
    CustomerServicePage,
    TaskManagementPage,
    CreateTaskPage,
    SecurityDepositUnitPage,
    EsculationPage,
    JobAssignmentListPage,
    FinanceListPage,
    CommentsPage,
    NotificationPage,
    MyprofilePage,
    ChequePage,
    CommentsToCommentsPage,
    CommentsLabelsPage,
    lpoPageModule,
    MgresclatedPage,
    CeoesclatedPage,
    PopoverChatPage,
    DailytaskcommentPage,
    MinutesOfMeetingPage,
    NotesPage,
    CalendarViewEditPage,
    OpenWebsitePage,
    SecurityDepositListPage,
    RentalBalanceLabelPage,
    RentalOverdueLabelPage,
    DocumentTrackingLabelsPage,
    ContractLabelsPage,
    UtilityPage,
    AttendancePage,
    EsculationLabelPage,
    FinancePaymentRequestLabelPage,
    FinancePaymentDetailPage,
    MyMeetingsPage,
    FinancePaymentCeoApprovalPage,
    FinancePaymentMultipleApprovalPage,
    DrecLabelPage,
    ParkingPage,
    ChatPage,
    LpoCeoApprovalPage
    ],
  providers: [
    LocalNotifications,
    StatusBar,
    SplashScreen,
    HTTP,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FileTransfer,
    FileTransferObject,
    File,
    FileOpener,
    Camera,
    RestProvider,
    FCM,
    Constant,
    CallNumber,
    ThreeDeeTouch,
    Badge,
    DatePipe,
    InAppBrowser,
    Chooser,
    ChatProvider,
    Media,
    Base64,
    MediaCapture,
    StreamingMedia,
    Geolocation,
    NativeGeocoder,
    BarcodeScanner,
    Device
  ]
})

export class AppModule {
  user = {} as any;
}
