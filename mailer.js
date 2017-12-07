'use strict';

const nodemailer = require('nodemailer'),
    path = require("path"),
    logger = require("./logger"),
    transporter = nodemailer.createTransport({
        pool: true,
        service: 'gmail',
        auth: {
            user: "from@email.com",
            pass: "my_sup4_passw000rd"
        }
    });

module.exports.init = function () {
    return transporter.verify();
};

module.exports.send = function (to, attachmentPath) {
    const mailOptions = {
        from: "from@email.com",
        to: to,
        subject: 'Houseguardian',
        html: '<h1>Intruder alert!</h1>',
        attachments: [{
            filename: path.basename(attachmentPath),
            path: attachmentPath
        }]
    };

    return transporter.sendMail(mailOptions);
};