'use strict';

const path = require("path"),
    fs = require("fs"),
    RaspiCam = require('raspicam'),
    logger = require("./logger");

let _lastShoot = 0,
    _camera,
    _defaults = {
        interval: 1000,
        path: "./shoots/"
    },
    _options = {};

function shoot() {
    const now = Date.now(),
        filename = `shoot_${now}.jpg`,
        fullpath = path.join(_options.path, filename),
        camera = new RaspiCam({
            mode: 'photo',
            output: fullpath,
            width: 640,
            height: 480,
            timeout: 500,
            nopreview: true
        });
    return new Promise(function (resolve, reject) {
        camera.on("exit", function () {
            resolve(fullpath);
        });

        if (!camera.start()) {
            reject("unable to start camera engine");
        }
    });
}

module.exports.init = function (options) {
    _lastShoot = 0;

    _options = Object.assign({}, _defaults, options);

    if (!fs.existsSync(_options.path)) {
        fs.mkdirSync(_options.path);
    }
}

module.exports.shoot = function () {
    const now = Date.now();
    if (now > _lastShoot + _options.interval) {
        _lastShoot = now;

        return shoot();
    }
    return Promise.resolve(false);
}