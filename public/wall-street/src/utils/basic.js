const clamp = (a, o, r) => Math.min(Math.max(a, o), r),
    randomInt = (a, o) => Math.floor(Math.random() * (o - a)) + a,
    randomFloat = (a, o) => Math.random() * (o - a) + a,
    randomBool = () => randomInt(0, 1) % 2 == 0,
    randomIdx = a => {
        if (Array.isArray(a)) return randomInt(0, a.length)
    },
    randomFromArray = a => {
        if (Array.isArray(a)) return a[randomIdx(a)]
    },
    loadSpine = (a, o) => {
        o.load.spine(a, `${a}.json`, `${a}.atlas`)
    },
    loadAudioSprite = (a, o) => {
        o.load.audioSprite(a, `${a}.json`, [`${a}.ogg`, `${a}.agg`])
    },
    loadImages = (a, o, r) => {
        a.forEach((a => {
            r.load.image(a, `${a}.${o}`)
        }))
    },
    loadImagesFromObject = (a, o) => {
        Object.values(a).forEach((a => {
            Array.isArray(a) ? a.forEach((a => o.load.image(a, png(a)))) : o.load.image(a, png(a))
        }))
    },
    loadSVGFromObject = (a, o) => {
        Object.values(a).forEach((a => {
            Array.isArray(a) ? a.forEach((a => o.load.image(a, svg(a)))) : o.load.image(a, svg(a))
        }))
    },
    checkUserAgent = a => -1 != navigator.userAgent.indexOf(a),
    loadAudioFromObject = (a, o) => {
        Object.values(a).forEach((a => {
            Array.isArray(a) ? a.forEach((a => o.load.audio(a, mp3(a)))) : o.load.audio(a, mp3(a))
        }))
    },
    format = (a, o) => `${a}.${o}`,
    png = a => format(a, "png"),
    jpg = a => format(a, "jpg"),
    json = a => format(a, "json"),
    atlas = a => format(a, "atlas"),
    svg = a => format(a, "svg"),
    mp3 = a => format(a, "mp3");
export {
    randomBool,
    randomFromArray,
    randomIdx,
    loadSpine,
    loadImages,
    loadAudioSprite,
    loadImagesFromObject,
    loadAudioFromObject,
    loadSVGFromObject,
    png,
    jpg,
    json,
    atlas,
    format,
    checkUserAgent,
    mp3,
    svg
};