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

# serve with hot realod and with prod.env
npm run prod

```

## Selecting project

``` bash

# selec project, if not project selected, the default project is "default"
# linux and osx
TARGET_APP=myProject

# window poweshell
$env:TARGET_APP = "myProject"

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

## Config

In the config table in your carpoolear DB you can configure the following parameters:

| Property | Type | Description |
| -------- | ---- | ----------- |
| admin_email | STRING  | Email of the admin.|
| name_app | STRING | Name of the app. |
| target_app | STRING | Only in development. (target project name) |
| osm_country | STRING | Country locale for Open Street Map. |
| country_name | STRING | Your country name. |
| locale | STRING | Country locale. |
| home_redirection | STRING | Your home website url. |
| module_validated_drivers | BOOLEAN | If enabled, drivers must be valdiated. |
| trip_card_design | STRING | 'default' or 'light' // 'default is the custom carpoolear theme. 'light' is an optional carpoolear theme. You can make your own themes. |
| trip_stars | BOOLEAN | If enabled, the punctuation of users is shown as stars, if not as numbers.|
| max_cards_per_row | INT | How many trip cards must be shown per row. Default: 4 |
| disable_user_hints | BOOLEAN | If enabled, user hints are hidden. |
| login_custom_header | BOOLEAN | If enabled, you can use a custom header. |
| enable_footer | BOOLEAN | If enabled, you can login by facebook. |
| donation | JSON | With donation you can configure donation campaigns. Object must be: {"ammount_needed": 1000, "month_days": 0, "trips_count": 20, "trips_offset": 0, "trips_rated": 2} |
| module_trip_seats_payment | BOOLEAN | If enabled, online payment if required to travel. |
| module_user_request_limited | JSON | Object must be: {"enabled": true, "hours_range": 8} |
| api_crice | BOOLEAN | If enabled, active the api that calculate the trip price. |
| fuel_price | FLOAT | The local fuel price, to stimate the trip price. |
| enable_facebook | BOOLEAN | If enabled, you can login with facebook. |
| module_on_boarding_new_user | JSON | Object must be: {"enabled": true, "cards": 4} |
| allow_rating_reply | BOOLEAN | If enabled, you can reply a comment of another user |
---

## Important

You must respect this linting configuration: /*jshint esversion: 6*/

All the variable and methods name must be in english.


## License

The Carpoolear frontend is open-sourced software licensed under the [GPL 3.0](https://github.com/STS-Rosario/carpoolear_backend/blob/master/LICENSE).
