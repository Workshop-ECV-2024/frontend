import * as Tone from 'tone'

type Weather = {
    temperature: number;
    wind_speed: number;
    pressure: number;
    cloudiness: number;
}

type PlanetData = {
    avg_temperature: number;
    mass: number;
    distance_from_sun: number;
    year_length: number;
}
export class MusicComposer {
    public synth: any;
    public planet: string = 'Earth';
    public planetData: PlanetData|null = null;

    public highNotes: string[] = ["C", "E", "G", "C", "G", "E", "C"];
    public lowNotes: string[] = ["A", "E", "C", "A", "C", "E", "A"];
    public midNotes: string[] = ["C", "D", "E", "G", "A", "E", "G"];

    public highBassNotes: string[] = ["C2", "G2", "E2", "F2", "G2"];
    public lowBassNotes: string[] = ["A2", "E2", "C2", "G2"];
    public midBassNotes: string[] = ["C2", "G2", "D2", "A2", "E2"];

    public fastRhythm = ['0:0', '0:1', '0:1:2', '0:2', '0:2:5', '0:3', '0:3:5', '1:0', '1:1', '1:1:2', '1:2', '1:2:5', '1:3', '2:0'];
    public slowRhythm = ['0:0', '0:1', '0:3', '1:0', '1:1', '1:2', '1:3', '2:0', '2:1', '2:3', '3:0', '3:1', '3:2', '3:3', '4:0'];
    public normalRhythm = ['0:0', '0:1', '0:2:2', '0:2:4', '0:2:6', '0:3:4', '0:3:8', '1:0', '1:1', '1:2:2', '1:2:4', '1:2:6', '1:3:4', '1:3:8'];

    public fastBassRhythm = ['0:0', '0:0:3', '0:1:2', '0:2', '0:2:4', '0:3', '0:3:5'];
    public normalBassRhythm = ['0:0', '0:1', '0:2:3', '0:2:6', '0:3', '1:0'];
    public slowBassRhythm = ['0:0', '0:2', '1:0', '1:1', '1:3'];

    public earthData: PlanetData;
    public weather: Weather|null = null;
    constructor(earthData: PlanetData) {
        this.earthData = earthData;
    }

    setPlanet(planet: string, planetData: PlanetData|null = null, weather: Weather|null = null) {
        this.planet = planet;
        this.planetData = planetData;
        this.weather = weather;
    }

    setBass() {
        let attack = 0.008

        if (this.weather && this.weather.pressure < 1013) {
            attack = 5
        }

        const bassSynth = new Tone.MembraneSynth({
            pitchDecay: attack,
            octaves: 10,
            oscillator: {
                type: "sine",
            },
            envelope: {
                attack: 0.001,
                decay: 0.4,
                sustain: 0.01,
                release: 1.4,
                attackCurve: "exponential"
            }
        }).toDestination();

        let octave = 4
        let timing = '8n'
        let cloudiness;
        let temp;
        let mass;
        let notes;

        switch (this.planet) {
            case 'Earth':
                temp = this.weather?.temperature ?? 15
                mass = 1
                cloudiness = this.weather?.cloudiness ?? 0
                break;
            default:
                temp = this.planetData.avg_temperature
                mass = this.planetData.mass
                break;
        }

        if (this.planet === 'Earth') {
            if (cloudiness < 20) {
                timing = '16n'
            } else if (cloudiness < 50) {
                timing = '8n'
            } else if (cloudiness < 80) {
                timing = '4n'
            } else if (cloudiness < 100) {
                timing = '1n'
            } else if (cloudiness === 100) {
                timing = '1m'
            }
        } else {
            if (mass < 1) {
                timing = '16n'
            }

            if (mass > 1 && mass < 10) {
                timing = '4n'
            }

            if (mass > 10 && mass < 50) {
                timing = '2n'
            }

            if (mass > 50 && mass < 100) {
                timing = '1n'
            }

            if (mass > 100) {
                timing = '1m'
            }
        }
        if (temp < 15 && temp > 0) {
            octave = 3
        }

        if (temp <= 0 && temp > -100) {
            octave = 2
        }

        if (temp <= -100) {
            octave = 1
        }

        if (temp > 15) {
            octave = 5
        }

        if (octave < 4) {
            notes = this.lowBassNotes
        } else if (octave === 4) {
            notes = this.midBassNotes
        } else {
            notes = this.highBassNotes
        }

        notes = this.shuffle(notes);

        const tempo = Tone.getTransport().bpm.value;
        let rhythme = [];
        let loopEnd = '1m';

        if (tempo > 140) {
            rhythme = this.fastBassRhythm
        } else if(tempo < 100) {
            rhythme = this.slowBassRhythm
            loopEnd = '2m'
        } else {
            rhythme = this.normalBassRhythm
        }

        let result = [];

        notes.forEach((note, index) => {
            result.push([rhythme[index], note])
        })


        const loop = new Tone.Part((time, note) => {
            bassSynth.triggerAttackRelease(note, timing, time);
        }, result)

        loop.loop = true;
        loop.loopEnd = loopEnd;

        loop.start(0);
    }

    playMusic() {
        if (!this.planetData) {
            return;
        }

        this.setTempo();

        this.setMelody();

        this.setBass();

        Tone.getTransport().start();
    }

    private setMelody() {
        this.synth = new Tone.Synth().toDestination();


        let octave = 4
        let timing = '8n'
        let temp;
        let mass;
        let notes;
        let distanceFromSun;
        switch (this.planet) {
            case 'Earth':
                temp = this.weather?.temperature ?? 15
                mass = 1
                distanceFromSun = this.earthData.distance_from_sun
                break;
            default:
                temp = this.planetData.avg_temperature
                mass = this.planetData.mass
                distanceFromSun = this.planetData.distance_from_sun
                break;
        }

        let earthDistanceFromSun = this.earthData.distance_from_sun;
        // let's say earth distance is equal to 25% of reverb

        let reverbValue = Math.min(1, 0.25 * (distanceFromSun / earthDistanceFromSun));
        // set reverb

        const reverb = new Tone.Reverb(4).toDestination();
        reverb.wet.value = reverbValue;
        this.synth.connect(reverb);

        if (temp < 15 && temp > 0) {
            octave = 3
        }

        if (temp <= 0 && temp > -100) {
            this.synth = new Tone.FMSynth({
                volume: 10,
            }).toDestination();
            octave = 2
        }

        if (temp <= -100) {
            this.synth = new Tone.FMSynth({
                volume: 10,
            }).toDestination();
            octave = 1
        }

        if (temp > 15) {
            octave = 5
        }

        if (mass < 1) {
            timing = '16n'
        }

        if (mass > 1 && mass < 10) {
            timing = '4n'
        }

        if (mass > 10 && mass < 50) {
            timing = '2n'
        }

        if (mass > 50 && mass < 100) {
            timing = '1n'
        }

        if (mass > 100) {
            timing = '1m'
        }

        if (octave < 4) {
            notes = this.lowNotes
        } else if (octave === 4) {
            notes = this.midNotes
        } else {
            notes = this.highNotes
        }

        const newNotes = notes
        // reverse the newNotes array
        notes = newNotes.reverse()

        notes = notes.concat(newNotes)

        let rhythme = [];
        let loopEnd = '3m';
        const tempo = Tone.getTransport().bpm.value;

        if (tempo > 140) {
            rhythme = this.fastRhythm
        } else if (tempo < 100) {
            rhythme = this.slowRhythm
            loopEnd = '4m'
        } else {
            rhythme = this.normalRhythm
        }

        let result = [];

        notes.forEach((note, index) => {
            result.push([rhythme[index], note+octave])
        })

        const loop = new Tone.Part((time, note) => {
            this.synth.triggerAttackRelease(note, timing, time);
        }, result)

        loop.loop = true;
        loop.loopEnd = loopEnd;
        loop.start(0);
    }

    shuffle(array: []) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    private setTempo() {
        let tempo: number;

        switch (this.planet) {
            case 'Earth':
                const windSpeed = this.weather?.wind_speed ?? 0;
                tempo = 110 + windSpeed * 2;
                tempo = Math.max(Math.min(160, tempo), 60);
                break;
            default:
                const earthYearLength = this.earthData.year_length;
                const planetYearLength = this.planetData.year_length;

                tempo = Math.max(Math.min(160, (planetYearLength/earthYearLength) * 120), 60);
        }

        Tone.getTransport().bpm.value = tempo;
    }

    stopMusic() {
        Tone.getTransport().stop();
    }
}