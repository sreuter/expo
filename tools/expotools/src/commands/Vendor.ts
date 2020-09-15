import { Command } from '@expo/commander';
import os from 'os';
import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
import {
  Clone,
  CopyFiles,
  Pipe,
  TransformFilesContent,
  TransformFilesName,
  RemoveDirectory,
  prefixPackage,
  renameIOSSymbols,
} from '../vendoring';

function getReanimatedPipe() {
  const tmpDir = path.join(os.tmpdir(), 'reanimated');
  const destination = 'packages/expo-dev-menu/vendored/react-native-reanimated';

  const pipe = new Pipe(
    new Clone({
      name: 'clone react-native-reanimated v1',
      url: 'git@github.com:software-mansion/react-native-reanimated.git',
      destination: tmpDir,
      tag: '1.13.0',
    }),
    new RemoveDirectory({
      name: 'clean react-native-reanimated folder',
      target: destination,
    }),
    new CopyFiles({
      name: 'copy js files',
      from: tmpDir,
      filePatterns: [path.join('src', '**', '*.*'), 'react-native-reanimated.d.ts'],
      to: destination,
    })
  );

  pipe.addSteps(
    'android',
    prefixPackage({
      source: tmpDir,
      packageName: 'com.swmansion.reanimated',
      prefix: 'devmenu',
    }),
    new TransformFilesName({
      name: "rename 'UIManagerReanimatedHelper.java'",
      source: tmpDir,
      filePattern: path.join('android', '**', 'UIManagerReanimatedHelper.java'),
      find: 'UIManagerReanimatedHelper',
      replace: 'DevMenuUIManagerReanimatedHelper',
    }),
    new TransformFilesContent({
      name: 'replace UIManagerReanimatedHelper class name',
      source: tmpDir,
      filePattern: path.join('android', '**', '*.@(java|kt)'),
      find: 'UIManagerReanimatedHelper',
      replace: 'DevMenuUIManagerReanimatedHelper',
    }),
    new CopyFiles({
      name: 'copy reanimated package',
      from: path.join(tmpDir, 'android', 'src', 'main', 'java', 'com', 'swmansion'),
      filePatterns: [path.join('**', '*.@(java|kt|xml)')],
      to: path.join(destination, 'android', 'devmenu', 'com', 'swmansion'),
    }),
    new CopyFiles({
      name: 'copy facebook package',
      from: path.join(tmpDir, 'android', 'src', 'main', 'java', 'com', 'facebook'),
      filePatterns: [path.join('**', '*.@(java|kt|xml)')],
      to: path.join(destination, 'android', 'com', 'facebook'),
    })
  );

  pipe.addSteps(
    'ios',
    new TransformFilesName({
      name: 'rename ios source files',
      source: tmpDir,
      filePattern: path.join('ios', '**', '*REA*.@(m|h)'),
      find: 'REA',
      replace: 'DevMenuREA',
    }),
    renameIOSSymbols({
      source: tmpDir,
      find: 'REA',
      replace: 'DevMenuREA',
    }),
    new TransformFilesContent({
      name: 'rename SimAnimationDragCoefficient function',
      source: tmpDir,
      filePattern: path.join('ios', '**', '*.@(m|h)'),
      find: 'SimAnimationDragCoefficient',
      replace: 'DevMenuSimAnimationDragCoefficient',
    }),
    new TransformFilesContent({
      name: 'remove RCT_EXPORT_MODULE macro',
      source: tmpDir,
      filePattern: path.join('ios', '**', '*.@(m|h)'),
      find: '^RCT_EXPORT_MODULE\\((.*)\\)',
      replace: '+ (NSString *)moduleName { return @"$1"; }',
    }),
    new CopyFiles({
      name: 'copy source files',
      from: tmpDir,
      filePatterns: [path.join('ios', '**', '*.@(m|h)')],
      to: destination,
    })
  );

  return pipe;
}

function getGestureHandlerPipe() {
  const tmpDir = path.join(os.tmpdir(), 'gesture-handler');
  const destination = 'packages/expo-dev-menu/vendored/react-native-gesture-handler';

  const pipe = new Pipe(
    new Clone({
      name: 'clone react-gesture-handler v1',
      url: 'git@github.com:software-mansion/react-native-gesture-handler.git',
      destination: tmpDir,
      tag: '1.7.0',
    }),
    new RemoveDirectory({
      name: 'clean react-gesture-handler folder',
      target: destination,
    }),
    new CopyFiles({
      name: 'copy main js files',
      from: tmpDir,
      filePatterns: ['*.js', path.join('touchables', '*.js')],
      to: path.join(destination, 'src'),
    }),
    new CopyFiles({
      name: 'copy types',
      from: tmpDir,
      filePatterns: ['react-native-gesture-handler.d.ts'],
      to: destination,
    })
  );
  pipe.addSteps(
    'android',
    new TransformFilesContent({
      name: 'replace package name',
      source: tmpDir,
      filePattern: path.join('android', '**', '*.@(java|kt)'),
      find: 'com.swmansion.gesturehandler',
      replace: 'devmenu.com.swmansion.gesturehandler',
    }),
    new TransformFilesName({
      name: "rename 'RNGHModalUtils.java'",
      source: tmpDir,
      filePattern: path.join('android', '**', 'RNGHModalUtils.java'),
      find: 'RNGHModalUtils',
      replace: 'DevMenuRNGHModalUtils',
    }),
    new TransformFilesContent({
      name: 'replace RNGHModalUtils class name',
      source: tmpDir,
      filePattern: path.join('android', '**', '*.@(java|kt)'),
      find: 'RNGHModalUtils',
      replace: 'DevMenuRNGHModalUtils',
    }),
    new CopyFiles({
      name: 'copy gesture main package',
      from: path.join(tmpDir, 'android', 'src', 'main', 'java', 'com', 'swmansion'),
      filePatterns: [path.join('**', '*.@(java|kt|xml)')],
      to: path.join(destination, 'android', 'devmenu', 'com', 'swmansion'),
    }),
    new CopyFiles({
      name: 'copy gesture lib package',
      from: path.join(tmpDir, 'android', 'lib', 'src', 'main', 'java'),
      filePatterns: [path.join('**', '*.@(java|kt|xml)')],
      to: path.join(destination, 'android', 'devmenu'),
    }),
    new CopyFiles({
      name: 'copy facebook package',
      from: path.join(tmpDir, 'android', 'src', 'main', 'java', 'com', 'facebook'),
      filePatterns: [path.join('**', '*.@(java|kt|xml)')],
      to: path.join(destination, 'android', 'com', 'facebook'),
    })
  );

  pipe.addSteps(
    'ios',
    new TransformFilesName({
      name: 'rename ios source files',
      source: tmpDir,
      filePattern: path.join('ios', '**', '*RN*.@(m|h)'),
      find: 'RN',
      replace: 'DevMenuRN',
    }),
    new TransformFilesContent({
      name: 'replace RN with DevMenuRN',
      source: tmpDir,
      filePattern: path.join('ios', '**', '*.@(m|h)'),
      find: 'RN',
      replace: 'DevMenuRN',
    }),
    new TransformFilesContent({
      name: 'remove RCT_EXPORT_MODULE macro',
      source: tmpDir,
      filePattern: path.join('ios', '**', '*.@(m|h)'),
      find: '^RCT_EXPORT_MODULE\\(DevMenu(.*)\\)',
      replace: '+ (NSString *)moduleName { return @"$1"; }',
    }),
    new TransformFilesContent({
      name: 'remove RCT_EXPORT_MODULE macro',
      source: tmpDir,
      filePattern: path.join('ios', '**', '*.@(m|h)'),
      find: '^RCT_EXPORT_MODULE\\(\\)',
      replace: '+ (NSString *)moduleName { return @"RNGestureHandlerModule"; }',
    }),
    new CopyFiles({
      name: 'copy source files',
      from: tmpDir,
      filePatterns: [path.join('ios', '**', '*.@(m|h)')],
      to: destination,
    })
  );

  return pipe;
}

async function action() {
  await getReanimatedPipe().start('all');
  await getGestureHandlerPipe().start('all');
}

export default (program: Command) => {
  program
    .command('vendor')
    .alias('v')

    .asyncAction(action);
};
