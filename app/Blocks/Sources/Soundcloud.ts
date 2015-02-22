import Grid = require("../../Grid");
import Source = require("../Source");
import Type = require("../BlockType");
import BlockType = Type.BlockType;

class Soundcloud extends Source {

    public PlaybackRate: number;

    constructor(grid: Grid, position: Point) {
        this.BlockType = BlockType.Soundcloud;
        this.PlaybackRate = 1;

        var scId = "?client_id=7258ff07f16ddd167b55b8f9b9a3ed33";
        var tracks = ["24456532","25216773","5243666","84216161","51167662","172375224"];
        var audioUrl = "https://api.soundcloud.com/tracks/" + tracks[3] + "/stream" + scId;

        this.Source = new Tone.Player(audioUrl, function (sc) {
            sc.loop = true;
            //sc.start();
        });



        if (this.BlockType == BlockType.Soundcloud) {
            /*var audioUrl;
             SC.initialize({
             client_id: '7bfc58cb50688730352c60eb933aee3a'
             });
             var rawUrl = "https://soundcloud.com/whitehawkmusic/deep-mutant";
             SC.get('/resolve', { url: rawUrl }, function(track) {
             audioUrl = ""+track.stream_url +
             "?client_id=7bfc58cb50688730352c60eb933aee3a";
             });*/

            //var audioUrl = "https://api.soundcloud.com/tracks/145840993/stream?client_id=7bfc58cb50688730352c60eb933aee3a";
            //this.Source.load(audioUrl, this.StreamLoaded(this.Source));
        }

        super(grid, position);

        this.Envelope = new Tone.AmplitudeEnvelope(this.Settings.envelope.attack, this.Settings.envelope.decay, this.Settings.envelope.sustain, this.Settings.envelope.release);
        this.Source.connect(this.Envelope);
        this.Source.start();

        // Define Outline for HitTest
        this.Outline.push(new Point(-1, 0),new Point(0, -1),new Point(1, -1),new Point(2, 0),new Point(1, 1),new Point(0, 1));
    }

    MouseDown() {
        super.MouseDown();
        this.Envelope.triggerAttack();
    }

    MouseUp() {
        super.MouseUp();
        this.Envelope.triggerRelease();
    }

    Update() {
        super.Update();
    }

    Draw() {
        super.Draw();
        this.Grid.BlockSprites.Draw(this.Position,true,"soundcloud");
    }

    OpenParams() {
        super.OpenParams();

        this.ParamJson =
        {
            "name" : "Soundcloud",
            "parameters" : [

                {
                    "type" : "slider",
                    "name" : "Playback rate",
                    "setting" :"playbackRate",
                    "props" : {
                        "value" : this.GetValue("playbackRate"),
                        "min" : 0.125,
                        "max" : 8,
                        "quantised" : false,
                        "centered" : true,
                        "logarithmic": true
                    }
                }
            ]
        };
    }

    SetValue(param: string,value: any) {
        super.SetValue(param,value);

        if (param == "playbackRate") {
            this.PlaybackRate = value;
        }
    }

    GetValue(param: string){
        var val = super.GetValue(param);
        return val;
    }
}

export = Soundcloud;