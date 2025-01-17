import Phaser from "phaser";
export default class Bar extends Phaser.GameObjects.Rectangle {
    direction;
    boxHeight;
    lineHeight;
    lineOffset;
    constructor(t, e, i, h, r, s, o) {
        super(t, e, i), this.direction = h;
        this.boxHeight = "middle" !== this.direction ? s : 5, this.lineHeight = "middle" !== this.direction ? Phaser.Math.Between(this.boxHeight, 2.5 * this.boxHeight) : Phaser.Math.Between(0, 200), this.lineOffset = Phaser.Math.Between(-this.lineHeight / 2, this.lineHeight / 2);
        const n = this.getYPos(h, o, this.boxHeight);
        t.add.rectangle(e, n, r, this.boxHeight, this.getBarColor(h)).setOrigin(.5, .5), this.y = n, this.fillColor = this.getBarColor(h)
    }
    getYPos(t, e, i) {
        if (e) {
            if ("up" == e.direction) {
                const h = e.y - e.boxHeight / 2;
                return "up" == t ? h - i / 2 : "down" == t ? h + i / 2 : h
            }
            if ("down" == e.direction) {
                const h = e.y + e.boxHeight / 2;
                return "up" == t ? h - i / 2 : "down" == t ? h + i / 2 : h
            }
            return e.y
        }
        return this.y
    }
    getBarColor(t) {
        return "up" == t ? 2927680 : "down" == t ? 14371121 : 11579568
    }
}