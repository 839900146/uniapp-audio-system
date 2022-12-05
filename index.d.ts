import audioSystem from './src/audio-system'

export {}

declare module 'vue/types/vue' {
	interface Vue {
		$audioSystem: typeof audioSystem
	}
}
