// @ts-nocheck
class WxAudioSystem {
	// #ifdef MP-WEIXIN
	audio!:  any // WechatMiniprogram.InnerAudioContext 这个傻逼类型会报错
	tempParams: unknown
	tempAudioUrl: string
	constructor() {
		this.init()
		this.tempParams = null
		this.tempAudioUrl = ''
	}

	private init() {
		this.audio = wx.createInnerAudioContext()
	}

	onPlay(cb: (res?: any) => void) {
		this.audio.onPlay(() => {
			cb(this.eventResult)
		})
	}

	onPause(cb: (res?: any) => void) {
		this.audio.onPause(() => {
			cb(this.eventResult)
		})
	}

	onStop(cb: (res?: any) => void) {
		this.audio.onStop(() => {
			cb(this.eventResult)
		})
	}

	onTimeUpdate(cb: (res?: { current: number; duration: number }) => void) {
		this.audio.onTimeUpdate(() => {
			cb(this.eventResult)
		})
	}

	onError(cb: (res?: any) => void) {
		this.audio.onError((res) => {
			cb(res)
		})
	}

	onCanplay(cb: (res?: any) => void) {
		this.audio.onCanplay(() => {
			cb(this.eventResult)
		})
	}

	onChange(cb: (newVal?: any, oldVal?: any) => void) {
		// @ts-ignore
		
		this.audio['__wx__audio__onchange__'] = cb
	}

	seek(duration: number) {
		this.audio.seek(duration)
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
			this.audio['__wx__audio__onchange__']?.(params, this.tempParams)
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
		this.audio.stop()
	}

	async info(audioSrc: string) {
		return new Promise((resolve) => {
			this.audio.volume = 0
			this.play(audioSrc)
			let timer = setInterval(() => {
				if ((this?.eventResult?.duration || -1) >= 0) {
					resolve(this.eventResult)
					this.audio.stop()
					this.audio.volume = 1
					this.audio.src = ''
					clearInterval(timer)
				}
			}, 150)
		})
	}

	private get eventResult() {
		return {
			current: this.audio.currentTime,
			duration: this.audio.duration || undefined,
			status: !this.audio.paused,
			audioSrc: this.audio.src,
			params: this.tempParams || {},
		}
	}
	// #endif
}

let wxAudioSystem = new WxAudioSystem()

export default (() => {
	// #ifdef MP-WEIXIN
	if (wxAudioSystem) return wxAudioSystem
	return (wxAudioSystem = new WxAudioSystem()) && wxAudioSystem
	// #endif
})()
