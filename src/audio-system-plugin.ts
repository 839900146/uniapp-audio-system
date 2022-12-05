// @ts-nocheck
import { App } from 'vue'
import audioSystem from './audio-system'
export default {
	install(app: App) {
		// #ifdef H5
		if (app.config?.globalProperties) {
			app.config.globalProperties.$audioSystem = audioSystem
		} else {
			app.prototype.$audioSystem = audioSystem
		}
		// #endif
	},
}
