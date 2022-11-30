class H5AudioSystem {
	// #ifdef H5
	audio!: HTMLAudioElement
	tempParams: unknown
	constructor() {
		this.init()
		this.tempParams = null
	}

	private init() {
		this.audio = new Audio()
	}

	onPlay(cb: (res?: any) => void) {
		this.audio.onplay = () => {
			cb(this.eventResult)
		}
	}

	onPause(cb: (res?: any) => void) {
		this.audio.onpause = () => {
			cb(this.eventResult)
		}
	}

	onStop(cb: (res?: any) => void) {
		this.onPause(cb)
	}

	onError(cb: (res?: any) => void) {
		this.audio.onerror = (e) => {
			cb(e)
		}
	}

	onCanplay(cb: (res?: any) => void) {
		this.audio.oncanplay = () => {
			cb(this.eventResult)
		}
	}

	onTimeUpdate(cb: (res?: any) => void) {
		this.audio.ontimeupdate = () => {
			cb(this.eventResult)
		}
	}

	seek(duration: number) {
		this.audio.currentTime = duration
	}

	play(audioSrc?: string, params?: unknown) {
		if (!audioSrc || this.audio.src === audioSrc) {
			if (this.audio.paused) {
				this.audio.play()
			} else {
				this.audio.pause()
			}
			return
		}
		this.tempParams = params
		this.audio.src = audioSrc
		this.audio.play()
	}

	pause() {
		this.audio.pause()
	}

	stop() {
		this.pause()
	}

	async info(audioSrc: string) {
		return new Promise((resolve) => {
			let watch = () => {
				if ((this?.eventResult?.duration || -1) >= 0) {
					resolve(this.eventResult)
					// 重置audio
					this.audio.removeEventListener('timeupdate', watch)
					this.audio.pause()
					this.audio.volume = 1
					this.audio.src = ''
				}
			}
			this.audio.volume = 0
			setTimeout(() => {
				this.play(audioSrc)
				this.audio.addEventListener('timeupdate', watch)
				this.audio.ontimeupdate = watch
			}, 150)
		})
	}

	get eventResult() {
		return {
			current: this.audio.currentTime,
			duration: this.audio.duration || undefined,
			status: !this.audio.paused,
			audioSrc: this.audio.src,
			params: this.tempParams,
		}
	}

	// #endif
}

let h5AudioSystem = new H5AudioSystem()

export default (() => {
	// #ifdef H5
	if (h5AudioSystem) return h5AudioSystem
	return (h5AudioSystem = new H5AudioSystem()) && h5AudioSystem
	// #endif
})()
