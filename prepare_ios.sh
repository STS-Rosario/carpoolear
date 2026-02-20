#!/bin/bash
# git pull origin capacitor-v2
npm run build:ios
cp -r dist/default/production/www/* www/
npx cap sync
