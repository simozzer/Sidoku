class SidukoNotifications {
  #messageQueue
  #infoQueue
  #alertElement
  #infoElement

  constructor() {
    this.#messageQueue = [];
    this.#infoQueue = [];
    this.#alertElement = document.getElementById('alert');
    this.#infoElement = document.getElementById('info');
    window.setInterval(() => this._updateAlerts(), 100);    
  }

  queueAlert(alertText, duration = 3000) {
    const oAlert = { message: alertText, duration: duration };
    this.#messageQueue.push(oAlert);
  }

  queueInfo(alertText, duration = 3000) {
    const oAlert = { message: alertText, duration: duration };
    this.#infoQueue.push(oAlert);
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

        let fnStopAlert = () => {
          this.#alertElement.classList.add('hidden');
          this.#alertElement.classList.remove('show_alert');
          this.#alertElement.innerText = '';
          this.#alertElement.removeEventListener('animationend', fnStopAlert);
          fnStopAlert = null;
        };
        this.#alertElement.addEventListener('animationend', fnStopAlert);      
        this.#alertElement.classList.add('show_alert');
      }
    }

    if (this.#infoQueue.length > 0) {
      const oInfo = this.#infoQueue[0];
      if (new Date().getTime() - oInfo.startTime > oInfo.duration) {
        this.#infoQueue.shift();
      }
      else if (!oInfo.startTime) {
        oInfo.startTime = new Date().getTime();
        this.#infoElement.textContent = oInfo.message;
        this.#infoElement.style.left = `${document.body.clientWidth - 325}px`;
        this.#infoElement.classList.remove('hidden');

        let fnStopInfo = () => {          
          this.#infoElement.classList.add('hidden');
          this.#infoElement.classList.remove('show_info'); 
          this.#infoElement.innerText = '';
          this.#infoElement.removeEventListener('animationend', fnStopInfo);
          fnStopInfo = null;
        };
        this.#infoElement.addEventListener('animationend', fnStopInfo);      

        this.#infoElement.classList.add('show_info'); 
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
