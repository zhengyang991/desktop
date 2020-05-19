// Copyright (c) 2015-2016 Yuya Ochiai
// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {ipcRenderer} from 'electron';
import electronContextMenu from 'electron-context-menu';

function getSuggestionsMenus(win, suggestions) {
  if (suggestions.length === 0) {
    return [{
      label: 'No Suggestions',
      enabled: false,
    }];
  }
  return suggestions.map((s) => ({
    label: s,
    click() {
      (win.webContents || win.getWebContents()).replaceMisspelling(s);
    },
  }));
}

function getSpellCheckerLocaleMenus(onSelectSpellCheckerLocale) {
  const currentLocale = ipcRenderer.sendSync('get-spellchecker-locale');
  const locales = [
    {language: 'English (UK)', locale: 'en-GB'},
    {language: 'English (US)', locale: 'en-US'},
    {language: 'French', locale: 'fr-FR'},
    {language: 'German', locale: 'de-DE'},
    {language: 'Polish', locale: 'pl-PL'},
    {language: 'Portuguese (BR)', locale: 'pt-BR'},
    {language: 'Spanish (ES)', locale: 'es-ES'},
    {language: 'Spanish (MX)', locale: 'es-MX'},
    {language: 'Dutch', locale: 'nl-NL'},
    {language: 'Italian', locale: 'it-IT'},
  ];
  return locales.map((l) => ({
    label: l.language,
    type: 'checkbox',
    checked: l.locale === currentLocale,
    click() {
      if (onSelectSpellCheckerLocale) {
        onSelectSpellCheckerLocale(l.locale);
      }
    },
  }));
}

export default {
  setup(win, options) {
    const defaultOptions = {
      useSpellChecker: false,
      onSelectSpellCheckerLocale: null,
    };
    const actualOptions = Object.assign({}, defaultOptions, options);
    electronContextMenu({
      window: win.webContents ? win : {...win, webContents: win.getWebContents()},
      prepend(_defaultActions, params) {
        if (false) {
          const prependMenuItems = [];
          if (params.isEditable && params.misspelledWord !== '') {
            const suggestions = ipcRenderer.sendSync('get-spelling-suggestions', params.misspelledWord);
            prependMenuItems.push(...getSuggestionsMenus(win, suggestions));
          }
          if (params.isEditable) {
            prependMenuItems.push(
              {type: 'separator'},
              {label: 'Spelling Languages', submenu: getSpellCheckerLocaleMenus(actualOptions.onSelectSpellCheckerLocale)});
          }
          return prependMenuItems;
        }
        return [];
      },
    });
  },
};
