// Basic Web Audio API synthesizer for SFX and BGM
// No external assets required!

class SoundManager {
    private context: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isMuted: boolean = false;
    private bgmGain: GainNode | null = null;
    private isPlayingBGM: boolean = false;
    private nextNoteTime: number = 0;
    private patternIndex: number = 0;
    private schedulerTimer: number | null = null;

    constructor() {
        // Context is initialized lazily on user interaction
    }

    private initContext() {
        if (!this.context && typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.context = new AudioContextClass();
                this.masterGain = this.context.createGain();
                this.masterGain.connect(this.context.destination);
                this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
            }
        }
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain && this.context) {
            this.masterGain.gain.setTargetAtTime(
                this.isMuted ? 0 : 0.3,
                this.context.currentTime,
                0.1
            );
        }
        return this.isMuted;
    }

    public getMuted() {
        return this.isMuted;
    }

    // Play a short sound effect
    public playSFX(type: 'click' | 'success' | 'error' | 'star') {
        this.initContext();
        if (!this.context || this.isMuted) return;

        // Resume context if suspended (browser policy)
        if (this.context.state === 'suspended') {
            this.context.resume().catch(() => { });
        }

        const t = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain!);

        if (type === 'click') {
            // Star-like ping/chime
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, t);
            osc.frequency.exponentialRampToValueAtTime(1800, t + 0.1);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
            osc.start(t);
            osc.stop(t + 0.2);
        } else if (type === 'success') {
            // Arpeggio C-E-G
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
            notes.forEach((freq, i) => {
                const o = this.context!.createOscillator();
                const g = this.context!.createGain();
                o.connect(g);
                g.connect(this.masterGain!);
                g.gain.value = 0.3;

                o.type = 'sine';
                o.frequency.value = freq;

                g.gain.setValueAtTime(0, t + i * 0.1);
                g.gain.linearRampToValueAtTime(0.3, t + i * 0.1 + 0.05);
                g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.4);

                o.start(t + i * 0.1);
                o.stop(t + i * 0.1 + 0.5);
            });
        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.linearRampToValueAtTime(100, t + 0.3);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.linearRampToValueAtTime(0.01, t + 0.3);
            osc.start(t);
            osc.stop(t + 0.35);
        } else if (type === 'star') {
            // High chiming sound (longer)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, t);
            osc.frequency.exponentialRampToValueAtTime(1800, t + 0.2); // Pitch up
            // Add vibrato
            const vib = this.context.createOscillator();
            const vibGain = this.context.createGain();
            vib.frequency.value = 10; // Vibrato speed
            vibGain.gain.value = 50; // Vibrato depth
            vib.connect(vibGain);
            vibGain.connect(osc.frequency);
            vib.start(t);
            vib.stop(t + 0.5);

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
            osc.start(t);
            osc.stop(t + 0.6);
        }
    }

    // Play simple background melody loop
    public startBGM() {
        this.initContext();
        if (!this.context || this.isPlayingBGM) return;

        // Resume if suspended
        if (this.context.state === 'suspended') {
            this.context.resume().catch(() => { });
        }

        this.isPlayingBGM = true;
        this.bgmGain = this.context.createGain();
        this.bgmGain.connect(this.masterGain!);
        this.bgmGain.gain.value = 0.15; // Lower volume for BGM

        this.nextNoteTime = this.context.currentTime;
        this.patternIndex = 0;
        this.scheduler();
    }

    private scheduler = () => {
        if (!this.isPlayingBGM || !this.context) return; // Stopped or context lost

        // Schedule ahead
        while (this.nextNoteTime < this.context.currentTime + 0.1) {
            this.scheduleNote(this.nextNoteTime);
            this.nextNoteTime += 0.4; // Note duration
        }

        this.schedulerTimer = window.setTimeout(this.scheduler, 25);
    };

    private scheduleNote(time: number) {
        if (!this.context || !this.bgmGain) return;

        // Simple pentatonic melody: C4, D4, E4, G4, A4
        const scale = [261.63, 293.66, 329.63, 392.00, 440.00];
        // Pattern of 16 steps
        const pattern = [
            0, 2, 4, 2,
            3, 3, 2, 1,
            0, 2, 3, 4,
            4, 3, 2, 1
        ];

        const noteIndex = pattern[this.patternIndex % pattern.length];
        const freq = scale[noteIndex];

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'triangle'; // Softer sound
        osc.frequency.value = freq;

        gain.connect(this.bgmGain);

        // ADSR Envelope
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.2, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

        osc.start(time);
        osc.stop(time + 0.35);

        this.patternIndex++;
    }

    public stopBGM() {
        this.isPlayingBGM = false;
        if (this.schedulerTimer) {
            clearTimeout(this.schedulerTimer);
            this.schedulerTimer = null;
        }
        if (this.bgmGain) {
            // Fade out
            try {
                this.bgmGain.gain.setTargetAtTime(0, this.context?.currentTime || 0, 0.5);
                setTimeout(() => {
                    this.bgmGain?.disconnect();
                    this.bgmGain = null;
                }, 600);
            } catch (e) {
                // Ignore errors if context is closed
            }
        }
    }
}

// Singleton instance
export const soundManager = new SoundManager();
