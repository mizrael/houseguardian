function log(text, level) {
    var msg = "[" + level + "] " + new Date().toLocaleString() + " : " + text;
    console.log(msg);
}

module.exports.info = function (text) {
    log(text, "INFO");
}

module.exports.warning = function (text) {
    log(text, "WARNING");
}

module.exports.error = function (text) {
    log(text, "ERROR");
}