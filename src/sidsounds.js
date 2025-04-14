class SidukoSounds {

    #cachedSounds
    constructor() {
        this.#cachedSounds = [];
        this.#getSound('Click1',1);
        this.#getSound('hiss1',0.6);
        this.#getSound('all systems go',0.2);
    }

    playSound(sSoundName) {
        this.#getSound(sSoundName).play();
    }

    #getSound(sSoundName, volume) {
        let oSound = this.#cachedSounds.find(s => s.name === sSoundName);
        if (!oSound) {
            const oAudio =  new Audio(`./resources/sounds/${sSoundName}.wav`);
            oAudio.volume = volume;
            oSound = {name: sSoundName, sound: oAudio};            
            this.#cachedSounds.push(oSound);
        }
        return oSound.sound;
    }
}