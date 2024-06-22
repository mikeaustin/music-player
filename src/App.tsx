import { createEffect, createSignal, splitProps } from 'solid-js';
import * as musicMetadata from 'music-metadata-browser';
import { Buffer } from 'buffer';
import process from 'process';

import './App.css';

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

function Component(props: {
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
      <div style={{ width: '1400px', height: '240px', background: 'url(metal.png) no-repeat', border: '2px solid black', 'border-radius': '0px', 'border-top': '2px solid hsl(0, 0%, 10%)' }} class="flex flex-row">
        <div style={{ padding: '25px 35px' }}>
          <PowerButton isPowerOn={isPowerOn()} setIsPowerOn={setIsPowerOn} />
        </div>
        <div class="flex flex-col" style={{ width: '600px', padding: '25px', background: 'no-repeat 0px 0px / 600px 300px linear-gradient(180deg, hsl(0, 0%, 0%), hsl(0, 0%, 5%) 75px, hsl(0, 0%, 0%))', 'border-left': '2px solid black', 'border-right': '2px solid black' }}>
          <div class="flex flex-col text-sky-400" style={{ gap: '25px', visibility: !isPowerOn() ? 'hidden' : undefined }}>
            <div class="text-xl" style={{ 'line-height': 1 }}>{props.bitsPerSample} BIT &nbsp; 96 KHZ</div>
            <div class="flex flex-col" style={{ gap: '5px' }}>
              <div class="text-2xl" style={{ 'line-height': 1 }}>{props.songTitle}</div>
              <div class="text-xl" style={{ 'line-height': 1, "white-space": 'nowrap', overflow: 'hidden', "text-overflow": 'ellipsis', opacity: 0.5 }}>{props.songArtist} — {props.albumTitle}</div>
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
        <div style={{ padding: '25px' }}>
          <div style={{ width: '80px', height: '50px', border: '2px solid black', 'border-radius': '4px' }} class="flex justify-center items-center bg-neutral-950" onClick={() => props.onPlayPause?.()}>
            ▶
          </div>
        </div>
        <div class="flex-1" />
        <div style={{ padding: '25px 35px' }}>
          <div class="flex border rounded-full border-neutral-900 xring-2 ring-black justify-center shadow-lg" style={{ width: '150px', height: '150px', background: 'radial-gradient(hsl(0, 0%, 0%), hsl(0, 0%, 5%))', 'box-shadow': '0 5px 10px hsla(0, 0%, 0%, 0.5), 0 0 0 2px hsl(0, 0%, 0%)' }}>
            <div class="bg-sky-400" style={{ width: '3px', height: '20px' }} />
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

function App() {
  const [count, setCount] = createSignal(0);
  const [isPlaying, setIsPlaying] = createSignal(false);

  const [songTitle, setSongTitle] = createSignal<string>();
  const [songArtist, setSongArtist] = createSignal<string>();
  const [albumTitle, setAlbumTitle] = createSignal<string>();

  const [bitsPerSample, setBitsPerSample] = createSignal<number>();
  const [songDuration, setSongDuration] = createSignal<number>();

  let volumeSlider: HTMLInputElement;

  let audioContext: AudioContext;
  let track: MediaElementAudioSourceNode;
  let gainNode: GainNode;

  function play() {
    const audioElement = document.querySelector("audio");

    if (!audioContext && audioElement) {
      audioContext = new AudioContext();

      track = audioContext.createMediaElementSource(audioElement);

      console.log(track);

      gainNode = audioContext.createGain();

      track.connect(gainNode).connect(audioContext.destination);
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
    console.log(volumeSlider);

    const metadata = await musicMetadata.fetchFromUrl('Waitin  for the Bus.flac', {});

    setSongTitle(metadata.common.title);
    setSongArtist(metadata.common.artist);
    setAlbumTitle(metadata.common.album);
    setBitsPerSample(metadata.format.bitsPerSample);
    setSongDuration(metadata.format.duration);

    console.log(metadata);
  });

  return (
    <>
      <audio src="Waitin  for the Bus.flac"></audio>
      <div class="card">
        <button onClick={() => play()}>
          {isPlaying() ? <>Stop</> : <>Play</>}
        </button>
        &nbsp;
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        <input type="range" id="volume" min="0" max="2" value="1" step="0.1" onInput={event => { gainNode.gain.value = Number(event.currentTarget.value); }} />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <div style={{ flex: 1 }} />

      <Component
        songTitle={songTitle()}
        songArtist={songArtist()}
        albumTitle={albumTitle()}
        bitsPerSample={bitsPerSample()}
        songDuration={songDuration()}
        onPlayPause={play}
      />
      <Component />
    </>
  );
}

export default App;
