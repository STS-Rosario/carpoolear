# Carpoolear frontend

# Español

Carpoolear es la primera aplicación argentina de Facebook que permite a los usuarios de dicha red social compartir viajes en automóvil con otros usuarios de su entorno.

Es una customización ad-hoc para Argentina de la filosofía carpooling, la cual consiste en compartir nuestros viajes en auto con otras personas de forma cotidiana. El carpooling es una práctica popular en Estados Unidos y Europa, donde se realiza de manera organizada para lograr aumentar el número de viajes compartidos y que estos sean concretados con otras personas además de nuestros vecinos y amigos.

# English

Carpoolear is the first Argentine Facebook app that allow the users of this social network share car trips with other users.

It is and ad-hoc customization for Argentina with carpooling philosophy, with consist of sharing our car trips with other people. The carpooling is a popular practice in USA and Europe, where it is practice in a organized way with the purpose of increase the number of trips shared with new people in addition to our neighbors and friends.

## Start coding

``` bash
# git clone
git clone https://github.com/STS-Rosario/carpoolear.git

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
npm run prod (NOT WORKING)

```

## Selecting project

``` bash

# selec project, if not project selected, the default project is "default"
# linux and osx
TARGET_APP=myProject

# window poweshell
$TARGET_APP = "myProject"

```

## Mobile apps


``` bash

# in root folder
npm run build:android
npm run build:ios
npm run build-dev:android
npm run build-dev:ios

# the apk will be created in the dist folder

```

## Creating new projects

This branch is multi project. You can handle multiple apps in only one source code. To create a new project, first select it's name, for example "YOUR-PROJECT-NAME".

1. Then have to go to ./projects folder and clone default folder. Change the name of the folder to "YOUR-PROJECT-NAME" and customize all the assets (google-services.js, config.xml and images). Remember that in config.xml in "cordova-plugin-facebook4" you must put your APP_ID  and your APP_NAME of facebook.

2. If you wanna customize some css files or any vue module like main.css, you must copy the file in the same folder and name it "main.YOUR-PROJECT-NAME.css". When compiling the project webpack will resolve the correct file.

3. Finally in ./config folder clone the files dev.env.js and prod.env.js and save as dev.YOUR-PROJECT-NAME.env.js and prod.YOUR-PROJECT-NAME.env.js. Personalize the files with your values. Your new project is ready.

Happy coding!

## Contributing

You must respect this linting configuration: /*jshint esversion: 6*/

All the variable and methods name must be in english.


## License

The Carpoolear frontend is open-sourced software licensed under the [GPL 3.0](https://github.com/STS-Rosario/carpoolear_backend/blob/master/LICENSE).
