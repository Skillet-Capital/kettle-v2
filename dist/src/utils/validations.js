"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEpoch = getEpoch;
exports.offerExpired = offerExpired;
exports.lienDefaulted = lienDefaulted;
function getEpoch() {
    return Math.floor(Date.now() / 1000);
}
function offerExpired(expiration) {
    return getEpoch() > Number(expiration);
}
function lienDefaulted(startTime, duration, gracePeriod) {
    return getEpoch() > Number(startTime) + Number(duration) + Number(gracePeriod);
}
