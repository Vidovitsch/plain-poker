import React from 'react';
import Popup from 'react-popup';
import './popup.css';
import Prompt from './components/Prompt/Prompt';

// Singleton support
let instance = null;

function PopupProvider() {
  this.createConfirmTemplate();
  this.createPromptTemplate();
}

const P = PopupProvider.prototype;

P.confirm = function confirm(title, message) {
  return new Promise((resolve) => {
    Popup.plugins().confirm(title, message, (isConfirmed) => {
      resolve(isConfirmed);
    });
  });
};

P.prompt = function prompt(title, message, placeholder, initialValue) {
  return new Promise((resolve) => {
    Popup.plugins().prompt(title, message, placeholder, initialValue, (value) => {
      resolve(value);
    });
  });
};

P.createConfirmTemplate = function createConfirmTemplate() {
  /* eslint-disable func-names */
  Popup.registerPlugin('confirm', function (title, content, callback) {
    this.create({
      title,
      content,
      buttons: {
        left: [{
          text: 'No',
          action() {
            callback(false);
            Popup.close();
          },
        }],
        right: [{
          text: 'Yes',
          className: 'danger',
          action() {
            callback(true);
            Popup.close();
          },
        }],
      },
    });
  });
  /* eslint-enable func-names */
};

P.createPromptTemplate = function createPromptTemplate() {
  /* eslint-disable func-names */
  Popup.registerPlugin('prompt', function (title, message, placeholder, initialValue, callback) {
    let promptValue = null;
    const promptChange = function (value) {
      promptValue = value;
    };
    this.create({
      title,
      content: <Prompt
        onChange={promptChange}
        placeholder={placeholder}
        value={initialValue}
        message={message}
      />,
      buttons: {
        left: [{
          text: 'Cancel',
          action() {
            callback(false);
            Popup.close();
          },
        }],
        right: [{
          text: 'Save',
          className: 'success',
          action() {
            callback(promptValue);
            Popup.close();
          },
        }],
      },
    });
  });
  /* eslint-enable func-names */
};

const getInstance = () => {
  if (!instance) {
    instance = new PopupProvider();
  }
  return instance;
};

export default getInstance();
