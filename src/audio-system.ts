import wxAudioContext from './core/wx'
import h5AudioContext from './core/h5'

class AudioSystem {
	audio!: typeof wxAudioContext | typeof h5AudioContext

	constructor() {
		this.init()
	}

	private init() {
		// #ifdef MP-WEIXIN
		this.audio = wxAudioContext
		// #endif

		// #ifdef H5
		this.audio = h5AudioContext
		// #endif
	}

	onPlay(cb: (res?: any) => void) {
		this.audio.onPlay(cb)
	}

	onPause(cb: (res?: any) => void) {
		this.audio.onPause(cb)
	}

	onStop(cb: (res?: any) => void) {
		this.audio.onStop(cb)
	}

	onTimeUpdate(cb: (res?: { current: number; duration: number; params: unknown }) => void) {
		this.audio.onTimeUpdate(cb)
	}

	onCanplay(cb: (res?: any) => void) {
		this.audio.onCanplay(cb)
	}

	onError(cb: (res?: any) => void) {
		this.audio.onError(cb)
	}

	seek(duration: number) {
		this.audio.seek(duration)
	}

	play(audioSrc: string, params?: unknown) {
		this.audio.play(audioSrc, params)
	}

	pause() {
		this.audio.pause()
	}

	stop() {
		this.audio.stop()
	}

	info(audioSrc: string) {
		return this.audio.info(audioSrc)
	}
}

let audioSystem = new AudioSystem()

export default (() => {
	if (audioSystem) return audioSystem
	return (audioSystem = new AudioSystem()) && audioSystem
})()
