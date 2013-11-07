"use strict";

var Node = require('../Node');
var Tools = require('../Tools');
var ArrayMath = require('dsp');

/**
 * A Node that takes frequency values as input to generate phase values as output.
 *
 * @class
*/
function Phasor () {
    Node.apply(this, arguments);
    this.lastPhase = this.parameters.initialPhase;
}

Phasor.prototype.defaults = {
    frequency: 440,
    initialPhase: null
};

/**
 * Calculates the phase based on the frequency.
 *
 * @param {Float32Array} phase The array to write the phase to.
*/
Phasor.prototype.process = function (phase) {
    var offset = this.blockSize - Tools.calculateOffset(
        phase,
        this.parameters.frequency
    );
    var frequency = Tools.offset(this.parameters.frequency, offset);

    ArrayMath.add(phase, frequency, phase);
    ArrayMath.mul(phase, 1 / this.sampleRate, phase);

    var lastPhase = this.lastPhase;

    // If `lastPhase` hasn't been initialized, we force the first phase to be 0.
    if (lastPhase === null) lastPhase = -phase[0];

    for ( var i = 0; i < phase.length; i++ ) {
        phase[i] = lastPhase = lastPhase + phase[i];
    }

    ArrayMath.fract(phase, phase);
    this.lastPhase = lastPhase;
};

Node.inheritBy(Phasor);
module.exports = Phasor;
