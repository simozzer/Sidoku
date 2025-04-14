class SidukoSounds {

    #cachedSounds
    constructor() {
        this.#cachedSounds = {};
        this.#getSound('click1');
        this.#getSound('hiss1');
        this.#getSound('all systems go');
    }

    playSound(sSoundName) {
        this.#getSound(sSoundName).play();
    }

    #getSound(sSoundName) {
        let oSound = this.#cachedSounds[sSoundName];
        if (!oSound) {
            oSound = new Audio(`./resources/sounds/${sSoundName}.wav`);
            oSound.volume = 0.2;
            this.#cachedSounds[sSoundName] = oSound;
        }
        return oSound;
    }
}