#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(
  __dirname,
  '..',
  'android',
  'capacitor-cordova-android-plugins',
  'build.gradle',
);

if (!fs.existsSync(targetFile)) {
  console.warn(`[fix-capacitor-cordova-gradle] File not found: ${targetFile}`);
  process.exit(0);
}

let content = fs.readFileSync(targetFile, 'utf8');
let changed = false;

const replacements = [
  {
    from: "classpath 'com.android.tools.build:gradle:8.13.0'",
    to: "classpath 'com.android.tools.build:gradle:8.2.1'",
  },
  {
    from: 'sourceCompatibility JavaVersion.VERSION_21',
    to: 'sourceCompatibility JavaVersion.VERSION_17',
  },
  {
    from: 'targetCompatibility JavaVersion.VERSION_21',
    to: 'targetCompatibility JavaVersion.VERSION_17',
  },
];

for (const rule of replacements) {
  if (content.includes(rule.from)) {
    content = content.replace(rule.from, rule.to);
    changed = true;
  }
}

if (changed) {
  fs.writeFileSync(targetFile, content);
  console.log('[fix-capacitor-cordova-gradle] Applied Gradle compatibility patch.');
} else {
  console.log('[fix-capacitor-cordova-gradle] No changes needed.');
}
