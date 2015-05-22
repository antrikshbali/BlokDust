import Keyboard = require("./Keyboard");
import Voice = require("./VoiceObject");
import ISource = require("../ISource");
import Grid = require("../../Grid");
import App = require("../../App");
import BlocksSketch = require("../../BlocksSketch");
import Microphone = require("../Sources/Microphone");
import Power = require("../Power/Power");

class KeyboardPoly extends Keyboard {

    public VoicesAmount: number;

    Init(sketch?: Fayde.Drawing.SketchContext): void {

        if (!this.Params) {
            this.Params = {
                octave: 3,
                voices: 4
            };
        }

        super.Init(sketch);

        this.KeysDown = {};
        this.VoicesAmount = 4; //TODO: Make this a global const

        // Define Outline for HitTest
        this.Outline.push(new Point(-1, 0),new Point(0, -1),new Point(2, 1),new Point(1, 2),new Point(-1, 2));
    }


    Draw() {
        super.Draw();
        (<BlocksSketch>this.Sketch).BlockSprites.Draw(this.Position,true,"poly keyboard");
    }

    Attach(source: ISource): void {
        super.Attach(source);

        if (!((source instanceof Power) || (source instanceof Microphone))) {
            this.CreateVoices(source);
        }
    }

    Detach(source: ISource): void {
        source.TriggerRelease('all'); //todo:
        super.Detach(source);
    }

    Dispose(){
        super.Dispose();
        this.KeysDown = null;
        this.VoicesAmount = null;
    }

    CreateVoices(source: ISource){

        // Work out how many voices we actually need (we may already have some)
        var diff = this.VoicesAmount - source.Sources.length;

        // If we haven't got enough sources, create however many we need.
        if (diff > 0){

            // Loop through and create the voices
            for (var i = 1; i <= this.VoicesAmount; i++) {

                // Create a source
                var s: Tone.Source = source.CreateSource();

                var e: Tone.AmplitudeEnvelope;

                // Create an envelope and save it to `var e`
                e = source.CreateEnvelope();

                if (e) {
                    // Connect the source to the Envelope and start
                    s.connect(e);
                    s.start();

                    // Connect Envelope to the Effects Chain
                    e.connect(source.EffectsChainInput);
                } else {
                    // No CreateEnvelope()
                    // Check if it's a Sampler Source (they have their own envelopes built in)
                    if (source.Sources[0] instanceof Tone.Sampler) {
                        e = source.Sources[i].envelope;
                        s.connect(source.EffectsChainInput)
                    }
                }

                // Add the source and envelope to our FreeVoices list
                source.FreeVoices.push( new Voice(i) );

            }
        }
    }

    KeyboardDown(keyDown:string, source:ISource): void {
        super.KeyboardDown(keyDown, source);

        var keyPressed = this.GetKeyNoteOctaveString(keyDown);
        var frequency = this.GetFrequencyOfNote(keyPressed, source);

        // Are there any free voices?
        if (source.FreeVoices.length > 0){

            // Yes, get one of them and remove it from FreeVoices list
            var voice = source.FreeVoices.shift();

            // Add it to the ActiveVoices list
            source.ActiveVoices.push( voice );

            // set it to the right frequency
            source.SetPitch(frequency, voice.ID);

            // trigger it's envelope
            source.TriggerAttack(voice.ID);

        } else {

            // No free voices available - steal the oldest one from active voices
            var voice: Voice = source.ActiveVoices.shift();

            // Set the new pitch
            source.SetPitch(frequency, voice.ID);

            // Add it back to the end of ActiveVoices
            source.ActiveVoices.push( voice );
        }
    }

    KeyboardUp(keyUp:string, source:ISource): void {
        super.KeyboardUp(keyUp, source);

        var keyPressed = this.GetKeyNoteOctaveString(keyUp);
        var keyUpFrequency = this.GetFrequencyOfNote(keyPressed, source);

        // Loop through all the active voices
        source.ActiveVoices.forEach((voice: Voice, i: number) => {

            var thisPitch = source.GetPitch(voice.ID)? source.GetPitch(voice.ID) : 0;

            // if this active voice has the same frequency as the frequency corresponding to the keyUp
            if (Math.round(thisPitch) === Math.round(keyUpFrequency)) {
                // stop it
                source.TriggerRelease(voice.ID);

                // Remove voice from Active Voices
                source.ActiveVoices.splice(i, 1);

                // Add it to FreeVoices
                source.FreeVoices.push(voice);
            }
        });
    }


    SetParam(param: string,value: number) {
        super.SetParam(param,value);
        var val = value;

        if (param == "octave") {
            for (var i = 0, source; i < this.Sources.Count; i++) {
                source = this.Sources.GetValueAt(i);
                var diff = val - this.Params.octave;
                source.OctaveShift(diff);
            }
        }

        this.Params[param] = val;
    }

    UpdateOptionsForm() {
        super.UpdateOptionsForm();

        this.OptionsForm =
        {
            "name" : "Poly Keyboard",
            "parameters" : [

                {
                    "type" : "slider",
                    "name" : "Octave",
                    "setting" :"octave",
                    "props" : {
                        "value" : this.Params.octave,
                        "min" : 0,
                        "max" : 9,
                        "quantised" : true,
                        "centered" : false
                    }
                },
            ]
        };
    }


}

export = KeyboardPoly;