# ChargeMe Mobile Application Simulation

## A Little Information About This Mobile Application
ChargeMe is a mobile application that is designed to help friends, family, and acquaintances make the experience of splitting a bill easier, quicker, and more efficient. With features such as making payments and bill split, users can choose how they want to split a bill and divide the total bill amount between each user rather than making multiple individual transactions. The goal is to make the transaction process faster and more efficient. For example, the user can scan receipts or their debit cards. This will allow the application to read the text and save the data to the database rather than making the users manually input all of the information. By having the item names and prices uploaded to the application database instantly, the inconveniences of splitting bills are eliminated; therefore, making this whole process go by seamlessly.

The main objective in developing the ChargeMe App is to solve the issue of the strenuous process of splitting an invoice, bill, or an order with others. By creating a service that will make splitting complicated bills with parties easier, it will also improve the efficiency of restaurant eating and trip planning as well. By instantly record invoice data and document debt on others, the app allows users to save hours of valuable time and ensures that their experience will be a lot more convenient.

## Getting Started with React Native Application Development

1. Run this command to locally package, serve, and publish projects with expo (does not matter if you run this command in the project directory):
```
$ npm install expo-cli --global
```
2. Install all of the elements of React Native:
```
$ npm install react-native-elements --save
```
3. Install node-modules folder:
```
$ npm install
```
4. Install dependencies:
```
$ npm install --save firebase
$ npm install react-navigation@2.6.2
$ npm i native-base@2.8.2  
$ npm install react-native-form-validator --save
$ npm install react-native-masked-text --save
$ npm install --save moment react-moment
$ npm i react-native-awesome-alerts --save
$ npm install react-native-circle-checkbox --save
$ npm install --save react-native-searchable-dropdown
$ npm install --save react-native-material-dropdown
$ npm i react-native-ui-stepper
$ npm install react-native-datepicker --save
$ npm install --save react-native-modal

```
5. Fix errors within react-native-vector-icons
```
$ npm uninstall react-native-vector-icons --save
$ npm install react-native-vector-icons --save
```
6. Install expo on your iOS/Android device or use an Android emulator like GenyMotion or iOS Simulator in Xcode

#### Emulate in Xcode iOS simulator
i.
- right click the Xcode icon
- hover over "Open Developer Tool"
- left click "Simulator"
- allow iOS simulator to boot up

ii. cd into the project directory and run the following command in the folder:
```
$ expo run
```
iii. Go back to the simulator and allow Expo to be installed on the emulator

iv. The appliction will open and you may navigate through the pages
- [iOS Simulator Gestures](https://www.dummies.com/web-design-development/mobile-apps/how-to-make-gestures-on-the-ios-simulator/)
- [Android Emulator Gestures](https://docs.genymotion.com/latest/Content/03_Virtual_Devices/Interacting_with_virtual_devices/Multi_touch_simulation.htm)

[Expo Documentation](https://docs.expo.io/versions/latest/introduction/installation/)

#### Emulate on iOS
i. cd into the project directory and run the following command in the folder:
```
$ expo run
```
ii. Download the Expo Client App

iii. Set the QR code is on Tunnel or LAN
-   Tunnel seems to run faster for some iOS devices

iv. Scan QR code through QR code scanner or iOS camera

v. Open application through Expo Client

## Detaching to ExpoKit
The following steps are for converting a pure-JS Expo project (such as one created from XDE) into a native iOS and Android project which depends on ExpoKit.

After you detach, all your JS files will stay the same, but we'll additionally create ios and android directories in your project folder. These will contain Xcode and Android Studio projects respectively, and they'll have dependencies on React Native and on Expo's core SDK.

You'll still be able to develop and test your project from XDE, and you'll still be able to publish your Expo JS code the same way. However, if you add native dependencies that aren't included in Expo, other users won't be able to run those features of your app with the main Expo app. You'll need to distribute the native project yourself.

1. Install exp
if you don't have it, run `npm install -g exp` to get our command line library.
If you haven't used exp or XDE before, the first thing you'll need to do is log in with your Expo account using `exp login`

2. Make sure you have the necessary keys in app.json

3. Detach
From your project directory, run `exp detach`. This will download the required dependencies and build native projects under the ios and android directories.

You will be asked to name the builds for iOS and Android and that can be whatever you want. If there are problems with this step, delete the repository, reinstall the dependencies and try again

4. Set up and Run your native project
Congrats, you now have a native project with ExpoKit! Follow the directions under Developing with ExpoKit to get things set up and running.

5. Make native changes
ou can do whatever you want in the Xcode and Android Studio projects.
To add third-party native modules for React Native, non-Expo-specific instructions such as `react-native link` should be supported.

## Installing CocoaPods
### What is CocoaPods?
CocoaPods is a dependency manager for Swift and Objective-C Cocoa projects. It has over 61 thousand libraries and is used in over 3 million apps. CocoaPods can help you scale your projects elegantly
CocoaPods is built with Ruby and is installable with the default Ruby available on macOS. We recommend you use the default ruby.
Using the default Ruby install can require you to use `sudo` when installing gems.

1. First open your terminal and type
`sudo gem install cocoapods -v 1.5.3`

Gem will get installed in Ruby inside System library:
2. Then update your gem file with command
`$ sudo gem install -n /usr/local/bin cocoapods`

3. Then give your project path
`$ cd /your project path`

4. Touch the podfile
`$ touch podfile`

5. Open the podfile
`$ open -e podfile`

6. Copy and paste the Podfile in this repository into your new podfile and save

7. After installation, there will be a lot of messages, read them and if no error found, it means cocoapods installation is done. Next, you need to setup the cocoapods master repo. Type in terminal
`$ pod setup`

8. Install pods into your project
`$ pod install`

### Opening the workspace (iOS)
1. direct to the ios folder in the project repository

2. open the file `chargeme.xcworkspace`

3. Build the project in iOS
It will take several minutes because the first time build is very bulky

4. Go to terminal
`$ expo start`
the simulator cannot open without the expo tunnel open, so you must launch the tunnel through expo for the simulator to build the mobile application

## Troubleshooting
### Error Running (OSX):
```
$ expo start
```
#### Error Message:
> Error installing or running app. Error: Command failed: osascript -e tell app "System Events" to count processes whose name is "Simulator"
> execution error: Not authorized to send Apple events to System Events

Go to:
> Settings -> Security & Privacy -> Privacy -> Automation -> Privacy tab
check the "System Events" checkbox

## Installing native dependencies

Now that you have detached you have access to native dependencies. However this means there will be an extra step when downloading new NPM libraries. Two such libraries are `rn-fetch-blob` and `react-native-camera-roll-picker`. To install them run the following commands:

```
$ npm install --save rn-fetch-blob
```
Go into your ios directory and add the following lines to your podfile
```
pod 'rn-fetch-blob',
    :path => '../node_modules/rn-fetch-blob'
 ```
Now save the podfile and run the following commands
```
$ react-native link
$ cd ios
$ pod install
```

At this point, it is advisable to clean your Xcode project build using `Command-Option-Shift-K`. If your build finishes without errors, continue with the following commands:
```
$ npm install react-native-camera-roll-picker --save
$ react-native link
$ cd ios
$ pod install
```

Once again, clean your Xcode project using `Command-Option-Shift-K` and ensure your project builds without error
