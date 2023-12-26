import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, MenuController, Events, AlertController, LoadingController, Platform, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Network } from '@ionic-native/network';
import { DashboardPage } from '../dashboard/dashboard';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ChatPage } from '../chat/chat';
import { AngularFireDatabase } from 'angularfire2/database';
import { Badge } from '@ionic-native/badge';
import { DailytaskcommentPage } from '../dailytaskcomment/dailytaskcomment';
import * as EmailValidator from 'email-validator';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { OpenWebsitePage } from '../openwebsite/openwebsite';
import { MyMeetingsPage } from '../mymeetings/mymeetings';
import { Lpomodelcomments } from '../lpo-model/lpo-model';
import { Device } from '@ionic-native/device';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})


export class LoginPage {

    @ViewChild('myselect') selectComponent: SelectSearchableComponent;

    branchListdetails: any;
    clickSub: any;
    public user: any;
    btnLogIn = false as boolean;
    insertedValues: any;
    pushnotificationValues: any;
    rememberMeChecked = false as boolean;
    LogIn = 'LogIn';
    signIn = 'Sign In';
    signUp = 'Sign Up';
    userData = { "user_name": "", "user_password": "" };
    fcmtoken: any = localStorage.getItem('token');
    tasksearchlist: any;
    myModalData: any;
    groupmessagesAll: any;
    TYPE: any;
    user_list = [];
    userSearch = [];
    showlogin = 0;
    userSignUpData = { "firstname": "", "lastname": "", "emailId": "", "countrycode": "", "mobile_no": "", "signup_password": "", "confirm_password": "" };
    emailerrormsg = '';
    passworderrormsg = '';
    fnerrormsg = '';
    lnerrormsg = '';
    cnfpassworderrormsg = ''
    gaming = '';
    passwordType: string = 'password';
    passwordIcon: string = 'eye-off';

    deviceID = '';
    fcmTokenList: any;

    countries = [{
        name: "United States",
        dial_code: "+1",
        code: "US"
    }, {
        name: "Israel",
        dial_code: "+972",
        code: "IL"
    }, {
        name: "Afghanistan",
        dial_code: "+93",
        code: "AF"
    }, {
        name: "Albania",
        dial_code: "+355",
        code: "AL"
    }, {
        name: "Algeria",
        dial_code: "+213",
        code: "DZ"
    }, {
        name: "AmericanSamoa",
        dial_code: "+1 684",
        code: "AS"
    }, {
        name: "Andorra",
        dial_code: "+376",
        code: "AD"
    }, {
        name: "Angola",
        dial_code: "+244",
        code: "AO"
    }, {
        name: "Anguilla",
        dial_code: "+1 264",
        code: "AI"
    }, {
        name: "Antigua and Barbuda",
        dial_code: "+1268",
        code: "AG"
    }, {
        name: "Argentina",
        dial_code: "+54",
        code: "AR"
    }, {
        name: "Armenia",
        dial_code: "+374",
        code: "AM"
    }, {
        name: "Aruba",
        dial_code: "+297",
        code: "AW"
    }, {
        name: "Australia",
        dial_code: "+61",
        code: "AU"
    }, {
        name: "Austria",
        dial_code: "+43",
        code: "AT"
    }, {
        name: "Azerbaijan",
        dial_code: "+994",
        code: "AZ"
    }, {
        name: "Bahamas",
        dial_code: "+1 242",
        code: "BS"
    }, {
        name: "Bahrain",
        dial_code: "+973",
        code: "BH"
    }, {
        name: "Bangladesh",
        dial_code: "+880",
        code: "BD"
    }, {
        name: "Barbados",
        dial_code: "+1 246",
        code: "BB"
    }, {
        name: "Belarus",
        dial_code: "+375",
        code: "BY"
    }, {
        name: "Belgium",
        dial_code: "+32",
        code: "BE"
    }, {
        name: "Belize",
        dial_code: "+501",
        code: "BZ"
    }, {
        name: "Benin",
        dial_code: "+229",
        code: "BJ"
    }, {
        name: "Bermuda",
        dial_code: "+1 441",
        code: "BM"
    }, {
        name: "Bhutan",
        dial_code: "+975",
        code: "BT"
    }, {
        name: "Bosnia and Herzegovina",
        dial_code: "+387",
        code: "BA"
    }, {
        name: "Botswana",
        dial_code: "+267",
        code: "BW"
    }, {
        name: "Brazil",
        dial_code: "+55",
        code: "BR"
    }, {
        name: "British Indian Ocean Territory",
        dial_code: "+246",
        code: "IO"
    }, {
        name: "Bulgaria",
        dial_code: "+359",
        code: "BG"
    }, {
        name: "Burkina Faso",
        dial_code: "+226",
        code: "BF"
    }, {
        name: "Burundi",
        dial_code: "+257",
        code: "BI"
    }, {
        name: "Cambodia",
        dial_code: "+855",
        code: "KH"
    }, {
        name: "Cameroon",
        dial_code: "+237",
        code: "CM"
    }, {
        name: "Canada",
        dial_code: "+1",
        code: "CA"
    }, {
        name: "Cape Verde",
        dial_code: "+238",
        code: "CV"
    }, {
        name: "Cayman Islands",
        dial_code: "+ 345",
        code: "KY"
    }, {
        name: "Central African Republic",
        dial_code: "+236",
        code: "CF"
    }, {
        name: "Chad",
        dial_code: "+235",
        code: "TD"
    }, {
        name: "Chile",
        dial_code: "+56",
        code: "CL"
    }, {
        name: "China",
        dial_code: "+86",
        code: "CN"
    }, {
        name: "Christmas Island",
        dial_code: "+61",
        code: "CX"
    }, {
        name: "Colombia",
        dial_code: "+57",
        code: "CO"
    }, {
        name: "Comoros",
        dial_code: "+269",
        code: "KM"
    }, {
        name: "Congo",
        dial_code: "+242",
        code: "CG"
    }, {
        name: "Cook Islands",
        dial_code: "+682",
        code: "CK"
    }, {
        name: "Costa Rica",
        dial_code: "+506",
        code: "CR"
    }, {
        name: "Croatia",
        dial_code: "+385",
        code: "HR"
    }, {
        name: "Cuba",
        dial_code: "+53",
        code: "CU"
    }, {
        name: "Cyprus",
        dial_code: "+537",
        code: "CY"
    }, {
        name: "Czech Republic",
        dial_code: "+420",
        code: "CZ"
    }, {
        name: "Denmark",
        dial_code: "+45",
        code: "DK"
    }, {
        name: "Djibouti",
        dial_code: "+253",
        code: "DJ"
    }, {
        name: "Dominica",
        dial_code: "+1 767",
        code: "DM"
    }, {
        name: "Dominican Republic",
        dial_code: "+1 849",
        code: "DO"
    }, {
        name: "Ecuador",
        dial_code: "+593",
        code: "EC"
    }, {
        name: "Egypt",
        dial_code: "+20",
        code: "EG"
    }, {
        name: "El Salvador",
        dial_code: "+503",
        code: "SV"
    }, {
        name: "Equatorial Guinea",
        dial_code: "+240",
        code: "GQ"
    }, {
        name: "Eritrea",
        dial_code: "+291",
        code: "ER"
    }, {
        name: "Estonia",
        dial_code: "+372",
        code: "EE"
    }, {
        name: "Ethiopia",
        dial_code: "+251",
        code: "ET"
    }, {
        name: "Faroe Islands",
        dial_code: "+298",
        code: "FO"
    }, {
        name: "Fiji",
        dial_code: "+679",
        code: "FJ"
    }, {
        name: "Finland",
        dial_code: "+358",
        code: "FI"
    }, {
        name: "France",
        dial_code: "+33",
        code: "FR"
    }, {
        name: "French Guiana",
        dial_code: "+594",
        code: "GF"
    }, {
        name: "French Polynesia",
        dial_code: "+689",
        code: "PF"
    }, {
        name: "Gabon",
        dial_code: "+241",
        code: "GA"
    }, {
        name: "Gambia",
        dial_code: "+220",
        code: "GM"
    }, {
        name: "Georgia",
        dial_code: "+995",
        code: "GE"
    }, {
        name: "Germany",
        dial_code: "+49",
        code: "DE"
    }, {
        name: "Ghana",
        dial_code: "+233",
        code: "GH"
    }, {
        name: "Gibraltar",
        dial_code: "+350",
        code: "GI"
    }, {
        name: "Greece",
        dial_code: "+30",
        code: "GR"
    }, {
        name: "Greenland",
        dial_code: "+299",
        code: "GL"
    }, {
        name: "Grenada",
        dial_code: "+1 473",
        code: "GD"
    }, {
        name: "Guadeloupe",
        dial_code: "+590",
        code: "GP"
    }, {
        name: "Guam",
        dial_code: "+1 671",
        code: "GU"
    }, {
        name: "Guatemala",
        dial_code: "+502",
        code: "GT"
    }, {
        name: "Guinea",
        dial_code: "+224",
        code: "GN"
    }, {
        name: "Guinea-Bissau",
        dial_code: "+245",
        code: "GW"
    }, {
        name: "Guyana",
        dial_code: "+595",
        code: "GY"
    }, {
        name: "Haiti",
        dial_code: "+509",
        code: "HT"
    }, {
        name: "Honduras",
        dial_code: "+504",
        code: "HN"
    }, {
        name: "Hungary",
        dial_code: "+36",
        code: "HU"
    }, {
        name: "Iceland",
        dial_code: "+354",
        code: "IS"
    }, {
        name: "India",
        dial_code: "+91",
        code: "IN"
    }, {
        name: "Indonesia",
        dial_code: "+62",
        code: "ID"
    }, {
        name: "Iraq",
        dial_code: "+964",
        code: "IQ"
    }, {
        name: "Ireland",
        dial_code: "+353",
        code: "IE"
    }, {
        name: "Israel",
        dial_code: "+972",
        code: "IL"
    }, {
        name: "Italy",
        dial_code: "+39",
        code: "IT"
    }, {
        name: "Jamaica",
        dial_code: "+1 876",
        code: "JM"
    }, {
        name: "Japan",
        dial_code: "+81",
        code: "JP"
    }, {
        name: "Jordan",
        dial_code: "+962",
        code: "JO"
    }, {
        name: "Kazakhstan",
        dial_code: "+7 7",
        code: "KZ"
    }, {
        name: "Kenya",
        dial_code: "+254",
        code: "KE"
    }, {
        name: "Kiribati",
        dial_code: "+686",
        code: "KI"
    }, {
        name: "Kuwait",
        dial_code: "+965",
        code: "KW"
    }, {
        name: "Kyrgyzstan",
        dial_code: "+996",
        code: "KG"
    }, {
        name: "Latvia",
        dial_code: "+371",
        code: "LV"
    }, {
        name: "Lebanon",
        dial_code: "+961",
        code: "LB"
    }, {
        name: "Lesotho",
        dial_code: "+266",
        code: "LS"
    }, {
        name: "Liberia",
        dial_code: "+231",
        code: "LR"
    }, {
        name: "Liechtenstein",
        dial_code: "+423",
        code: "LI"
    }, {
        name: "Lithuania",
        dial_code: "+370",
        code: "LT"
    }, {
        name: "Luxembourg",
        dial_code: "+352",
        code: "LU"
    }, {
        name: "Madagascar",
        dial_code: "+261",
        code: "MG"
    }, {
        name: "Malawi",
        dial_code: "+265",
        code: "MW"
    }, {
        name: "Malaysia",
        dial_code: "+60",
        code: "MY"
    }, {
        name: "Maldives",
        dial_code: "+960",
        code: "MV"
    }, {
        name: "Mali",
        dial_code: "+223",
        code: "ML"
    }, {
        name: "Malta",
        dial_code: "+356",
        code: "MT"
    }, {
        name: "Marshall Islands",
        dial_code: "+692",
        code: "MH"
    }, {
        name: "Martinique",
        dial_code: "+596",
        code: "MQ"
    }, {
        name: "Mauritania",
        dial_code: "+222",
        code: "MR"
    }, {
        name: "Mauritius",
        dial_code: "+230",
        code: "MU"
    }, {
        name: "Mayotte",
        dial_code: "+262",
        code: "YT"
    }, {
        name: "Mexico",
        dial_code: "+52",
        code: "MX"
    }, {
        name: "Monaco",
        dial_code: "+377",
        code: "MC"
    }, {
        name: "Mongolia",
        dial_code: "+976",
        code: "MN"
    }, {
        name: "Montenegro",
        dial_code: "+382",
        code: "ME"
    }, {
        name: "Montserrat",
        dial_code: "+1664",
        code: "MS"
    }, {
        name: "Morocco",
        dial_code: "+212",
        code: "MA"
    }, {
        name: "Myanmar",
        dial_code: "+95",
        code: "MM"
    }, {
        name: "Namibia",
        dial_code: "+264",
        code: "NA"
    }, {
        name: "Nauru",
        dial_code: "+674",
        code: "NR"
    }, {
        name: "Nepal",
        dial_code: "+977",
        code: "NP"
    }, {
        name: "Netherlands",
        dial_code: "+31",
        code: "NL"
    }, {
        name: "Netherlands Antilles",
        dial_code: "+599",
        code: "AN"
    }, {
        name: "New Caledonia",
        dial_code: "+687",
        code: "NC"
    }, {
        name: "New Zealand",
        dial_code: "+64",
        code: "NZ"
    }, {
        name: "Nicaragua",
        dial_code: "+505",
        code: "NI"
    }, {
        name: "Niger",
        dial_code: "+227",
        code: "NE"
    }, {
        name: "Nigeria",
        dial_code: "+234",
        code: "NG"
    }, {
        name: "Niue",
        dial_code: "+683",
        code: "NU"
    }, {
        name: "Norfolk Island",
        dial_code: "+672",
        code: "NF"
    }, {
        name: "Northern Mariana Islands",
        dial_code: "+1 670",
        code: "MP"
    }, {
        name: "Norway",
        dial_code: "+47",
        code: "NO"
    }, {
        name: "Oman",
        dial_code: "+968",
        code: "OM"
    }, {
        name: "Pakistan",
        dial_code: "+92",
        code: "PK"
    }, {
        name: "Palau",
        dial_code: "+680",
        code: "PW"
    }, {
        name: "Panama",
        dial_code: "+507",
        code: "PA"
    }, {
        name: "Papua New Guinea",
        dial_code: "+675",
        code: "PG"
    }, {
        name: "Paraguay",
        dial_code: "+595",
        code: "PY"
    }, {
        name: "Peru",
        dial_code: "+51",
        code: "PE"
    }, {
        name: "Philippines",
        dial_code: "+63",
        code: "PH"
    }, {
        name: "Poland",
        dial_code: "+48",
        code: "PL"
    }, {
        name: "Portugal",
        dial_code: "+351",
        code: "PT"
    }, {
        name: "Puerto Rico",
        dial_code: "+1 939",
        code: "PR"
    }, {
        name: "Qatar",
        dial_code: "+974",
        code: "QA"
    }, {
        name: "Romania",
        dial_code: "+40",
        code: "RO"
    }, {
        name: "Rwanda",
        dial_code: "+250",
        code: "RW"
    }, {
        name: "Samoa",
        dial_code: "+685",
        code: "WS"
    }, {
        name: "San Marino",
        dial_code: "+378",
        code: "SM"
    }, {
        name: "Saudi Arabia",
        dial_code: "+966",
        code: "SA"
    }, {
        name: "Senegal",
        dial_code: "+221",
        code: "SN"
    }, {
        name: "Serbia",
        dial_code: "+381",
        code: "RS"
    }, {
        name: "Seychelles",
        dial_code: "+248",
        code: "SC"
    }, {
        name: "Sierra Leone",
        dial_code: "+232",
        code: "SL"
    }, {
        name: "Singapore",
        dial_code: "+65",
        code: "SG"
    }, {
        name: "Slovakia",
        dial_code: "+421",
        code: "SK"
    }, {
        name: "Slovenia",
        dial_code: "+386",
        code: "SI"
    }, {
        name: "Solomon Islands",
        dial_code: "+677",
        code: "SB"
    }, {
        name: "South Africa",
        dial_code: "+27",
        code: "ZA"
    }, {
        name: "South Georgia and the South Sandwich Islands",
        dial_code: "+500",
        code: "GS"
    }, {
        name: "Spain",
        dial_code: "+34",
        code: "ES"
    }, {
        name: "Sri Lanka",
        dial_code: "+94",
        code: "LK"
    }, {
        name: "Sudan",
        dial_code: "+249",
        code: "SD"
    }, {
        name: "Suriname",
        dial_code: "+597",
        code: "SR"
    }, {
        name: "Swaziland",
        dial_code: "+268",
        code: "SZ"
    }, {
        name: "Sweden",
        dial_code: "+46",
        code: "SE"
    }, {
        name: "Switzerland",
        dial_code: "+41",
        code: "CH"
    }, {
        name: "Tajikistan",
        dial_code: "+992",
        code: "TJ"
    }, {
        name: "Thailand",
        dial_code: "+66",
        code: "TH"
    }, {
        name: "Togo",
        dial_code: "+228",
        code: "TG"
    }, {
        name: "Tokelau",
        dial_code: "+690",
        code: "TK"
    }, {
        name: "Tonga",
        dial_code: "+676",
        code: "TO"
    }, {
        name: "Trinidad and Tobago",
        dial_code: "+1 868",
        code: "TT"
    }, {
        name: "Tunisia",
        dial_code: "+216",
        code: "TN"
    }, {
        name: "Turkey",
        dial_code: "+90",
        code: "TR"
    }, {
        name: "Turkmenistan",
        dial_code: "+993",
        code: "TM"
    }, {
        name: "Turks and Caicos Islands",
        dial_code: "+1 649",
        code: "TC"
    }, {
        name: "Tuvalu",
        dial_code: "+688",
        code: "TV"
    }, {
        name: "Uganda",
        dial_code: "+256",
        code: "UG"
    }, {
        name: "Ukraine",
        dial_code: "+380",
        code: "UA"
    }, {
        name: "United Arab Emirates",
        dial_code: "+971",
        code: "AE"
    }, {
        name: "United Kingdom",
        dial_code: "+44",
        code: "GB"
    }, {
        name: "Uruguay",
        dial_code: "+598",
        code: "UY"
    }, {
        name: "Uzbekistan",
        dial_code: "+998",
        code: "UZ"
    }, {
        name: "Vanuatu",
        dial_code: "+678",
        code: "VU"
    }, {
        name: "Wallis and Futuna",
        dial_code: "+681",
        code: "WF"
    }, {
        name: "Yemen",
        dial_code: "+967",
        code: "YE"
    }, {
        name: "Zambia",
        dial_code: "+260",
        code: "ZM"
    }, {
        name: "Zimbabwe",
        dial_code: "+263",
        code: "ZW"
    }, {
        name: "land Islands",
        dial_code: "",
        code: "AX"
    }, {
        name: "Antarctica",
        dial_code: null,
        code: "AQ"
    }, {
        name: "Bolivia, Plurinational State of",
        dial_code: "+591",
        code: "BO"
    }, {
        name: "Brunei Darussalam",
        dial_code: "+673",
        code: "BN"
    }, {
        name: "Cocos (Keeling) Islands",
        dial_code: "+61",
        code: "CC"
    }, {
        name: "Congo, The Democratic Republic of the",
        dial_code: "+243",
        code: "CD"
    }, {
        name: "Cote d'Ivoire",
        dial_code: "+225",
        code: "CI"
    }, {
        name: "Falkland Islands (Malvinas)",
        dial_code: "+500",
        code: "FK"
    }, {
        name: "Guernsey",
        dial_code: "+44",
        code: "GG"
    }, {
        name: "Holy See (Vatican City State)",
        dial_code: "+379",
        code: "VA"
    }, {
        name: "Hong Kong",
        dial_code: "+852",
        code: "HK"
    }, {
        name: "Iran, Islamic Republic of",
        dial_code: "+98",
        code: "IR"
    }, {
        name: "Isle of Man",
        dial_code: "+44",
        code: "IM"
    }, {
        name: "Jersey",
        dial_code: "+44",
        code: "JE"
    }, {
        name: "Korea, Democratic People's Republic of",
        dial_code: "+850",
        code: "KP"
    }, {
        name: "Korea, Republic of",
        dial_code: "+82",
        code: "KR"
    }, {
        name: "Lao People's Democratic Republic",
        dial_code: "+856",
        code: "LA"
    }, {
        name: "Libyan Arab Jamahiriya",
        dial_code: "+218",
        code: "LY"
    }, {
        name: "Macao",
        dial_code: "+853",
        code: "MO"
    }, {
        name: "Macedonia, The Former Yugoslav Republic of",
        dial_code: "+389",
        code: "MK"
    }, {
        name: "Micronesia, Federated States of",
        dial_code: "+691",
        code: "FM"
    }, {
        name: "Moldova, Republic of",
        dial_code: "+373",
        code: "MD"
    }, {
        name: "Mozambique",
        dial_code: "+258",
        code: "MZ"
    }, {
        name: "Palestinian Territory, Occupied",
        dial_code: "+970",
        code: "PS"
    }, {
        name: "Pitcairn",
        dial_code: "+872",
        code: "PN"
    }, {
        name: "Réunion",
        dial_code: "+262",
        code: "RE"
    }, {
        name: "Russia",
        dial_code: "+7",
        code: "RU"
    }, {
        name: "Saint Barthélemy",
        dial_code: "+590",
        code: "BL"
    }, {
        name: "Saint Helena, Ascension and Tristan Da Cunha",
        dial_code: "+290",
        code: "SH"
    }, {
        name: "Saint Kitts and Nevis",
        dial_code: "+1 869",
        code: "KN"
    }, {
        name: "Saint Lucia",
        dial_code: "+1 758",
        code: "LC"
    }, {
        name: "Saint Martin",
        dial_code: "+590",
        code: "MF"
    }, {
        name: "Saint Pierre and Miquelon",
        dial_code: "+508",
        code: "PM"
    }, {
        name: "Saint Vincent and the Grenadines",
        dial_code: "+1 784",
        code: "VC"
    }, {
        name: "Sao Tome and Principe",
        dial_code: "+239",
        code: "ST"
    }, {
        name: "Somalia",
        dial_code: "+252",
        code: "SO"
    }, {
        name: "Svalbard and Jan Mayen",
        dial_code: "+47",
        code: "SJ"
    }, {
        name: "Syrian Arab Republic",
        dial_code: "+963",
        code: "SY"
    }, {
        name: "Taiwan, Province of China",
        dial_code: "+886",
        code: "TW"
    }, {
        name: "Tanzania, United Republic of",
        dial_code: "+255",
        code: "TZ"
    }, {
        name: "Timor-Leste",
        dial_code: "+670",
        code: "TL"
    }, {
        name: "Venezuela, Bolivarian Republic of",
        dial_code: "+58",
        code: "VE"
    }, {
        name: "Viet Nam",
        dial_code: "+84",
        code: "VN"
    }, {
        name: "Virgin Islands, British",
        dial_code: "+1 284",
        code: "VG"
    }, {
        name: "Virgin Islands, U.S.",
        dial_code: "+1 340",
        code: "VI"
    }]


    constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
        public events: Events, public network: Network, public authService: RestProvider,
        public loadingCtrl: LoadingController, public menu: MenuController,
        public toastCtrl: ToastController, public alertCtrl: AlertController, private fcm: FCM,
        public localNotifications: LocalNotifications, private db: AngularFireDatabase, public badge: Badge,
        private modal: ModalController, private device: Device

    ) {

        let offline = Observable.fromEvent(document, "offline");
        let online = Observable.fromEvent(document, "online");
        menu.enable(false);

        offline.subscribe(() => {
            this.presentToast("You are offline!");
        });

        online.subscribe(() => {
            this.presentToast("You are online!");
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

    updateRememberMe() {
        if (this.rememberMeChecked == true) {
            this.rememberMeChecked = false;
        } else {
            this.rememberMeChecked = true;
        }
    }

    login() {
        let time_bf = new Date();
        localStorage.removeItem('Chat');
        if (this.userData.user_name) {
            if (this.userData.user_password) {
                this.btnLogIn = true;
                this.LogIn = 'Logging ...';
                this.signIn = 'Signing In';
                this.authService.loginPostData(this.userData, 'account/login').then((result) => {

                    this.user = result || null;
                    let time_af = new Date();
                    let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);

                    console.log('Login Seconds:', seconds);
                    console.log('Device UUID is: ' + this.device.uuid);

                    if ((this.user.UserInfoId != undefined || this.user.UserInfoId != null) && this.user.UserInfoId > 0) {

                        if (this.user.IsActive) {
                            this.menu.enable(true);

                            localStorage.setItem('userData', JSON.stringify(this.user));
                            localStorage.setItem('resourseData', JSON.stringify(this.user.resourseData));
                            console.log(this.user.resourseData);
                            console.log("userDataaaaaaaaaaa", this.user);

                            if (this.rememberMeChecked) {

                                const val = {
                                    name: this.userData.user_name,
                                    value: 'wefghm345bfdrtgvdfkv65uggvhhwfgwf345stchsdcv',
                                }

                                localStorage.setItem('RememberMe', JSON.stringify(val));

                            } else {
                                localStorage.removeItem('RememberMe');
                            }

                            if (this.platform.is('ios')) {
                                this.TokenSetup();
                            }

                            if (this.platform.is('android')) {
                                this.TokenSetup();
                            }

                            if (this.platform.is('ios') == true || this.platform.is('android') == true) {

                                if (this.user.UserInfoId != 2) {

                                    let params = {
                                        UserInfoId: this.user.UserInfoId,
                                        uuid: this.device.uuid
                                    };

                                    if (this.user.resourseData.UUID != null && this.user.resourseData.UUID != this.device.uuid) {
                                        this.btnLogIn = false;
                                        this.LogIn = 'LogIn';
                                        this.signIn = 'Sign In';
                                        this.user.Surname = this.userData.user_name;
                                        this.presentToast("The user " + this.user.Surname + " is logged in with other device.");
                                        return;
                                    }

                                    if (this.user.resourseData.UUID == null) {
                                        this.authService.postData(params, 'account/getUpdateUserUuid').then((result) => {
                                            console.log('UUID is updated');
                                        });
                                    }

                                }

                            }

                            if (this.user.resourseData.IS_MOBILE_LOGIN > 0) {
                                this.navCtrl.push(OpenWebsitePage, {}, { animate: true, direction: 'forward' });
                            } else {
                                localStorage.setItem("isLogin", "true");
                                
                                // this.getPendingApproval(this.user.UserInfoId, this.user.resourseData.TYPE_USER);
                                this.navCtrl.push(DashboardPage, "true", { animate: true, direction: 'forward' });
                            }

                            this.events.publish('userloggedin');
                            this.btnLogIn = false;
                            this.LogIn = 'LogIn';
                            this.signIn = 'Sign In';

                        } else {
                            this.btnLogIn = false;
                            this.LogIn = 'LogIn';
                            this.signIn = 'Sign In';
                            this.user.Surname = this.userData.user_name;
                            this.presentToast("User " + this.userData.user_name + " is not in active.");
                            return;
                        }

                    } else {
                        this.btnLogIn = false;
                        this.LogIn = 'LogIn';
                        this.signIn = 'Sign In';
                        this.user.Surname = this.userData.user_name;
                        this.presentToast("Enter valid credential");
                        return;

                    }


                }, (err) => {
                    this.btnLogIn = false;
                    this.LogIn = 'LogIn';
                    this.signIn = 'Sign In';
                    this.presentToast(err);
                });
            }
            else {
                this.presentToast("Enter the password");
            }
        }
        else {
            this.presentToast("Enter the user name");
        }
    }

    TokenSetup() {

        let time_bf = new Date();

        this.fcm.getToken().then((token) => {

            localStorage.setItem('token', token);
            this.deviceID = token;

            if (this.user.UserInfoId == 2) {

                var app_platform: string = '';
                if (this.platform.is('ios')) {
                    app_platform = 'ios';
                }

                if (this.platform.is('android')) {
                    app_platform = 'android';
                }

                const fcmval = {
                    user_id: this.user.UserInfoId,
                    username: this.userData.user_name,
                    fcmtoken: token
                }

                localStorage.setItem('fcmtoken', JSON.stringify(fcmval));

                let fcmdata = {} as any;
                fcmdata.user_id = this.user.UserInfoId;
                fcmdata.user_name = this.user.Surname;
                fcmdata.app_type = null;
                fcmdata.fcm_token = token;
                fcmdata.app_platform = app_platform;
                fcmdata.status = 'Online';
                this.presentLoadingDefault(true);

                this.authService.postData(fcmdata, 'account/fcmtokeninsertupdate').then((result) => {
                    this.presentLoadingDefault(false);
                    this.insertedValues = result;

                    let time_af = new Date();
                    let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
                    console.log('Fcm Token Insert Seconds:', seconds);
                    
                }, (err) => {
                    this.presentLoadingDefault(false);
                    this.presentToast(err);
                });

            } else {

                var app_platform: string = '';
                if (this.platform.is('ios')) {
                    app_platform = 'ios';
                }

                if (this.platform.is('android')) {
                    app_platform = 'android';
                }

                const fcmval = {
                    user_id: this.user.UserInfoId,
                    username: this.userData.user_name,
                    fcmtoken: token
                }

                localStorage.setItem('fcmtoken', JSON.stringify(fcmval));

                let fcmdata = {} as any;
                fcmdata.user_id = this.user.UserInfoId;
                fcmdata.user_name = this.user.Surname;
                fcmdata.app_type = null;
                fcmdata.fcm_token = token;
                fcmdata.app_platform = app_platform;
                fcmdata.status = 'Online';
                this.presentLoadingDefault(true);

                this.authService.postData(fcmdata, 'account/fcmtokeninsertupdate').then((result) => {
                    this.presentLoadingDefault(false);
                    this.insertedValues = result;
                }, (err) => {
                    this.presentLoadingDefault(false);
                    this.presentToast(err);
                });
            }

        }, (err) => {
            console.log(JSON.stringify(err));
        });

        this.fcm.onNotification().subscribe((data) => {
            console.log('Notification received login.js ....');

            if (data.wasTapped) {

                console.log("Received in background, Login");

                if (data.trans_type == "TMS") {
                    if (this.user.UserInfoId > 0) {
                        this.SearchTaskDetail(data.seq_text);
                    }
                }

                if (data.trans_type == "CHAT" || data.trans_type == "GROUP_CHAT" || data.trans_type == "ROI_GROUP_CHAT") {
                    if (this.user.UserInfoId > 0) {
                        this.openUserChat(data.chat_user_id, data.trans_type, data.group_name, data.roi_comments_id);
                    }
                }

                if (data.trans_type == "Current" || data.trans_type == "Next") {
                    if (this.user.UserInfoId > 0) {
                        this.openRoiPage(data.trans_type);
                    }
                }

                if (data.trans_type == "Mom") {
                    if (this.user.UserInfoId > 0) {
                        this.openMomPage(data.trans_type);
                    }
                }

                if (data.trans_type == "LPO AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openLPOModal(data.roi_comments_id);
                    }
                }

                if (data.trans_type == "PR AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openFinancePaymentCommentModal(data.roi_comments_id);
                    }
                }

                if (data.trans_type == "CALL AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openCallCommentsModal(data.roi_comments_id, data.requster_name);
                    }
                }

                if (data.trans_type == "LPR AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openLegalPaymentRequestCommentModal(data.roi_comments_id, data.payment_details);
                    }
                }

                if (data.trans_type == "CHEQUE AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openChequeListCommentModal(data.roi_comments_id, data.payment_details);
                    }
                }

                if (data.trans_type == "RETURN CHEQUE AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openReturnChequeListCommentModal(data.roi_comments_id, data.payment_details);
                    }
                }

                if (data.trans_type == "CASE AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openCaseCommentModal(data.roi_comments_id, data.payment_details);
                    }
                }

                if (data.trans_type == 'SECURITY DEPOSIT AUDIO') {
                    if (this.user.UserInfoId > 0) {
                        this.openSecurityDepositCommentModal(data.roi_comments_id);
                    }
                }


                if (data.trans_type == 'DREC AUDIO') {
                    if (this.user.UserInfoId > 0) {
                        this.openDrecCommentModal(data.roi_comments_id, data.payment_details);
                    }
                }


            } else {

                if (data.trans_type == "CHAT" || data.trans_type == "GROUP_CHAT" || data.trans_type == "ROI_GROUP_CHAT") {
                    let chat = localStorage.getItem('Chat');
                    console.log(chat);
                    if (chat == null || chat == undefined) {
                        this.presentToastForChat(data.body, data);
                    }
                } else if (data.trans_type == "Current" || data.trans_type == "Next") {
                    this.presentToastForRoi(data.body, data);
                } else if (data.trans_type == "Mom") {
                    this.presentToastForMom(data.body, data)
                } else if (data.trans_type == "LPO AUDIO") {
                    this.presentToastForAudioComment(data.body, data);
                } else if (data.trans_type == "PR AUDIO") {
                    this.presentToastForFinancePaymentComment(data.body, data);
                } else if (data.trans_type == "CALL AUDIO") {
                    this.presentToastForCallComment(data.body, data);
                } else if (data.trans_type == "LPR AUDIO") {
                    this.presentToastForLegalPaymentReqComment(data.body, data);
                } else if (data.trans_type == "CHEQUE AUDIO") {
                    this.presentToastForChequeListComment(data.body, data);
                } else if (data.trans_type == "RETURN CHEQUE AUDIO") {
                    this.presentToastForReturnChequeListComment(data.body, data);
                } else if (data.trans_type == "CASE AUDIO") {
                    this.presentToastForCaseComment(data.body, data);
                } else if (data.trans_type == "SECURITY DEPOSIT AUDIO") {
                    this.presentToastForSecurityDepositComment(data.body, data);
                } else if (data.trans_type == "DREC AUDIO") {
                    this.presentToastForDrecComment(data.body, data);
                }
                else {
                    this.presentToastWithEvent(data.body, data);
                }
            }
        });

        this.fcm.onTokenRefresh().subscribe((token) => {
            localStorage.setItem('token', token);
            this.deviceID = token;

            var app_platform: string = '';
            if (this.platform.is('ios')) {
                app_platform = 'ios';
            }

            if (this.platform.is('android')) {
                app_platform = 'android';
            }

            let fcmdata = {} as any;
            fcmdata.user_id = this.user.UserInfoId;
            fcmdata.user_name = this.user.Surname;
            fcmdata.app_type = null;
            fcmdata.fcm_token = token;
            fcmdata.app_platform = app_platform;
            fcmdata.status = 'Online';

            this.presentLoadingDefault(true);
            this.authService.postData(fcmdata, 'account/fcmtokeninsertupdate').then((result) => {
                this.presentLoadingDefault(false);
                this.insertedValues = result;
            }, (err) => {
                this.presentLoadingDefault(false);
                this.presentToast(err);
            });

        });

    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 5000,
            position: 'top',
            cssClass: 'normalToast'
        });
        toast.present();
    }

    presentToastWithEvent(msg, data) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 10000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: "Open"
        });

        toast.onDidDismiss((_null, role) => {
            if (role == 'close' || role == 'Open') {
                if (data.trans_type == "TMS") {
                    this.SearchTaskDetail(data.seq_text);
                }
            }
        });

        toast.present();

    }

    presentToastForChat(msg: any, data: any) {
        let message = data.title + '- ' + msg;
        console.log(message);
        let toast = this.toastCtrl.create({
            message: message,
            duration: 10000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: "Open"
        });

        toast.onDidDismiss((_null, role) => {
            if (role == 'close' || role == 'Open') {
                if (data.trans_type != "TMS") {
                    if (this.user.UserInfoId > 0) {
                        this.openUserChat(data.chat_user_id, data.trans_type, data.group_name, data.roi_comments_id);
                    }
                }
            }
        });

        toast.present();

    }


    presentToastForFinancePaymentComment(msg: any, data: any) {
        let message = data.title + '- ' + msg;

        console.log(message);
        let toast = this.toastCtrl.create({
            message: message,
            duration: 10000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: "Open"
        });

        toast.onDidDismiss((_null, role) => {
            if (role == 'close' || role == 'Open') {
                if (data.trans_type == "PR AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openFinancePaymentCommentModal(data.roi_comments_id);
                    }
                }
            }
        });
        toast.present();
    }


    openFinancePaymentCommentModal(PAYMENT_REQUEST_ID: any) {
        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };
        let myModalData = [{
            PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID
        }];

        let myModal: Modal = this.modal.create('FinancePaymentCommentPage', { data: myModalData }, myModalOptions);

        myModal.present();
        myModal.onWillDismiss(() => {
        });
    }


    openCallCommentsModal(CALL_LOG_ID: any, REQUESTOR_NAME: any) {

        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };

        const myModalData = [{
            CALL_LOG_ID: CALL_LOG_ID,
            REQUESTOR_NAME: REQUESTOR_NAME
        }];

        const myModal: Modal = this.modal.create('callcomments', { data: myModalData }, myModalOptions);

        myModal.present();

        myModal.onDidDismiss((data) => {
        });

    }


    presentToastForCallComment(msg: any, data: any) {
        let message = data.title + '- ' + msg;

        console.log(message);
        let toast = this.toastCtrl.create({
            message: message,
            duration: 10000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: "Open"
        });

        toast.onDidDismiss((_null, role) => {
            if (role == 'close' || role == 'Open') {
                if (data.trans_type == "CALL AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openCallCommentsModal(data.roi_comments_id, data.requster_name);
                    }
                }
            }
        });
        toast.present();
    }


    presentToastForRoi(msg: any, data: any) {
        let message = data.title + '- ' + msg;
        console.log(message);
        let toast = this.toastCtrl.create({
            message: message,
            duration: 10000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: "Open"
        });

        toast.onDidDismiss((_null, role) => {
            if (role == 'close' || role == 'Open') {
                if (data.trans_type == "Current" || data.trans_type == "Next") {
                    if (this.user.UserInfoId > 0) {
                        this.openRoiPage(data.trans_type);
                    }
                }
            }
        });

        toast.present();

    }

    presentToastForMom(msg: any, data: any) {
        let message = data.title + '- ' + msg;
        console.log(message);
        let toast = this.toastCtrl.create({
            message: message,
            duration: 10000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: "Open"
        });

        toast.onDidDismiss((_null, role) => {
            if (role == 'close' || role == 'Open') {
                if (data.trans_type == "Mom") {
                    if (this.user.UserInfoId > 0) {
                        this.openMomPage(data.trans_type);
                    }
                }
            }
        });

        toast.present();

    }


    presentToastForAudioComment(msg: any, data: any) {
        let message = data.title + '- ' + msg;

        console.log(message);
        let toast = this.toastCtrl.create({
            message: message,
            duration: 10000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: "Open"
        });

        toast.onDidDismiss((_null, role) => {
            if (role == 'close' || role == 'Open') {
                if (data.trans_type == "LPO AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openLPOModal(data.roi_comments_id);
                    }
                }
            }
        });
        toast.present();
    }


    presentToastForLegalPaymentReqComment(msg: any, data: any) {
        let message = data.title + '- ' + msg;

        console.log(message);
        let toast = this.toastCtrl.create({
            message: message,
            duration: 10000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: "Open"
        });

        toast.onDidDismiss((_null, role) => {
            if (role == 'close' || role == 'Open') {
                if (data.trans_type == "LPR AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openLegalPaymentRequestCommentModal(data.roi_comments_id, data.payment_details);
                    }
                }
            }
        });
        toast.present();
    }



    openLegalPaymentRequestCommentModal(PAYMENT_REQUEST_ID: any, PAYMENT_DETAILS: any) {

        let PAYMENT_DETAIL = PAYMENT_DETAILS ? JSON.parse(PAYMENT_DETAILS) : null;

        debugger;
        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };
        let myModalData = [{
            PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID,
            type: 'Payment Request',
            PAYMENT_REQ_BILL_ID: 0,
            PAYMENT_DETAIL: PAYMENT_DETAIL
        }];
        let myModal: Modal = this.modal.create('PaymentModalPage', { data: myModalData }, myModalOptions);

        myModal.present();
        myModal.onWillDismiss(() => {
        });

    }

    presentToastForChequeListComment(msg: any, data: any) {
        let message = data.title + '- ' + msg;

        console.log(message);
        let toast = this.toastCtrl.create({
            message: message,
            duration: 10000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: "Open"
        });

        toast.onDidDismiss((_null, role) => {
            if (role == 'close' || role == 'Open') {
                if (data.trans_type == "CHEQUE AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openChequeListCommentModal(data.roi_comments_id, data.payment_details);
                    }
                }
            }
        });
        toast.present();
    }

    openChequeListCommentModal(ID: any, CHEQUE_DETAILS: any) {

        let CHEQUE_DETAIL = CHEQUE_DETAILS ? JSON.parse(CHEQUE_DETAILS) : null;

        debugger;
        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };
        let myModalData = [{
            ID: ID,
            CHEQUE: CHEQUE_DETAIL
        }];

        let myModal: Modal = this.modal.create('ChequeCommentPage', { data: myModalData }, myModalOptions);

        myModal.present();
        myModal.onWillDismiss(() => {
        });

    }

    openReturnChequeListCommentModal(ID: any, CHEQUE_DETAILS: any) {

        let CHEQUE_DETAIL = CHEQUE_DETAILS ? JSON.parse(CHEQUE_DETAILS) : null;

        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };

        let myModalData = [{
            CASH_RECEIPT_ID: ID,
            ESCLATED_COUNT: 0,
            RETURN_CHQ: CHEQUE_DETAIL
        }];

        let myModal: Modal = this.modal.create('ReturnCommentPage', { data: myModalData }, myModalOptions);

        myModal.present();
        myModal.onWillDismiss(() => {
        });

    }

    presentToastForReturnChequeListComment(msg: any, data: any) {
        let message = data.title + '- ' + msg;

        console.log(message);
        let toast = this.toastCtrl.create({
            message: message,
            duration: 10000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: "Open"
        });

        toast.onDidDismiss((_null, role) => {
            if (role == 'close' || role == 'Open') {
                if (data.trans_type == "RETURN CHEQUE AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openReturnChequeListCommentModal(data.roi_comments_id, data.payment_details);
                    }
                }
            }
        });
        toast.present();
    }

    openCaseCommentModal(ID: any, CASE_DETAILS: any) {

        let CASE_DETAIL = CASE_DETAILS ? JSON.parse(CASE_DETAILS) : null;

        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };

        let myModalData = [{
            CASE_REQ_ID: CASE_DETAIL.CASE_REQUEST_ID,
            CASE_ID: CASE_DETAIL.CASE_ID,
            CASE: CASE_DETAIL
        }];

        let myModal: Modal = this.modal.create('CaseModalPage', { data: myModalData }, myModalOptions);

        myModal.present();
        myModal.onWillDismiss(() => {
        });

    }

    presentToastForCaseComment(msg: any, data: any) {
        let message = data.title + '- ' + msg;

        console.log(message);
        let toast = this.toastCtrl.create({
            message: message,
            duration: 10000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: "Open"
        });

        toast.onDidDismiss((_null, role) => {
            if (role == 'close' || role == 'Open') {
                if (data.trans_type == "CASE AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openCaseCommentModal(data.roi_comments_id, data.payment_details);
                    }
                }
            }
        });
        toast.present();
    }



    openSecurityDepositCommentModal(LEASE_NUMBER: any) {

        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };

        let myModalData = [{
            LEASE_NUMBER: LEASE_NUMBER
        }];

        let myModal: Modal = this.modal.create('SecurityDepositCommentPage', { data: myModalData }, myModalOptions);

        myModal.present();
        myModal.onWillDismiss(() => {
        });

    }

    presentToastForSecurityDepositComment(msg: any, data: any) {
        let message = data.title + '- ' + msg;

        console.log(message);
        let toast = this.toastCtrl.create({
            message: message,
            duration: 10000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: "Open"
        });

        toast.onDidDismiss((_null, role) => {
            if (role == 'close' || role == 'Open') {
                if (data.trans_type == "SECURITY DEPOSIT AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openSecurityDepositCommentModal(data.roi_comments_id);
                    }
                }
            }
        });
        toast.present();
    }


    openDrecCommentModal(ID: any, DREC_DETAILS: any) {

        let DREC_DETAIL = DREC_DETAILS ? JSON.parse(DREC_DETAILS) : null;

        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };


        let myModalData = [{
            LEASE_NUM: ID,
            DREC: DREC_DETAIL
        }];

        let myModal: Modal = this.modal.create('DrecCommentsPage', { data: myModalData }, myModalOptions);

        myModal.present();
        myModal.onWillDismiss(() => {
        });

    }

    presentToastForDrecComment(msg: any, data: any) {
        let message = data.title + '- ' + msg;

        console.log(message);
        let toast = this.toastCtrl.create({
            message: message,
            duration: 10000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: "Open"
        });

        toast.onDidDismiss((_null, role) => {
            if (role == 'close' || role == 'Open') {
                if (data.trans_type == "DREC AUDIO") {
                    if (this.user.UserInfoId > 0) {
                        this.openDrecCommentModal(data.roi_comments_id, data.payment_details);
                    }
                }
            }
        });
        toast.present();
    }

    openLPOModal(LPO_ID: any) {

        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };

        const myModalData = [{
            LPO_ID: LPO_ID
        }];

        this.navCtrl.push(Lpomodelcomments, { data: this.myModalData }, { animate: false });

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


    open_Modal(TASK_ID: any) {
        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };

        let myModalData = [{
            TASK_ID: TASK_ID
        }];

        let myModal: Modal = this.modal.create('TaskCommentPage', { data: myModalData }, myModalOptions);

        myModal.present();
        myModal.onDidDismiss((data) => {
        });

        myModal.onWillDismiss((data) => {
        });
    }


    SearchTaskDetail(SEQ_TEXT: any) {
        let task_val = SEQ_TEXT;
        if (task_val != '') {
            let data = {
                SearchData: SEQ_TEXT,
                UserInfoId: this.user.UserInfoId
            }
            this.presentLoadingDefault(true);
            this.authService.postData(data, 'task/TaskManagementSearch').then((result) => {
                this.tasksearchlist = result;
                console.log('Searched data in login page', this.tasksearchlist);
                this.presentLoadingDefault(false);
                const myModalOptions: ModalOptions = {
                    enableBackdropDismiss: false
                };

                this.myModalData = [
                    this.tasksearchlist,
                    'Search',
                    task_val
                ];

                let myModal: Modal = this.modal.create('TaskManagementDetailPage', { data: this.myModalData }, myModalOptions);
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
    }

    openUserChat(ASSIGNED_USER_INFO_ID: any, TRANS_TYPE: any, GROUP_NAME: any, ROI_COMMENTS_ID: any) {

        console.log(ASSIGNED_USER_INFO_ID, TRANS_TYPE, GROUP_NAME);

        let myModalData = [{
            USER_INFO_ID: ASSIGNED_USER_INFO_ID,
            TRANS_TYPE: TRANS_TYPE,
            GROUP_NAME: GROUP_NAME,
            ROI_COMMENTS_ID: ROI_COMMENTS_ID
        }];

        this.navCtrl.push(ChatPage, { data: myModalData }, { animate: false });

    };

    openRoiPage(TRANS_TYPE: any) {

        console.log(TRANS_TYPE);

        this.myModalData = [
            this.TYPE = 'ROI NOTIFICATION'
        ]

        this.navCtrl.push(DailytaskcommentPage, { data: this.myModalData }, { animate: false });

    };

    openMomPage(TRANS_TYPE: any) {

        console.log(TRANS_TYPE);

        this.myModalData = [
            this.TYPE = TRANS_TYPE
        ]

        this.navCtrl.push(MyMeetingsPage, { data: this.myModalData }, { animate: false });

    };

    ionViewDidLoad() {
        this.network.onConnect().subscribe(() => {
            if (this.network.type === 'wifi') {
                console.log('we got a wifi connection, woohoo!');
                this.presentToast('we got a wifi connection, woohoo!')
            }
            if (this.network.type === '4g') {
                console.log('we got a 4G connection, woohoo!');
                this.presentToast('we got a wifi connection, woohoo!')
            }
            if (this.network.type === 'none') {
                this.presentToast('Check internet connection')
            }
        });
    }

    userSignUp() {
        this.showlogin = 1;
    }

    newuserLogin() {
        this.showlogin = 0;
    }

    signup() {

        this.fnerrormsg = "";
        this.lnerrormsg = "";
        this.emailerrormsg = "";
        this.passworderrormsg = "";
        this.cnfpassworderrormsg = "";

        if (this.userSignUpData.firstname == "") {
            this.fnerrormsg = 'Please enter first name.';
            return;
        }

        if (this.userSignUpData.firstname == "") {
            this.lnerrormsg = 'Please enter last name.';
            return;
        }

        if (EmailValidator.validate(this.userSignUpData.emailId)) {
            this.emailerrormsg = '';
        } else {

            this.emailerrormsg = 'Email is not valid!';
            return;
        }

        if (this.userSignUpData.signup_password == "") {
            this.passworderrormsg = 'Please enter valid password.';
            return;
        }

        if (this.userSignUpData.confirm_password == "") {
            this.cnfpassworderrormsg = 'Please enter valid confirm password.';
            return;
        }

        if (this.userSignUpData.signup_password != this.userSignUpData.confirm_password) {
            this.passworderrormsg = 'The password and confirm password not matching.';
            return;

        } else {

            let commentsData = {
                created_by: 2,
                modified_by: 2,
                user_employee_id: null,
                user_surname: this.userSignUpData.firstname,
                user_mobile: this.userSignUpData.countrycode + this.userSignUpData.mobile_no,
                user_login_name: this.userSignUpData.firstname,
                user_last_name: this.userSignUpData.lastname,
                user_password: this.userSignUpData.signup_password,
                confirm_password: this.userSignUpData.confirm_password,
                user_email: this.userSignUpData.emailId,
                department_id: 0,
                user_level_id: 0,
                manager_id: 0,
                org: null
            }
            this.presentLoadingDefault(true);
            this.authService.postData(commentsData, 'account/getInserMobileUserInfo').then((result) => {
                this.presentLoadingDefault(false);
                console.log(result);
                this.presentToast("The user is registered successfully and confirmation link is sent your email. ");
                this.showlogin = 0;
                this.userSignUpData.firstname = "";
                this.userSignUpData.countrycode = "";
                this.userSignUpData.mobile_no = "";
                this.userSignUpData.lastname = "";
                this.userSignUpData.signup_password = "";
                this.userSignUpData.confirm_password = "";
                this.userSignUpData.emailId = "";
                this.fnerrormsg = "";
                this.lnerrormsg = "";
                this.emailerrormsg = "";
                this.passworderrormsg = "";
                this.cnfpassworderrormsg = "";
            }, (err) => {
                this.presentLoadingDefault(false);
                this.presentToast(err);
            });
        }

    }

    countryChange(event: { component: SelectSearchableComponent, value: any }) {
        console.log('event', event.value);
        this.userSignUpData.countrycode = event.value.dial_code;
    }

    hideShowPassword() {
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
        this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
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

    async presentAlert(data) {
        const alert = await this.alertCtrl.create({
          title: 'Alert',
          message: data,
          buttons: ['OK']
        });
        await alert.present();
      }
      unsub() {
        this.clickSub.unsubscribe();
      }
      simpleNotif(res:any) {
        this.clickSub = this.localNotifications.on('click').subscribe(data => {
          console.log("locallllllllllllllllll", data);
          this.presentAlert('Your notifiations contains a secret = ' + data.data.secret);
          this.unsub();
        });
        this.localNotifications.schedule({
          id: 1,
          text: 'Your pending approval is '+' '+res,
          data: { secret: 'secret' },
          badge:res
    
        });
      }
    
      getPendingApproval(UserInfoId:any, TYPE_USER:any) {

        let lpo_type = '';

    if (TYPE_USER == 'COO') {
      lpo_type = 'WCOOA';
    } else if (TYPE_USER == 'CEO') {
      lpo_type = 'WCEOA';
    } else {
      lpo_type = 'USER_BASED';
    }

    let context = { LBL_TYPE: lpo_type, USER_ID: UserInfoId };

    //console.log(context);

    this.authService.postData(context, 'Lpo/GetLpoListByType').then((result) => {
      let Lpomanament: any;
      Lpomanament = result;
      let LPO_COUNT = Lpomanament.length ? Lpomanament.length : 0;
      if(LPO_COUNT>0){
      this.simpleNotif(LPO_COUNT);
      }
      
    }, (err) => {
      console.log(err)
    });
    
      }

}
