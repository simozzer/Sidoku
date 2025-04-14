class SidukoSounds {

    #cachedSounds
    constructor() {
        this.#cachedSounds = {};
        this.#getSound('click1',1);
        this.#getSound('hiss1',0.6);
        this.#getSound('all systems go',0.2);
    }

    playSound(sSoundName) {
        this.#getSound(sSoundName).play();
    }

    #getSound(sSoundName, volume) {
        let oSound = this.#cachedSounds[sSoundName];
        if (!oSound) {
            oSound = new Audio(`./resources/sounds/${sSoundName}.wav`);
            oSound.volume = volume;
            this.#cachedSounds[sSoundName] = oSound;
        }
        return oSound;
    }
}