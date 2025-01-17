import Phaser from "phaser";
import Bar from "./objects/Bar";
import {
    loadAudioFromObject,
    json,
    loadImagesFromObject
} from "./utils/basic";
let versionGame = "controle de versao do jogo";
const bullKey = "bull",
    assetsPath = "./src/assets/",
    spriteAssetsPath = `${assetsPath}sprites/`;
let bg, bgGradient, dot, candles = [],
    actualCandle = 0,
    beforeDotMin = 0,
    beforeDotMax = 0;
const dotSize = 2,
    numCandles = 20,
    candleSize = 30,
    gapSize = 50,
    audioKeys = {
        cashout: "cashout",
        endSound: "endSound",
        startSound: "startSound",
        musicGame: "musicGame",
        bullSound: "bullSound",
        win: "win",
        lose: "lose"
    },
    pngKeys = {
        background: "background",
        bgWhite: "bgWhite",
        arrow: "arrow",
        middle: "middle",
        up: "up",
        down: "down",
        line: "line",
        lineUp: "lineUp",
        lineDown: "lineDown"
    };
let musicaLigada = !0,
    music = Phaser.Sound.BaseSound,
    bullSound = Phaser.Sound.BaseSound,
    sounds = !0,
    lineEnable = !1,
    visiblePage = !0,
    oldState = !1,
    randomTime = 200;
const timerWaiting = .5;
let startGame = !1;
const audioAssetsPath = `${assetsPath}audio/`,
    timeFade = 3e3;
let index = 0;
export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: "PreloadScene "
        })
    }
    preload() {
        this.load.setPath(spriteAssetsPath), loadImagesFromObject(pngKeys, this), this.load.setPath(`${spriteAssetsPath}bull/`), this.load.multiatlas("bull", json("bull")), this.load.setPath(audioAssetsPath), loadAudioFromObject(audioKeys, this), this.load.once("complete", (() => {
            this.createAnimations(), this.createSounds()
        })), this.load.once("complete", (() => {
            window.dispatchEvent(new CustomEvent("instance-preloaded")), window.dispatchEvent(new CustomEvent("instance-created")), versionGame = "Wall Street v2.0.3", this.scene.start("MainScene")
        }))
    }
    createAnimations() {
        this.anims.create({
            key: "bullAnim",
            frameRate: 30,
            frames: this.anims.generateFrameNames("bull", {
                prefix: "bull",
                start: 8,
                end: 114,
                zeroPad: 3
            })
        })
    }
    createSounds() {
        music = this.sound.add(audioKeys.musicGame, {
            loop: !0
        }), bullSound = this.sound.add(audioKeys.bullSound), audioKeys[audioKeys.cashout] = this.sound.add(audioKeys.cashout), audioKeys[audioKeys.endSound] = this.sound.add(audioKeys.endSound), audioKeys[audioKeys.startSound] = this.sound.add(audioKeys.startSound), audioKeys[audioKeys.win] = this.sound.add(audioKeys.win), audioKeys[audioKeys.lose] = this.sound.add(audioKeys.lose)
    }
}
export class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene"), window.addEventListener("newValue", (e => {
            this.drawNextBar(1, e.detail.height)
        })), window.addEventListener("musicOff", (() => this.musicOff())), window.addEventListener("musicOn", (() => this.musicOn())), window.addEventListener("soundsPlayOneTime", (e => this.soundsPlayOneTime(e.detail.som))), window.addEventListener("soundsOff", (() => this.soundsOff())), window.addEventListener("soundsOn", (() => this.soundsOn())), window.addEventListener("setLine", (e => this.setLine(e.detail.color))), window.addEventListener("visibilitychange", this.pause), window.addEventListener("resultsBefore", (e => this.resultsBefore(e.detail.value, e.detail.length))), window.dispatchEvent(new CustomEvent("instance-constructed"))
    }
    width;
    height;
    cameraYTarget = 0;
    cameraXTarget = 0;
    cameraSpeed = 50;
    barSpacing = 50;
    bars;
    nextBar;
    nextBarTimer = 0;
    nextBarDraw = 1e3;
    previousHeight = 0;
    nextCursor;
    alphaChange = .04;
    line;
    linePosition = 100;
    spray;
    spraySize = .5;
    bull;
    create() {
        startGame = !1, lineEnable = !1, this.width = this.scale.width, this.height = this.scale.height, this.setBackground(), this.bull = this.add.sprite(this.width / 2, this.height / 2, "bull").setDepth(2).setOrigin(.45, .5).setScrollFactor(0, 0), this.bull.alpha = 0, musicaLigada ? music.play({
            volume: .1,
            loop: !0
        }) : music.play({
            volume: 0,
            loop: !0
        }), candles = [], actualCandle = 0;
        for (let e = 0; e < 20; e++) candles[e] = this.add.graphics(), candles[e].lineStyle(0, 65280, 0), candles[e].lineBetween(0, 0, 0, 0);
        this.pauseGame(), this.cameras.main.fadeOut(0), setTimeout((() => {
            this.bull.alpha = 0, this.cameraSpeed = 5, this.cameras.main.fadeIn(1e3)
        }), 3e3)
    }
    resultsBefore(e, t) {
        startGame || (this.drawNextBar(0, e), index++, index == t && (startGame = !0, this.bull.alpha = 0, setTimeout((() => {
            startGame = !0, this.bull.alpha = 0, this.cameraSpeed = 5, window.removeEventListener("resultsBefore", (e => this.resultsBefore(e.detail.value, e.detail.length)))
        }), 3e3)))
    }
    setLine(e) {
        lineEnable && ("white" == e ? this.line.setTexture(this.textures.get(pngKeys.line)).setOrigin(.5) : "up" == e ? this.line.setTexture(this.textures.get(pngKeys.lineUp)).setOrigin(.5, 1) : "down" == e && this.line.setTexture(this.textures.get(pngKeys.lineDown)).setOrigin(.5, 0))
    }
    update(e, t) {
        this.flashNextCursor(), this.drawNextBar(t), this.moveCamera();
        const {
            context: s
        } = this.game.sound;
        "suspended" === s.state && s.resume()
    }
    setBackground() {
        bgGradient = this.add.image(960, 540, this.textures.get(pngKeys.bgWhite)).setScrollFactor(0, 0).setScale(1), bgGradient.preFX.addGradient(1646382, 2897487, 0), bg = this.add.sprite(960, 540, this.textures.get(pngKeys.background)).setScrollFactor(0, 0).setAlpha(.5).setScale(.8);
        const e = new Bar(this, this.width / 2, this.height / 2, this.getRandomDirection(), 30, 0, void 0);
        e.setDepth(1), this.bars = [e], this.cameras.main.centerOn(e.x, e.y);
        const t = e.direction === pngKeys.up ? -e.boxHeight / 2 : e.boxHeight / 2;
        this.nextCursor = this.add.rectangle(e.x + this.barSpacing, e.y + t, 30, 5, 16777215), this.nextBar = this.add.rectangle(this.nextCursor.x, this.nextCursor.y, 30, .1, this.getBarColor(pngKeys.down)), this.nextBar.direction = pngKeys.down, this.spray = this.add.image(this.nextCursor.x, this.nextCursor.y, this.textures.get(pngKeys.middle)), this.spray.setScale(this.spraySize), dot = this.add.circle(this.nextCursor.x, this.nextCursor.y, 2, 16777215), beforeDotMin = dot.y, beforeDotMax = dot.y + 1, this.line = this.add.image(this.nextCursor.x + this.linePosition, this.nextCursor.y, this.textures.get(pngKeys.line)).setAlpha(.6), lineEnable = !0
    }
    getNewBar(e, t) {
        const s = this.bars[this.bars.length - 1].x + this.barSpacing,
            i = this.bars[this.bars.length - 1].y,
            a = this.bars[this.bars.length - 1],
            n = new Bar(this, s, i, e, 30, t, a);
        n.setDepth(1), this.drawResult(n, e), this.bars.push(n), this.cameras.main.scrollX > this.bars[0].x - 150 && (this.bars[0].destroy(), this.bars.shift()), this.cameraXTarget = n.x - this.width / 2, this.cameraYTarget = n.y - this.height / 2;
        const r = this.bars[this.bars.length - 1].direction === pngKeys.up ? -this.bars[this.bars.length - 1].boxHeight / 2 : this.bars[this.bars.length - 1].boxHeight / 2;
        this.nextCursor.x = this.bars[this.bars.length - 1].x + this.barSpacing, this.nextCursor.y = this.bars[this.bars.length - 1].y + r, this.resetSprites(), this.callActionAnimation()
    }
    drawNextBar(e, t) {
        randomTime = Phaser.Math.Between(50, 120);
        const s = t < 0 ? pngKeys.down : t > 0 ? pngKeys.up : pngKeys.middle;
        if (void 0 !== t) this.addTween(-t), this.nextBarTimer = 0, setTimeout((() => {
            this.getNewBar(s, Math.abs(-t)), actualCandle++, beforeDotMin = dot.y, beforeDotMax = dot.y + 1
        }), .75 * this.nextBarDraw);
        else {
            if (actualCandle >= candles.length && (actualCandle = 0), this.nextBarTimer > this.nextBarDraw) {
                const e = Phaser.Math.Between(-randomTime, randomTime),
                    t = 0 === e ? 1 : e;
                this.addTween(t), this.previousHeight = t, this.nextBarTimer = 0
            }
            dot.y > beforeDotMax ? beforeDotMax = dot.y : dot.y < beforeDotMin && (beforeDotMin = dot.y), void 0 !== candles[actualCandle] && (candles[actualCandle].clear(), candles[actualCandle].lineStyle(2, dot.fillColor, 1), candles[actualCandle].lineBetween(dot.x, beforeDotMin, dot.x, beforeDotMax))
        }
        this.nextBarTimer += .5 * e
    }
    drawResult(e, t) {
        if (t != pngKeys.middle) {
            const s = t === pngKeys.up ? 1 * e.height : -1 * e.height,
                i = this.add.rectangle(e.x + .8 * e.width, e.y + s, 50, 50, this.getBarColor(t)).setOrigin(.5),
                a = this.add.image(e.x + .8 * e.width, e.y + s, this.textures.get(pngKeys.arrow));
            a.setScale(.05).setRotation(t === pngKeys.up ? -1.570795 : 1.570795);
            const n = t === pngKeys.up ? -50 : 50,
                r = 1e3;
            this.tweens.add({
                targets: [i, a],
                y: i.y + n,
                duration: r,
                alpha: 0
            }), setTimeout((() => {
                i.destroy(), a.destroy()
            }), r)
        } else this.bull.x = this.width / 2, this.bull.y = this.height / 2, this.bull.setScale(innerHeight / 1080 * 2), this.tweens.add({
            targets: this.bull,
            alpha: 1,
            duration: 400
        }), sounds ? bullSound.play({
            volume: .2
        }) : bullSound.play({
            volume: 0
        }), this.bull.play("bullAnim"), this.bull.on("animationcomplete", (() => this.tweens.add({
            targets: this.bull,
            alpha: 0,
            duration: 200
        })))
    }
    addTween(e) {
        e / this.previousHeight > 0 ? (this.setSpritesColor(e), this.tweens.add({
            targets: this.nextBar,
            height: e,
            ease: "Sine.easeInOut",
            duration: this.nextBarDraw / 2
        }), this.tweens.add({
            targets: [dot, this.spray, this.line],
            y: this.nextCursor.y + e,
            ease: "Sine.easeInOut",
            duration: this.nextBarDraw / 2
        })) : (this.tweens.add({
            targets: this.nextBar,
            height: 0,
            ease: "Sine.easeInOut",
            duration: this.nextBarDraw / 4
        }), this.tweens.add({
            targets: [dot, this.spray, this.line],
            y: this.nextCursor.y,
            ease: "Sine.easeInOut",
            duration: this.nextBarDraw / 4
        }), setTimeout((() => {
            this.setSpritesColor(e), this.tweens.add({
                targets: this.nextBar,
                height: e,
                ease: "Sine.easeInOut",
                duration: this.nextBarDraw / 4
            }), this.tweens.add({
                targets: [dot, this.spray, this.line],
                y: this.nextCursor.y + e,
                ease: "Sine.easeInOut",
                duration: this.nextBarDraw / 4
            })
        }), this.nextBarDraw / 4))
    }
    getBarColor(e) {
        return e == pngKeys.up ? 2927680 : e == pngKeys.down ? 14371121 : 11579568
    }
    getRandomDirection() {
        const e = Phaser.Math.Between(1, 3);
        return 1 === e ? pngKeys.up : 2 === e ? pngKeys.middle : pngKeys.down
    }
    flashNextCursor() {
        1 !== this.nextCursor.alpha && 0 !== this.nextCursor.alpha || (this.alphaChange *= -1), this.nextCursor.setAlpha(this.nextCursor.alpha + this.alphaChange), this.spray.setAlpha(this.nextCursor.alpha + this.alphaChange)
    }
    moveCamera() {
        this.cameras.main.scrollX < this.cameraXTarget && (this.cameras.main.scrollX += this.cameraSpeed), this.cameras.main.scrollY < this.cameraYTarget ? this.cameras.main.scrollY += this.cameraSpeed / 5 : this.cameras.main.scrollY > this.cameraYTarget && (this.cameras.main.scrollY -= this.cameraSpeed / 5)
    }
    setSpritesColor(e) {
        let t;
        this.spray.destroy(), e > 5 ? t = pngKeys.down : e < -5 ? t = pngKeys.up : (t = pngKeys.middle, e = 0), this.nextBar.direction = t, this.spray = this.add.image(dot.x, dot.y, t).setScale(this.spraySize), dot.fillColor = this.getBarColor(t), this.nextBar.fillColor = this.getBarColor(t)
    }
    resetSprites() {
        this.nextBar.destroy(), dot.destroy(), this.spray.destroy(), this.line.x = this.nextCursor.x + this.linePosition, this.line.y = this.nextCursor.y, this.nextBar = this.add.rectangle(this.nextCursor.x, this.nextCursor.y, 30, .1, this.getBarColor(pngKeys.middle)), this.nextBar.direction = pngKeys.middle, this.spray = this.add.image(this.nextCursor.x, this.nextCursor.y, this.textures.get(pngKeys.middle)).setScale(this.spraySize), dot = this.add.circle(this.nextCursor.x, this.nextCursor.y, 2, this.getBarColor(pngKeys.middle))
    }
    callActionAnimation() {
        Math.random()
    }
    soundsOff() {
        bullSound.volume = 0, sounds = !1
    }
    soundsOn() {
        bullSound.volume = .2, sounds = !0
    }
    musicOn() {
        music.volume = .1, musicaLigada = !0
    }
    musicOff() {
        music.volume = 0, musicaLigada = !1
    }
    soundsPlayOneTime(e) {
        sounds && audioKeys[e].play({
            volume: .2
        })
    }
    pause() {
        visiblePage = "visible" === document.visibilityState
    }
    pauseGame() {
        visiblePage && visiblePage != oldState ? (this.sound.mute = !1, oldState = !0) : visiblePage || (this.sound.mute = !0, oldState = !1), setTimeout((() => {
            this.pauseGame()
        }), 200)
    }
}