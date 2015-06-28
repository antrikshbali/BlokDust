import Grid = require("../../Grid");
import BlocksSketch = require("../../BlocksSketch");
import Source = require("../Source");

class Noise extends Source {

    public PlaybackRate: number;
    public DelayedRelease: number;
    public Noise: any;
    public Waveform: string;

    Init(sketch?: Fayde.Drawing.SketchContext): void {

        this.Waveform = 'brown';
        this.PlaybackRate = 1;

        this.WaveIndex = ["white","pink","brown"];

        if (!this.Params) {
            this.Params = {
                playback: 1,
                waveform: 2
            };
        }

        super.Init(sketch);

        this.CreateSource();
        this.CreateEnvelope();

        this.Envelopes.forEach((e: any)=> {
            e.connect(this.EffectsChainInput);
        });

        this.Sources.forEach((s: any, i:number)=> {
            s.connect(this.Envelopes[i]).start();
        });

        this.DelayedRelease = 0;

        // Define Outline for HitTest
        this.Outline.push(new Point(-1, 0),new Point(0, -1),new Point(1, -1),new Point(1, 0),new Point(-1, 2));
    }

    CreateSource(){
        this.Sources.push( new Tone.Noise( this.WaveIndex[this.Params.waveform] ) );
        return super.CreateSource();
    }

    CreateEnvelope(){
        this.Envelopes.push( new Tone.AmplitudeEnvelope(
            this.Settings.envelope.attack,
            this.Settings.envelope.decay,
            this.Settings.envelope.sustain,
            this.Settings.envelope.release
        ));

        return super.CreateEnvelope();
    }

    TriggerAttackRelease(){
        super.TriggerAttackRelease();
    }

    Update() {
        super.Update();

        //if (this.DelayedRelease>0) { //TODO, THIS IS SHIT
        //    this.DelayedRelease -= 1;
        //    if (this.DelayedRelease==0) {
        //        this.Envelopes.forEach((e: any)=> {
        //            e.triggerRelease();
        //        });
        //    }
        //}
    }

    Draw() {
        super.Draw();

        (<BlocksSketch>this.Sketch).BlockSprites.Draw(this.Position,true,"noise");
    }

    UpdateOptionsForm() {
        super.UpdateOptionsForm();

        this.OptionsForm =
        {
            "name" : "Noise",
            "parameters" : [

                {
                    "type" : "slider",
                    "name" : "Waveform",
                    "setting" :"waveform",
                    "props" : {
                        "value" : this.Params.waveform,
                        "min" : 0,
                        "max" : 2,
                        "quantised" : true,
                        "centered" : false
                    }
                }
            ]
        };
    }

    SetParam(param: string,value: any) {

        var val = value;

        if (param == "waveform") {
            /*switch(Math.round(value)){
                case 1: value = "white";
                    break;
                case 2: value = "pink";
                    break;
                case 3: value = "brown";
                    break;
            }
            this.Waveform = value;*/
        }
        this.Params[""+param] = val;


        super.SetParam(param,value);
    }

    GetParam(param: string){
        var val;
        if (param == "waveform") {
            switch(super.GetParam(param)){
                case "white": val = 1;
                    break;
                case "pink": val = 2;
                    break;
                case "brown": val = 3;
                    break;
            }
        } else {
            val = super.GetParam(param)
        }
        return val;
    }

    Dispose() {
        super.Dispose();

        this.Sources.forEach((s: any)=> {
            s.dispose();
        });

        this.Envelopes.forEach((e: any)=> {
            e.dispose();
        });

        this.PlaybackRate = null;
    }
}

export = Noise;