import Phaser from "phaser";
import {
    PreloadScene,
    MainScene
} from "./mainScene";
const isTouch = navigator.maxTouchPoints || "ontouchstart" in document.documentElement,
    config = {
        type: Phaser.AUTO,
        autoFocus: !0,
        width: 1920,
        height: 1080,
        scale: {
            mode: Phaser.Scale.ENVELOP
        },
        fps: {
            target: 60,
            forceSetTimeOut: !1
        },
        render: {
            batchSize: 512,
            failIfMajorPerformanceCaveat: !0
        },
        physics: {
            default: "arcade"
        },
        antialiasGL: !isTouch,
        clearBeforeRender: !1,
        powerPreference: "high-performance",
        backgroundColor: "#0000000",
        scene: [PreloadScene, MainScene]
    };
export default new Phaser.Game(config);