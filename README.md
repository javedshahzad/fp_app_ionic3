# FP App
This app developed in
* Ionic 3
* Angular 5
* Run `npm i` to install node modules
* Run `ionic serve` to run in browser


* Generate key command
```
keytool -genkey -v -keystore fp_portal.keystore -alias fp_portal -keyalg RSA -keysize 2048 -validity 20000
```
# This is the real key store. you can find it in project root name fp_portal.keystore file.
``
keytool -list -v -keystore fp_portal.keystore -alias fp_portal -storepass fp_portal -keypass fp_portal
``

* keystore=fp_portal.keystore
* keypass=fp_portal
* alias=fp_portal
* password=fp_portal
```
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore E:\Workplace\Ionic-Apps\FP-Apps\fp_app_ionic\fp_portal.keystore E:\Workplace\Ionic-Apps\FP-Apps\fp_app_ionic\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk fp_portal

```
```

C:\Users\Javed\AppData\Local\Android\Sdk\build-tools\30.0.2\zipalign.exe -v 4 E:\Workplace\Ionic-Apps\FP-Apps\fp_app_ionic\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk fp_signed.apk

```