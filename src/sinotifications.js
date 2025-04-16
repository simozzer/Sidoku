class SidukoNotifications {
  #messageQueue
  #alertElement
  #alertInterval
  constructor() {
    this.#messageQueue = [];
    this.#alertElement = document.getElementById('alert');
    this.#alertInterval = window.setInterval(() => this._updateAlerts(), 100);
  }

  queueAlert(alertText, duration = 3000) {
    const oAlert = { message: alertText, duration: duration };
    this.#messageQueue.push(oAlert);
  }

  _updateAlerts() {
    if (this.#messageQueue.length > 0) {
      const oAlert = this.#messageQueue[0];
      if (new Date().getTime() - oAlert.startTime > oAlert.duration) {
        this.#messageQueue.shift();
      }
      else if (!oAlert.startTime) {
        oAlert.startTime = new Date().getTime();
        this.#alertElement.textContent = oAlert.message;
        this.#alertElement.classList.remove('hidden');

        let fn = () => {
          this.#alertElement.classList.add('hidden');
          this.#alertElement.classList.remove('show_alert');
          this.#alertElement.innerText = '';
          this.#alertElement.removeEventListener('animationend', fn);
          fn = null;
        };
        this.#alertElement.addEventListener('animationend', fn);      
        this.#alertElement.classList.add('show_alert');
      }
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SidukoNotifications();
    }
    return this.instance;
  }
}

 const sidukoNotifications = () => {SidukoNotifications.getInstance();}
