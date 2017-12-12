/* eslint-disable class-methods-use-this */
class Sound {
    constructor() {
        this.init();
    }
    init() {
        this.audio = document.createElement('audio');
        const source = document.createElement('source');
        source.src = '/sounds/message_sound.mp3';
        source.type = 'audio/mp3';
        this.audio.appendChild(source);
        document.body.appendChild(this.audio);
    }
    play() {
        this.audio.play();
    }
}

export default new Sound();
