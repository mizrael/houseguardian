'use strict';

const pigpio = require('pigpio'),
    fs = require("fs"),
    Gpio = pigpio.Gpio,
    logger = require("./logger"),
    camera = require("./camera"),
    mailer = require("./mailer"),
    pirPin = 17,
    interval = 250;

let _lastLevel = 0,
    _pir;

function looper() {
    const level = _pir.digitalRead(),
        hasIntruder = (1 === level && 0 === _lastLevel);
    _lastLevel = level;

    if (!hasIntruder) {
        return;
    }

    logger.warning('Intruder detected!');

    camera.shoot()
        .then((imagePath) => {
            if (!imagePath)
                return;

            mailer.send("to@email.com", imagePath)
                .then(() => {
                    logger.info("email sent.");
                    fs.unlinkSync(imagePath);
                });
        })
        .catch((err) => {
            logger.error("unable to take picture: " + JSON.stringify(err));
        });
}

logger.info("initializing...");

mailer.init().then(() => {
    //call this before creating pins
    pigpio.configureClock(1, pigpio.CLOCK_PCM);

    camera.init();

    _pir = new Gpio(pirPin, {
        mode: Gpio.INPUT
    });

    setInterval(looper, interval);

    logger.info("guarding...");

}).catch((err) => {
    logger.error("unable to initialize mailer: " + JSON.stringify(err));
});