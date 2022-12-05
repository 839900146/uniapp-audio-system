class H5AudioSystem {
	// #ifdef H5
	audio!: HTMLAudioElement
	tempParams: unknown
	tempAudioUrl: string
	constructor() {
		this.init()
		this.tempParams = null
		this.tempAudioUrl = ''
	}

	private init() {
		this.audio = new Audio()
	}

	onPlay(cb: (res?: any) => void) {
		this.audio.addEventListener('play', () => cb(this.eventResult))
	}

	onPause(cb: (res?: any) => void) {
		this.audio.addEventListener('pause', () => cb(this.eventResult))
	}

	onStop(cb: (res?: any) => void) {
		this.audio.addEventListener('ended', () => cb(this.eventResult))
	}

	onError(cb: (res?: any) => void) {
		this.audio.onerror = (e) => {
			cb(e)
		}
	}

	onCanplay(cb: (res?: any) => void) {
		this.audio.addEventListener('canplay', () => cb(this.eventResult))
	}

	onTimeUpdate(cb: (res?: any) => void) {
		this.audio.addEventListener('timeupdate', () => cb(this.eventResult))
	}

	onChange(cb: (newVal?: any, oldVal?: any) => void) {
		// @ts-ignore
		this.audio['__h5__audio__onchange__'] = cb
	}

	seek(duration: number) {
		this.audio.currentTime = duration
	}

	play(audioSrc?: string, params?: unknown) {
		let prevState = this.audio.paused

		if (!audioSrc || this.audio.src === audioSrc) {
			if (!prevState) {
				// false代表当前正在播放
				return this.audio.pause()
			}
		} else {
			// 能走到这里，带本本次播放的和上次播放的不一样
			// @ts-ignore
			this.audio['__h5__audio__onchange__']?.(params, this.tempParams)
			this.tempParams = params
			this.audio.src = audioSrc
			this.tempAudioUrl = audioSrc
		}

		this.pause()

		this.audio.play()
	}

	pause() {
		this.audio.pause()
	}

	stop() {
		this.pause()
		this.audio.src = ''
	}

	async info(audioSrc: string) {
		let isPlaying = this.audio.paused
		return new Promise((resolve) => {
			let timer = setInterval(() => {
				if ((this?.eventResult?.duration || -1) >= 0) {
					clearInterval(timer)
					resolve(this.eventResult)
					this.audio.pause()
					this.audio.volume = 1
					this.audio.src = this.tempAudioUrl
					this.audio.muted = false
					if (!isPlaying) {
						this.audio.play()
					}
				}
			}, 150)

			this.audio.pause()
			this.audio.muted = true
			this.audio.src = audioSrc
			this.audio.play()
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
