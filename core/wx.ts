// @ts-nocheck
class WxAudioSystem {
	audio!: WechatMiniprogram.InnerAudioContext
	tempParams: unknown
	// #ifdef MP-WEIXIN
	constructor() {
		this.init()
		this.tempParams = null
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
	seek(duration: number) {
		this.audio.seek(duration)
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
		this.audio.stop()
	}
	async info(audioSrc: string) {
		return new Promise((resolve) => {
			// let watch = () => {
			// 	if ((this?.eventResult?.duration || -1) >= 0) {
			// 		resolve(this.eventResult)
			// 		// 重置audio
			// 		this.audio.offTimeUpdate(watch)
			// 		// this.audio.stop()
			// 		this.audio.volume = 1
			// 		this.audio.src = ''
			// 	}
			// }
			this.audio.volume = 0
			this.play(audioSrc)
			// this.audio.onTimeUpdate(watch)
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
