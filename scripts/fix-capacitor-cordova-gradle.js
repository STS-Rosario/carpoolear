#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const javaVersionReplacements = [
  {
    from: 'sourceCompatibility JavaVersion.VERSION_21',
    to: 'sourceCompatibility JavaVersion.VERSION_17',
  },
  {
    from: 'targetCompatibility JavaVersion.VERSION_21',
    to: 'targetCompatibility JavaVersion.VERSION_17',
  },
];

function patchFile(filePath, extraReplacements = []) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[fix-capacitor-cordova-gradle] File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const rule of [...extraReplacements, ...javaVersionReplacements]) {
    if (content.includes(rule.from)) {
      content = content.replace(rule.from, rule.to);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
  }

  return changed;
}

const cordovaPluginsGradle = path.resolve(
  __dirname,
  '..',
  'android',
  'capacitor-cordova-android-plugins',
  'build.gradle',
);

const capacitorBuildGradle = path.resolve(
  __dirname,
  '..',
  'android',
  'app',
  'capacitor.build.gradle',
);

const changed =
  patchFile(cordovaPluginsGradle, [
    {
      from: "classpath 'com.android.tools.build:gradle:8.13.0'",
      to: "classpath 'com.android.tools.build:gradle:8.2.1'",
    },
  ]) || patchFile(capacitorBuildGradle);

if (changed) {
  console.log('[fix-capacitor-cordova-gradle] Applied Gradle compatibility patch.');
} else {
  console.log('[fix-capacitor-cordova-gradle] No changes needed.');
}
