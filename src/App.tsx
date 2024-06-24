import { JSX, createEffect, createSignal, splitProps } from 'solid-js';
import * as musicMetadata from 'music-metadata-browser';
import { Buffer } from 'buffer';
import process from 'process';

import './App.css';

import styles from './App.module.css';

if (typeof window !== "undefined" && typeof window.Buffer === "undefined") {
  window.Buffer = Buffer;
}

if (typeof window !== "undefined" && typeof window.process === "undefined") {
  window.process = process;
}

function PowerButton(props: {
  isPowerOn: boolean;
  setIsPowerOn: (isPowerOn: boolean) => void;
}) {
  return (
    <button style={{ width: '80px', height: '50px', border: '2px solid black', 'border-radius': '4px', padding: '10px', background: 'linear-gradient(180deg, hsl(0, 0%, 5%), hsl(0, 0%, 3%))' }} class="flex justify-center bg-neutral-950 active:brightness-75 group" onClick={() => props.setIsPowerOn(!props.isPowerOn)}>
      <div class={props.isPowerOn ? "bg-sky-400 xgroup-active:bg-sky-800" : 'bg-black xgroup-active:bg-sky-800'} style={{ width: '20px', height: '3px' }} />
    </button>
  );
}

function TapeGear(props: {
}) {
  return (
    <div style={{ position: 'relative', width: '30px', height: '30px', border: '3px solid hsl(0, 0%, 50%)', "border-radius": '9999px', animation: `${styles.spin} 5s infinite linear` }}>
      <div style={{ position: 'absolute', left: 'calc(50% - 5px)', top: 'calc(50% - 2px)', transform: 'rotateZ(0deg) translate(0, -10px)', width: 0, height: 0, "border-left": '5px solid transparent', "border-right": '5px solid transparent', "border-top": '5px solid hsl(0, 0%, 50%)' }} />
      <div style={{ position: 'absolute', left: 'calc(50% - 5px)', top: 'calc(50% - 2px)', transform: 'rotateZ(60deg) translate(0, -10px)', width: 0, height: 0, "border-left": '5px solid transparent', "border-right": '5px solid transparent', "border-top": '5px solid hsl(0, 0%, 50%)' }} />
      <div style={{ position: 'absolute', left: 'calc(50% - 5px)', top: 'calc(50% - 2px)', transform: 'rotateZ(120deg) translate(0, -10px)', width: 0, height: 0, "border-left": '5px solid transparent', "border-right": '5px solid transparent', "border-top": '5px solid hsl(0, 0%, 50%)' }} />
      <div style={{ position: 'absolute', left: 'calc(50% - 5px)', top: 'calc(50% - 2px)', transform: 'rotateZ(180deg) translate(0, -10px)', width: 0, height: 0, "border-left": '5px solid transparent', "border-right": '5px solid transparent', "border-top": '5px solid hsl(0, 0%, 50%)' }} />
      <div style={{ position: 'absolute', left: 'calc(50% - 5px)', top: 'calc(50% - 2px)', transform: 'rotateZ(240deg) translate(0, -10px)', width: 0, height: 0, "border-left": '5px solid transparent', "border-right": '5px solid transparent', "border-top": '5px solid hsl(0, 0%, 50%)' }} />
      <div style={{ position: 'absolute', left: 'calc(50% - 5px)', top: 'calc(50% - 2px)', transform: 'rotateZ(300deg) translate(0, -10px)', width: 0, height: 0, "border-left": '5px solid transparent', "border-right": '5px solid transparent', "border-top": '5px solid hsl(0, 0%, 50%)' }} />
      <div style={{ position: 'absolute', width: '17px', height: '17px', left: 'calc(50%)', top: 'calc(50%)', transform: 'translate(-50%, -50%)', background: 'black', "border-radius": '9999px' }} />
    </div>
  );
}

function Dial(props: {
  size: number;
  onValueChange?: (value: number) => void;
}) {
  const [value, setValue] = createSignal<number>(0.5);
  const [firstEvent, setFirstEvent] = createSignal<PointerEvent>();

  let _value: number;

  const handlePointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);

    _value = value() * 270;

    setFirstEvent(event);
  };

  const handlePointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (event) => {
    const _firstEvent = firstEvent();

    if (_firstEvent) {
      const value = Math.max(0, Math.min(270, _value + (_firstEvent.clientY - event.clientY))) / 270;

      setValue(value);

      props.onValueChange?.(value);
    }
  };

  const handlePointerUp: JSX.EventHandler<HTMLDivElement, PointerEvent> = () => {
    setFirstEvent(undefined);
  };

  return (
    <div
      class="flex border rounded-full border-neutral-900 xring-2 ring-black justify-center shadow-lg"
      style={{
        width: `${props.size}px`,
        height: `${props.size}px`,
        background: 'radial-gradient(hsl(0, 0%, 0%), hsl(0, 0%, 5%))', 'box-shadow': '0 5px 10px hsla(0, 0%, 0%, 0.5), 0 0 0 2px hsl(0, 0%, 0%)',
        transform: `rotate(${value() * 270 - 135}deg)`
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div class="bg-sky-400" style={{ width: '3px', height: '20px' }} />
    </div>
  );
}

const lcdBackground = 'no-repeat linear-gradient(180deg, hsl(0, 0%, 0%), hsl(0, 0%, 5%) 50px, hsl(0, 0%, 0%) 150px)';

function DATPlayer(props: {
  songTitle?: string;
  songArtist?: string;
  albumTitle?: string;
  bitsPerSample?: number;
  songDuration?: number;
  onPlayPause?: () => void;
}) {
  const [isPowerOn, setIsPowerOn] = createSignal(true);

  return (
    <div>
      <div
        style={{
          width: '1400px',
          background: 'url(metal.png) no-repeat',
          // background: 'repeat 0 0 / 100% 1px linear-gradient(hsl(0, 0%, 0%) 0px, hsl(0, 0%, 5%) 1px, hsl(0, 0%, 0%) 0.5px)',
          border: '2px solid black', 'border-radius': '0px', 'border-top': '2px solid hsl(0, 0%, 10%)'
        }}
        class="flex flex-row"
      >
        <div style={{ padding: '25px 35px' }}>
          <PowerButton isPowerOn={isPowerOn()} setIsPowerOn={setIsPowerOn} />
        </div>
        <div class="flex flex-col" style={{ width: '600px', padding: '25px', background: lcdBackground, 'border-left': '2px solid black', 'border-right': '2px solid black' }}>
          <div class="flex flex-col text-sky-400" style={{ gap: '25px', visibility: !isPowerOn() ? 'hidden' : undefined }}>
            <div class="text-xl" style={{ 'line-height': 1 }}>{props.bitsPerSample} BIT &nbsp; 96 KHZ</div>
            <div class="flex flex-col" style={{ gap: '5px' }}>
              <div class="text-2xl" style={{ 'line-height': 1, "text-transform": 'uppercase' }}>{props.songTitle}</div>
              <div class="text-xl" style={{ 'line-height': 1, "text-transform": 'uppercase', "white-space": 'nowrap', overflow: 'hidden', "text-overflow": 'ellipsis', opacity: 0.5 }}>{props.songArtist} — {props.albumTitle}</div>
            </div>
            <div class="flex flex-col" style={{ gap: '10px' }}>
              <div class="bg-sky-400" style={{ height: '2px' }} />
              <div class="flex justify-between">
                <div style={{ 'line-height': 1 }}>0:00</div>
                <div style={{ 'line-height': 1 }}>{Math.floor(props.songDuration / 60)}:{`${Math.floor(props.songDuration % 60)}`.padStart(2, '0')}</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '25px 35px' }}>
          <div style={{ width: '80px', height: '50px', border: '2px solid black', 'border-radius': '4px' }} class="flex justify-center items-center bg-neutral-950" onClick={() => props.onPlayPause?.()}>
            ▶
          </div>
        </div>
        <div class="flex-1" />
        <div class="flex" style={{ padding: '25px 35px' }}>
          <div class="flex" style={{ "align-items": 'flex-start', width: '270px', border: '2px solid black', padding: '20px 60px 0px 60px' }}>
            <div class="flex flex-1 justify-between" style={{ background: 'black', padding: '10px' }}>
              <TapeGear />
              <TapeGear />
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '0 75px' }} class="flex justify-between">
        <div style={{ width: '150px', height: '20px', background: 'linear-gradient(90deg, hsl(0, 0%, 0%), hsl(0, 0%, 5%), hsl(0, 0%, 0%))', 'border-left': '1px solid hsl(0, 0%, 2%)', 'border-right': '1px solid hsl(0, 0%, 2%)' }} />
        <div style={{ width: '150px', height: '20px', background: 'linear-gradient(90deg, hsl(0, 0%, 0%), hsl(0, 0%, 5%), hsl(0, 0%, 0%))', 'border-left': '1px solid hsl(0, 0%, 2%)', 'border-right': '1px solid hsl(0, 0%, 2%)' }} />
      </div>
    </div>
  );
}

function Equalizer(props: {
  songTitle?: string;
  songArtist?: string;
  albumTitle?: string;
  bitsPerSample?: number;
  songDuration?: number;
  onPlayPause?: () => void;
}) {
  const [isPowerOn, setIsPowerOn] = createSignal(true);

  let lcdRef: HTMLCanvasElement;
  let frequencies = Array.from({ length: 20 }, () => 1.0);
  let peakFrequencies = Array.from({ length: 20 }, () => 0.0);
  let canvasInterval: ReturnType<typeof setInterval>;

  createEffect(() => {
    if (!isPowerOn()) {
      clearInterval(canvasInterval);

      var context = lcdRef.getContext("2d");

      if (context) {
        context.clearRect(0, 0, 546, 118);
      }

      return;
    }

    if (lcdRef) {
      var context = lcdRef.getContext("2d");

      if (context) {
        context.fillStyle = '#38BDF8';

        for (let i = 0; i < frequencies.length; ++i) {
          frequencies[i] = 1.0;
        }

        let interval = setInterval(() => {
          context.clearRect(0, 0, 546, 118);

          for (let [index, freq] of frequencies.entries()) {
            for (let i = 0; i < freq * 23; ++i) {
              context.fillRect(index * 15, 66 - (i * 3), 10, 2);
            }
          }

          for (let i = 0; i < frequencies.length; ++i) {
            frequencies[i] = frequencies[i] - (1 / 22);
          }

          if (frequencies[0] <= 0) {
            clearInterval(interval);
          }
        }, 50);
      }

      setTimeout(() => {
        canvasInterval = setInterval(() => {
          if (!context) {
            return;
          }

          for (let i = 0; i < 20; ++i) {
            frequencies[i] = (frequencies[i] * 2 + Math.random()) / 3;

            // if (frequencies[i] > peakFrequencies[i]) {
            //   peakFrequencies[i] = frequencies[i];
            // }
          }

          context.clearRect(0, 0, 546, 118);

          for (let [index, freq] of frequencies.entries()) {
            // context.fillRect(index * 15, 66 - (Math.floor(peakFrequencies[index] * 23 * 3)), 10, 2);

            for (let i = 0; i < freq * 23; ++i) {
              context.fillRect(index * 15, 66 - (i * 3), 10, 2);
            }
          }
        }, 100);
      }, 1500);

      setInterval(() => {
        for (let i = 0; i < 20; ++i) {
          if (frequencies[i] < peakFrequencies[i]) {
            peakFrequencies[i] = peakFrequencies[i] - 23 / 1;
          }
        }
      }, 1000);
    }
  });

  return (
    <div>
      <div style={{ width: '1400px', xheight: '240px', background: 'url(metal.png) no-repeat', border: '2px solid black', 'border-radius': '0px', 'border-top': '2px solid hsl(0, 0%, 10%)' }} class="flex flex-row">
        <div style={{ padding: '25px 35px' }}>
          <PowerButton isPowerOn={isPowerOn()} setIsPowerOn={setIsPowerOn} />
        </div>
        <div class="flex flex-col" style={{ width: '600px', padding: '25px', background: lcdBackground, 'border-left': '2px solid black', 'border-right': '2px solid black' }}>
          <canvas ref={lcdRef} height="65px" />
          {/* <div class="flex flex-col text-sky-400" style={{ gap: '25px', visibility: !isPowerOn() ? 'hidden' : undefined }}>
            <div class="text-xl" style={{ 'line-height': 1 }}>{props.bitsPerSample} BIT &nbsp; 96 KHZ</div>
            <div class="flex flex-col" style={{ gap: '5px' }}>
              <div class="text-2xl" style={{ 'line-height': 1, "text-transform": 'uppercase' }}>{props.songTitle}</div>
              <div class="text-xl" style={{ 'line-height': 1, "text-transform": 'uppercase', "white-space": 'nowrap', overflow: 'hidden', "text-overflow": 'ellipsis', opacity: 0.5 }}>{props.songArtist} — {props.albumTitle}</div>
            </div>
            <div class="flex flex-col" style={{ gap: '10px' }}>
              <div class="bg-sky-400" style={{ height: '2px' }} />
              <div class="flex justify-between">
                <div style={{ 'line-height': 1 }}>0:00</div>
                <div style={{ 'line-height': 1 }}>{Math.floor(props.songDuration / 60)}:{`${Math.floor(props.songDuration % 60)}`.padStart(2, '0')}</div>
              </div>
            </div>
          </div> */}
        </div>
        <div class="flex flex-col" style={{ padding: '25px 35px', gap: '20px' }}>
          <div>
            hello
          </div>
          <div class="flex" style={{ gap: '35px' }}>
            <Dial size={75} />
            <Dial size={75} />
            <Dial size={75} />
            <Dial size={75} />
            <Dial size={75} />
          </div>
        </div>
      </div>
      <div style={{ padding: '0 75px' }} class="flex justify-between">
        <div style={{ width: '150px', height: '20px', background: 'linear-gradient(90deg, hsl(0, 0%, 0%), hsl(0, 0%, 5%), hsl(0, 0%, 0%))', 'border-left': '1px solid hsl(0, 0%, 2%)', 'border-right': '1px solid hsl(0, 0%, 2%)' }} />
        <div style={{ width: '150px', height: '20px', background: 'linear-gradient(90deg, hsl(0, 0%, 0%), hsl(0, 0%, 5%), hsl(0, 0%, 0%))', 'border-left': '1px solid hsl(0, 0%, 2%)', 'border-right': '1px solid hsl(0, 0%, 2%)' }} />
      </div>
    </div>
  );
}

function Receiver(props: {
  songTitle?: string;
  songArtist?: string;
  albumTitle?: string;
  bitsPerSample?: number;
  songDuration?: number;
  onPlayPause?: () => void;
  onVolumeChange?: (volume: number) => void;
}) {
  const [isPowerOn, setIsPowerOn] = createSignal(true);

  return (
    <div>
      <div style={{ width: '1400px', height: '240px', background: 'url(metal.png) no-repeat', border: '2px solid black', 'border-radius': '0px', 'border-top': '2px solid hsl(0, 0%, 10%)' }} class="flex flex-row">
        <div style={{ padding: '25px 35px' }}>
          <PowerButton isPowerOn={isPowerOn()} setIsPowerOn={setIsPowerOn} />
        </div>
        <div class="flex flex-col" style={{ width: '600px', padding: '25px', background: lcdBackground, 'border-left': '2px solid black', 'border-right': '2px solid black' }}>
          {/* <div class="flex flex-col text-sky-400" style={{ gap: '25px', visibility: !isPowerOn() ? 'hidden' : undefined }}>
            <div class="text-xl" style={{ 'line-height': 1 }}>{props.bitsPerSample} BIT &nbsp; 96 KHZ</div>
            <div class="flex flex-col" style={{ gap: '5px' }}>
              <div class="text-2xl" style={{ 'line-height': 1, "text-transform": 'uppercase' }}>{props.songTitle}</div>
              <div class="text-xl" style={{ 'line-height': 1, "text-transform": 'uppercase', "white-space": 'nowrap', overflow: 'hidden', "text-overflow": 'ellipsis', opacity: 0.5 }}>{props.songArtist} — {props.albumTitle}</div>
            </div>
            <div class="flex flex-col" style={{ gap: '10px' }}>
              <div class="bg-sky-400" style={{ height: '2px' }} />
              <div class="flex justify-between">
                <div style={{ 'line-height': 1 }}>0:00</div>
                <div style={{ 'line-height': 1 }}>{Math.floor(props.songDuration / 60)}:{`${Math.floor(props.songDuration % 60)}`.padStart(2, '0')}</div>
              </div>
            </div>
          </div> */}
        </div>
        <div style={{ padding: '25px' }}>
          <div style={{ width: '80px', height: '50px', border: '2px solid black', 'border-radius': '4px' }} class="flex justify-center items-center bg-neutral-950" onClick={() => props.onPlayPause?.()}>
          </div>
        </div>
        <div class="flex-1" />
        <div style={{ padding: '25px 35px' }}>
          <Dial size={150} onValueChange={props.onVolumeChange} />
        </div>
      </div>
      <div style={{ padding: '0 75px' }} class="flex justify-between">
        <div style={{ width: '150px', height: '20px', background: 'linear-gradient(90deg, hsl(0, 0%, 0%), hsl(0, 0%, 5%), hsl(0, 0%, 0%))', 'border-left': '1px solid hsl(0, 0%, 2%)', 'border-right': '1px solid hsl(0, 0%, 2%)' }} />
        <div style={{ width: '150px', height: '20px', background: 'linear-gradient(90deg, hsl(0, 0%, 0%), hsl(0, 0%, 5%), hsl(0, 0%, 0%))', 'border-left': '1px solid hsl(0, 0%, 2%)', 'border-right': '1px solid hsl(0, 0%, 2%)' }} />
      </div>
    </div>
  );
}

function App() {
  const [count, setCount] = createSignal(0);
  const [isPlaying, setIsPlaying] = createSignal(true);

  const [songTitle, setSongTitle] = createSignal<string>('—');
  const [songArtist, setSongArtist] = createSignal<string>('');
  const [albumTitle, setAlbumTitle] = createSignal<string>(' ');

  const [bitsPerSample, setBitsPerSample] = createSignal<number>();
  const [songDuration, setSongDuration] = createSignal<number>();

  let volumeSlider: HTMLInputElement;

  let audioContext: AudioContext;
  let track: MediaElementAudioSourceNode;
  let gainNode: GainNode;
  let biquadFilterNode: BiquadFilterNode;

  function play() {
    const audioElement = document.querySelector("audio");

    if (!audioContext && audioElement) {
      audioContext = new AudioContext();

      track = audioContext.createMediaElementSource(audioElement);

      console.log(track);

      gainNode = audioContext.createGain();
      biquadFilterNode = audioContext.createBiquadFilter();

      console.log('gainNode.gain.maxValue', gainNode.gain.maxValue);
      console.log('biquadFilterNode.gain.maxValue', biquadFilterNode.gain.maxValue);
      console.log('biquadFilterNode.Q.maxValue', biquadFilterNode.Q.maxValue);

      biquadFilterNode.type = 'peaking';
      biquadFilterNode.frequency.value = 1000;
      biquadFilterNode.gain.value = -20;
      biquadFilterNode.Q.value = 1;

      track
        .connect(gainNode)
        .connect(biquadFilterNode)
        .connect(audioContext.destination);
    }

    if (audioElement) {
      if (isPlaying()) {
        audioElement.pause();

        setIsPlaying(false);

        return;
      }

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      audioElement.play();

      setIsPlaying(true);
    }
  }

  createEffect(async () => {
    const metadata = await musicMetadata.fetchFromUrl('Waitin  for the Bus.flac', {});

    setSongTitle(metadata.common.title);
    setSongArtist(metadata.common.artist);
    setAlbumTitle(metadata.common.album);
    setBitsPerSample(metadata.format.bitsPerSample);
    setSongDuration(metadata.format.duration);

    console.log(metadata);
  });

  const handleVolumeValueChange = (volume: number) => {
    gainNode.gain.value = volume;
  };

  return (
    <>
      <audio src="Waitin  for the Bus.flac"></audio>
      <div style={{ flex: 1 }} />
      <DATPlayer
        songTitle={songTitle()}
        songArtist={songArtist()}
        albumTitle={albumTitle()}
        bitsPerSample={bitsPerSample()}
        songDuration={songDuration()}
        onPlayPause={play}
      />
      <Equalizer />
      <Receiver onVolumeChange={handleVolumeValueChange} />
    </>
  );
}

export default App;
