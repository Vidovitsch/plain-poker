import Popup from 'react-popup';
import './popup.css';

// Singleton support
let instance = null;

function PopupProvider() {
  this.createConfirmTemplate();
}

const P = PopupProvider.prototype;

P.confirm = function confirm(title, message) {
  return new Promise((resolve) => {
    Popup.plugins().confirm(title, message, (isConfirmed) => {
      resolve(isConfirmed);
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
        right: [{
          text: 'No',
          action() {
            callback(false);
            Popup.close();
          },
        }],
        left: [{
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

const getInstance = () => {
  if (!instance) {
    instance = new PopupProvider();
  }
  return instance;
};

export default getInstance();
