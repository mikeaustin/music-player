import { ComponentProps, JSX, JSXElement, createEffect, createSignal, splitProps } from 'solid-js';
import * as musicMetadata from 'music-metadata-browser';
import { Buffer } from 'buffer';
import process from 'process';

import './App.css';

import datTape from './assets/dat-tape.png';
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
  isPlaying: boolean;
}) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-27px', left: '-27px', width: '89px', height: '89px', xbackground: 'red', border: '20px solid hsl(0, 0%, 4%)', "border-radius": '9999px' }} />

      <div style={{ position: 'relative', width: '35px', height: '35px', border: '3px solid hsl(0, 0%, 50%)', "border-radius": '9999px', animation: props.isPlaying ? `${styles.spin} 10s infinite linear` : undefined }}>
        <div style={{ position: 'absolute', left: 'calc(50% - 5px)', top: 'calc(50% - 2.5px)', transform: 'rotateZ(0deg) translate(0, -13px)', width: 0, height: 0, "border-left": '5px solid transparent', "border-right": '5px solid transparent', "border-top": '5px solid hsl(0, 0%, 50%)' }} />
        <div style={{ position: 'absolute', left: 'calc(50% - 5px)', top: 'calc(50% - 2.5px)', transform: 'rotateZ(60deg) translate(0, -13px)', width: 0, height: 0, "border-left": '5px solid transparent', "border-right": '5px solid transparent', "border-top": '5px solid hsl(0, 0%, 50%)' }} />
        <div style={{ position: 'absolute', left: 'calc(50% - 5px)', top: 'calc(50% - 2.5px)', transform: 'rotateZ(120deg) translate(0, -13px)', width: 0, height: 0, "border-left": '5px solid transparent', "border-right": '5px solid transparent', "border-top": '5px solid hsl(0, 0%, 50%)' }} />
        <div style={{ position: 'absolute', left: 'calc(50% - 5px)', top: 'calc(50% - 2.5px)', transform: 'rotateZ(180deg) translate(0, -13px)', width: 0, height: 0, "border-left": '5px solid transparent', "border-right": '5px solid transparent', "border-top": '5px solid hsl(0, 0%, 50%)' }} />
        <div style={{ position: 'absolute', left: 'calc(50% - 5px)', top: 'calc(50% - 2.5px)', transform: 'rotateZ(240deg) translate(0, -13px)', width: 0, height: 0, "border-left": '5px solid transparent', "border-right": '5px solid transparent', "border-top": '5px solid hsl(0, 0%, 50%)' }} />
        <div style={{ position: 'absolute', left: 'calc(50% - 5px)', top: 'calc(50% - 2.5px)', transform: 'rotateZ(300deg) translate(0, -13px)', width: 0, height: 0, "border-left": '5px solid transparent', "border-right": '5px solid transparent', "border-top": '5px solid hsl(0, 0%, 50%)' }} />
        <div style={{ position: 'absolute', width: '23px', height: '23px', left: 'calc(50%)', top: 'calc(50%)', transform: 'translate(-50%, -50%)', background: 'black', "border-radius": '9999px' }} />

        <div style={{ position: 'absolute', left: 'calc(50% - 1px)', top: 'calc(50% - 3px)', transform: 'rotateZ(0deg) translate(0, -20px)', width: '2px', height: '6px', background: 'hsl(0, 0%, 50%)' }} />
        <div style={{ position: 'absolute', left: 'calc(50% - 1px)', top: 'calc(50% - 3px)', transform: 'rotateZ(45deg) translate(0, -20px)', width: '2px', height: '6px', background: 'hsl(0, 0%, 50%)' }} />
        <div style={{ position: 'absolute', left: 'calc(50% - 1px)', top: 'calc(50% - 3px)', transform: 'rotateZ(90deg) translate(0, -20px)', width: '2px', height: '6px', background: 'hsl(0, 0%, 50%)' }} />
        <div style={{ position: 'absolute', left: 'calc(50% - 1px)', top: 'calc(50% - 3px)', transform: 'rotateZ(135deg) translate(0, -20px)', width: '2px', height: '6px', background: 'hsl(0, 0%, 50%)' }} />
        <div style={{ position: 'absolute', left: 'calc(50% - 1px)', top: 'calc(50% - 3px)', transform: 'rotateZ(180deg) translate(0, -20px)', width: '2px', height: '6px', background: 'hsl(0, 0%, 50%)' }} />
        <div style={{ position: 'absolute', left: 'calc(50% - 1px)', top: 'calc(50% - 3px)', transform: 'rotateZ(225deg) translate(0, -20px)', width: '2px', height: '6px', background: 'hsl(0, 0%, 50%)' }} />
        <div style={{ position: 'absolute', left: 'calc(50% - 1px)', top: 'calc(50% - 3px)', transform: 'rotateZ(270deg) translate(0, -20px)', width: '2px', height: '6px', background: 'hsl(0, 0%, 50%)' }} />
        <div style={{ position: 'absolute', left: 'calc(50% - 1px)', top: 'calc(50% - 3px)', transform: 'rotateZ(315deg) translate(0, -20px)', width: '2px', height: '6px', background: 'hsl(0, 0%, 50%)' }} />

        <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '49px', height: '49px', border: '2px solid hsl(0, 0%, 50%)', "border-radius": '9999px' }} />
      </div>
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

    _value = value();

    setFirstEvent(event);
  };

  const handlePointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (event) => {
    const _firstEvent = firstEvent();

    if (_firstEvent) {
      const value = Math.max(0.0, Math.min(1.0, _value + (_firstEvent.clientY - event.clientY) / 270));

      setValue(value);

      props.onValueChange?.(value);
    }
  };

  const handlePointerUp: JSX.EventHandler<HTMLDivElement, PointerEvent> = () => {
    setFirstEvent(undefined);
  };

  const handleWheel: JSX.EventHandler<HTMLDivElement, WheelEvent> = (event) => {
    _value = value();

    const value2 = Math.max(0.0, Math.min(1.0, _value - Math.sign(event.deltaY) / 50));

    setValue(value2);

    props.onValueChange?.(value2);
  };

  return (
    <div class="flex" style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          "border-radius": '9999px',
          'box-shadow': '0 5px 10px hsla(0, 0%, 0%, 0.5), 0 0 0 2px hsl(0, 0%, 0%)',
        }}
      />
      <div
        class="flex border rounded-full border-neutral-900 justify-center"
        style={{
          width: `${props.size}px`,
          height: `${props.size}px`,
          background: 'radial-gradient(hsl(0, 0%, 2%), hsl(0, 0%, 5%))',
          transform: `rotate(${value() * 270 - 135}deg)`
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      >
        <div class="bg-sky-400" style={{ width: '3px', height: '20px' }} />
      </div>
    </div>
  );
}

const lcdBackground = 'no-repeat 0 0 / 100% 300px linear-gradient(180deg, hsl(0, 0%, 0%), hsl(0, 0%, 5%) 50px, hsl(0, 0%, 0%) 150px)';
const lcdBackground2 = 'no-repeat 0 0 / 100% 300px linear-gradient(180deg, hsla(0, 0%, 0%, 0.0), hsla(0, 0%, 100%, 0.05) 50px, hsla(0, 0%, 0%, 0.0) 150px)';

function Component(props: {
  children: JSXElement;
  style?: JSX.CSSProperties; // ComponentProps<'div'>['style']
}) {
  const [local, rest] = splitProps(props, ['children', 'style']);

  let parentRef: HTMLDivElement;
  let canvasRef: HTMLCanvasElement;

  createEffect(() => {
    canvasRef.width = parentRef.offsetWidth;
    canvasRef.height = parentRef.offsetHeight;

    var context = canvasRef.getContext("2d");

    if (context) {
      for (let y = 0; y < canvasRef.height; ++y) {
        context.beginPath();

        context.lineWidth = window.devicePixelRatio;

        context.strokeStyle = Math.random() > 0.5 ? 'hsl(0, 0%, 2.9%)' : 'hsl(0, 0%, 3%)';
        // context.strokeStyle = y % 2 === 0 ? 'hsl(0, 0%, 0%)' : 'hsl(0, 0%, 5%)';

        context.moveTo(0, y - 4);
        context.lineTo(canvasRef.width - 4, y - 4);

        context.stroke();
      }
    }
  });

  return (
    <div class="flex flex-col" style={{ width: '1400px' }}>
      <div
        ref={parentRef}
        class="flex flex-row"
        style={{
          position: 'relative',
          width: '1400px',
          // background: 'url(metal.png) no-repeat',
          // background: 'repeat 0 0 / 100% 1px linear-gradient(hsl(0, 0%, 0%) 0px, hsl(0, 0%, 5%) 1px, hsl(0, 0%, 0%) 0.5px)',
          border: '2px solid black', 'border-radius': '0px', 'border-top': '2px solid hsl(0, 0%, 10%)',
          ...props.style
        }}
        {...rest}
      >
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
        <div class="flex flex-1 flex-row" style={{ position: 'relative' }}>
          {props.children}
        </div>
      </div>
      <div style={{ padding: '0 75px' }} class="flex justify-between">
        <div style={{ width: '150px', height: '20px', background: 'linear-gradient(90deg, hsl(0, 0%, 0%), hsl(0, 0%, 5%), hsl(0, 0%, 0%))', 'border-left': '1px solid hsl(0, 0%, 2%)', 'border-right': '1px solid hsl(0, 0%, 2%)' }} />
        <div style={{ width: '150px', height: '20px', background: 'linear-gradient(90deg, hsl(0, 0%, 0%), hsl(0, 0%, 5%), hsl(0, 0%, 0%))', 'border-left': '1px solid hsl(0, 0%, 2%)', 'border-right': '1px solid hsl(0, 0%, 2%)' }} />
      </div>
    </div>
  );
}

function DATPlayer(props: {
  songTitle?: string;
  songArtist?: string;
  albumTitle?: string;
  isPlaying: boolean;
  bitsPerSample?: number;
  sampleRate?: number;
  channelsCount?: number;
  songDuration?: number;
  onPlayPause?: () => void;
}) {
  const [isPowerOn, setIsPowerOn] = createSignal(true);

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.items[0].getAsFile();

    console.log(file);
  };

  const handleDragOver = (event) => {
    // console.log(event);

    event.preventDefault();
  };

  return (
    <Component onDrop={handleDrop} onDragOver={handleDragOver}>
      <div style={{ padding: '25px 35px' }}>
        <PowerButton isPowerOn={isPowerOn()} setIsPowerOn={setIsPowerOn} />
      </div>
      <div class="flex flex-col" style={{ width: '600px', padding: '25px', background: lcdBackground, 'border-left': '2px solid black', 'border-right': '2px solid black' }}>
        <div class="flex flex-col text-sky-400" style={{ gap: '25px', visibility: !isPowerOn() ? 'hidden' : undefined }}>
          <div class="flex justify-between">
            <div class="text-xl" style={{ 'line-height': 1 }}>
              {props.bitsPerSample} BIT &nbsp; {props.sampleRate / 1000} KHZ
            </div>
            <div class="text-xl" style={{ 'line-height': 1 }}>
              {props.channelsCount === 2 ? 'STEREO' : 'MONO'}
            </div>
          </div>
          <div class="flex flex-col" style={{ gap: '5px' }}>
            <div class="text-2xl" style={{ 'line-height': 1, "text-transform": 'uppercase' }}>
              {props.songTitle}
            </div>
            <div class="text-xl" style={{ 'line-height': 1, "text-transform": 'uppercase', "white-space": 'nowrap', overflow: 'hidden', "text-overflow": 'ellipsis' }}>
              {props.songArtist} — {props.albumTitle}
            </div>
          </div>
          <div class="flex flex-col" style={{ gap: '10px' }}>
            <div class="bg-sky-400" style={{ height: '2px' }} />
            <div class="flex justify-between">
              <div style={{ 'line-height': 1 }}>
                0:00
              </div>
              <div style={{ 'line-height': 1 }}>
                {Math.floor(props.songDuration / 60)}:{`${Math.floor(props.songDuration % 60)}`.padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '25px 35px' }}>
        <button style={{ width: '80px', height: '50px', border: '2px solid black', 'border-radius': '4px', padding: '10px', background: 'linear-gradient(180deg, hsl(0, 0%, 5%), hsl(0, 0%, 3%))' }} class="flex justify-center bg-neutral-950 active:brightness-75 group" onClick={() => props.onPlayPause?.()}>
          ▶
        </button>
      </div>
      <div class="flex-1" />
      <div class="flex" style={{ padding: '0 35px' }}>
        <div class="flex" style={{ position: 'relative', "align-items": 'flex-start', width: '270px', 'border-left': '2px solid black', 'border-right': '2px solid black', padding: '40px 30px 0px 30px', background: 'black' }}>
          <div class="flex flex-1 justify-between" style={{ padding: '15px 35px' }}>
            <TapeGear isPlaying={props.isPlaying} />
            <TapeGear isPlaying={props.isPlaying} />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'url(metal.png)',
              'clip-path': `
                polygon(evenodd,
                  /* outer rect */
                  0 0, /* top - left */
                  100% 0, /* top - right */
                  100% 100%, /* bottom - right */
                  0% 100%, /* bottom - left */
                  0 0, /* and top - left again */
                  /* do the same with inner rect */
                  calc(0% + 25px) calc(0% + 40px),
                  calc(100% - 25px) calc(0% + 40px),
                  calc(100% - 25px) calc(105px),
                  calc(0% + 25px) calc(105px),
                  calc(0% + 25px) calc(0% + 40px)
                )
            `
            }}
          />
          <div style={{ position: 'absolute', left: '25px', top: '40px', width: '215px', height: '65px', background: lcdBackground2, border: '2px solid black', "border-radius": '3px' }} />
        </div>
      </div>
      {/* <img src={datTape} style={{ position: 'absolute', transform: 'rotate(180deg)', height: '177px', top: '10px', right: '49px', opacity: 0.1 }} /> */}
    </Component>
  );
}

function Equalizer(props: {
  isPlaying: boolean;
  songTitle?: string;
  songArtist?: string;
  albumTitle?: string;
  bitsPerSample?: number;
  songDuration?: number;
  analyserNode?: AnalyserNode;
  onPlayPause?: () => void;
}) {
  const [isPowerOn, setIsPowerOn] = createSignal(true);

  let lcdRef: HTMLCanvasElement;
  let frequencies = Array.from({ length: 10 }, () => 1.0);
  let canvasInterval: ReturnType<typeof setInterval>;

  createEffect(() => {
    if (!isPowerOn() || !props.isPlaying) {
      clearInterval(canvasInterval);

      var context = lcdRef.getContext("2d");

      if (context) {
        context.clearRect(0, 0, 546, 118);
      }

      return;
    }

    if (!lcdRef) {
      return;
    }

    var context = lcdRef.getContext("2d");

    if (!context) {
      return;
    }

    context.fillStyle = '#38BDF8';

    for (let i = 0; i < frequencies.length; ++i) {
      frequencies[i] = 1.0;
    }

    const frequencyDataArray2 = props.analyserNode && new Uint8Array(props.analyserNode.frequencyBinCount);

    // let interval = setInterval(() => {
    //   if (!context) {
    //     return;
    //   }

    //   context.clearRect(0, 0, 546, 118);

    //   for (let [index, freq] of frequencies.entries()) {
    //     for (let i = 0; i < freq * 23; ++i) {
    //       context.fillRect(index * 15, 66 - (i * 3), 10, 2);
    //     }
    //   }

    //   for (let i = 0; i < frequencies.length; ++i) {
    //     frequencies[i] = frequencies[i] - (1 / 22);
    //   }

    //   if (frequencies[0] <= 0) {
    //     clearInterval(interval);
    //   }
    // }, 50);

    // setTimeout(() => {

    let lastTimestamp = performance.now();

    const animationFrame = (timestamp: number) => {
      if (timestamp - lastTimestamp > 1000 / 30) {
        // console.log(timestamp);

        if (!context || !frequencyDataArray2) {
          return;
        }

        if (!props.isPlaying) {
          context.clearRect(0, 0, 546, 118);

          return;
        }

        props.analyserNode?.getByteFrequencyData(frequencyDataArray2);

        for (let i = 0; i < 10; ++i) {
          // frequencies[i] = (frequencies[i] * 1 + frequencyDataArray2[Math.floor((2 ** i - 1) * (1 / (41000 / 48000)))] / 255) / 2;
          frequencies[i] = frequencyDataArray2[Math.floor(i / 9 * 1024 * (20000 / 48000))] / 255;
        }

        context.clearRect(0, 0, 546, 118);

        for (let [index, freq] of frequencies.entries()) {
          context.fillStyle = '#38BDF880';
          context.fillRect(index * 25, 118 - 5 - (0 * 5), 20, 3);

          context.fillStyle = '#38BDF8';
          for (let i = 0; i < freq * (118 / 5); ++i) {
            context.fillRect(index * 25, 118 - (i * 5), 20, 3);
          }
        }

        for (let [index, freq] of frequencies.entries()) {
          context.fillStyle = '#38BDF880';
          context.fillRect(index * 25 + 300, 118 - 5 - (0 * 5), 20, 3);

          for (let i = 0; i < freq * (118 / 5); ++i) {
            context.fillStyle = '#38BDF8';
            context.fillRect(index * 25 + 300, 118 - (i * 5), 20, 3);
          }
        }

        lastTimestamp = timestamp;
      }

      requestAnimationFrame(animationFrame);
    };

    requestAnimationFrame(animationFrame);
  });

  return (
    <Component>
      <div style={{ padding: '25px 35px' }}>
        <PowerButton isPowerOn={isPowerOn()} setIsPowerOn={setIsPowerOn} />
      </div>
      <div class="flex flex-col" style={{ width: '600px', padding: '25px', background: lcdBackground, 'border-left': '2px solid black', 'border-right': '2px solid black' }}>
        <canvas ref={lcdRef} width="546" height="118" />
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
    </Component>
  );
}

function Receiver(props: {
  songTitle?: string;
  songArtist?: string;
  albumTitle?: string;
  bitsPerSample?: number;
  songDuration?: number;
  analyserNode?: AnalyserNode;
  onPlayPause?: () => void;
  onVolumeChange?: (volume: number) => void;
}) {
  const [isPowerOn, setIsPowerOn] = createSignal(true);

  let lcdRef: HTMLCanvasElement;
  let currentMax = 0.0;

  createEffect(() => {
    if (!lcdRef) {
      return;
    }

    var context = lcdRef.getContext("2d");

    if (!context) {
      return;
    }

    context.fillStyle = '#38BDF8';

    context.fillRect(0, 0, 10, 2);

    const dataArray = props.analyserNode && new Float32Array(props.analyserNode.frequencyBinCount);

    let lastTimestamp = performance.now();

    const animationFrame = (timestamp: number) => {
      if (timestamp - lastTimestamp > 1000 / 30) {
        if (dataArray && context) {
          props.analyserNode?.getFloatTimeDomainData(dataArray);

          const max = dataArray.reduce((max, value) => Math.max(max, value), 0);

          currentMax = (currentMax * 1 + max) / 2;

          context.clearRect(0, 0, 546, 150);

          for (let volume = 0; volume < currentMax * (246 / 5); ++volume) {
            context.fillStyle = '#38BDF880';
            context.fillRect(0 * 5, 0, 3, 20);
            context.fillRect(0 * 5 + 300, 0, 3, 20);

            context.fillStyle = '#38BDF8';
            context.fillRect(volume * 5, 0, 3, 20);
            context.fillRect(volume * 5 + 300, 0, 3, 20);
          }
        }

        lastTimestamp = timestamp;
      }

      requestAnimationFrame(animationFrame);
    };

    requestAnimationFrame(animationFrame);
  });

  return (
    <Component>
      <div style={{ padding: '25px 35px' }}>
        <PowerButton isPowerOn={isPowerOn()} setIsPowerOn={setIsPowerOn} />
      </div>
      <div class="flex flex-col" style={{ width: '600px', padding: '25px', background: lcdBackground, 'border-left': '2px solid black', 'border-right': '2px solid black' }}>
        <div class="text-2xl  text-sky-400" style={{ 'line-height': 1, "text-transform": 'uppercase' }}>DAT Player</div>
        <div class="flex-1" />
        <canvas ref={lcdRef} width="546" height="20" />
      </div>
      <div style={{ padding: '25px' }}>
        {/* <div style={{ width: '80px', height: '50px', border: '2px solid black', 'border-radius': '4px' }} class="flex justify-center items-center bg-neutral-950" onClick={() => props.onPlayPause?.()}>
        </div> */}
      </div>
      <div class="flex-1" />
      <div style={{ padding: '25px 35px' }}>
        <Dial size={150} onValueChange={props.onVolumeChange} />
      </div>
    </Component>
  );
}

function App() {
  const [isPlaying, setIsPlaying] = createSignal(false);

  const [songTitle, setSongTitle] = createSignal<string>('—');
  const [songArtist, setSongArtist] = createSignal<string>('');
  const [albumTitle, setAlbumTitle] = createSignal<string>(' ');
  const [albumImage, setAlbumImage] = createSignal<string>('x');

  const [bitsPerSample, setBitsPerSample] = createSignal<number>();
  const [sampleRate, setSampleRate] = createSignal<number>();
  const [channelsCount, setChannelsCount] = createSignal<number>();
  const [songDuration, setSongDuration] = createSignal<number>();

  let audioContext: AudioContext;
  let track: MediaElementAudioSourceNode;
  let oscillatorNode: OscillatorNode;
  let gainNode: GainNode;
  let biquadFilterNode: BiquadFilterNode;
  // let analyserNode: AnalyserNode;

  const [analyserNode, setAnalyserNode] = createSignal<AnalyserNode>();

  function play() {
    const audioElement = document.querySelector("audio");

    if (!audioContext && audioElement) {
      audioContext = new AudioContext();

      track = audioContext.createMediaElementSource(audioElement);

      console.log(track);

      oscillatorNode = new OscillatorNode(audioContext);
      gainNode = audioContext.createGain();
      biquadFilterNode = audioContext.createBiquadFilter();
      const _ = audioContext.createAnalyser();
      _.fftSize = 2048;
      _.smoothingTimeConstant = 0.2;
      setAnalyserNode(_);

      oscillatorNode.frequency.value = 20;
      // oscillatorNode.start();

      // setInterval(() => {
      //   oscillatorNode.frequency.value *= 1.01;

      //   console.log(oscillatorNode.frequency.value);
      // }, 100);

      console.log('gainNode.gain.maxValue', gainNode.gain.maxValue);
      console.log('biquadFilterNode.gain.maxValue', biquadFilterNode.gain.maxValue);
      console.log('biquadFilterNode.Q.maxValue', biquadFilterNode.Q.maxValue);

      biquadFilterNode.type = 'peaking';
      biquadFilterNode.frequency.value = 1000;
      biquadFilterNode.gain.value = -20;
      biquadFilterNode.Q.value = 1;

      track
        .connect(gainNode)
        // .connect(biquadFilterNode)
        .connect(analyserNode())
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

  const song = 'Waitin  for the Bus.flac';
  // const song = 'Money for Nothing.flac';
  // const song = 'You Know My Name (From  Casino Royale ).flac';
  // const song = 'Riviera Paradise.flac';
  // const song = 'Message from Home.flac';

  createEffect(async () => {
    const metadata = await musicMetadata.fetchFromUrl(song, {});

    console.log(metadata);

    setSongTitle(metadata.common.title);
    setSongArtist(metadata.common.artist);
    setAlbumTitle(metadata.common.album);
    setBitsPerSample(metadata.format.bitsPerSample);
    setSampleRate(metadata.format.sampleRate);
    setChannelsCount(metadata.format.numberOfChannels);
    setSongDuration(metadata.format.duration);

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setAlbumImage(reader.result);
    });

    reader.readAsDataURL(new Blob([metadata.common.picture[0].data], { type: 'image/jpeg' }));
  });

  const handleVolumeValueChange = (volume: number) => {
    console.log('handleVolumeValueChange', volume);

    gainNode.gain.value = volume;
  };

  return (
    <>
      <audio src={song}></audio>
      <div style={{ flex: 1 }} />
      {/* <img src={albumImage()} width={256} height={256} style={{ "margin-bottom": '20px' }} /> */}
      <DATPlayer
        isPlaying={isPlaying()}
        songTitle={songTitle()}
        songArtist={songArtist()}
        albumTitle={albumTitle()}
        bitsPerSample={bitsPerSample()}
        sampleRate={sampleRate()}
        channelsCount={channelsCount()}
        songDuration={songDuration()}
        onPlayPause={play}
      />
      <Equalizer
        isPlaying={isPlaying()}
        analyserNode={analyserNode()}
      />
      <Receiver
        analyserNode={analyserNode()}
        onVolumeChange={handleVolumeValueChange}
      />
    </>
  );
}

export default App;
