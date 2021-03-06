interface ToneSettings {

    noise?: NoiseSettings;

    oscillator?: OscillatorSettings;

    envelope?: EnvelopeSettings;

    output?: OutputSettings;

    Volume?: VolumeSettings;

}

interface NoiseSettings {
    waveform?: string;
}

interface OscillatorSettings extends NoiseSettings {
    frequency: number;
}

interface EnvelopeSettings {
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
}

interface OutputSettings {
    volume?: number;
}



interface VolumeSettings {
    Gain: {
        MinValue: number;
        MaxValue: number;
        CurrentValue: number;
        Quantised: boolean;
        CentredOrigin: boolean;
    };
    Name: string;
}

