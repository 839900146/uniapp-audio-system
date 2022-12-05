## 音频管理器

## 安装

```bash
npm i uniapp-audio-system -S
```

## 绑定实例
在main.ts入口文件中，将插件绑定到Vue实例身上
```ts
import audioPlugin from 'uniapp-audio-system/audio-system-plugin'

Vue.use(audioPlugin)
```

## 导入方式

- 通过 `import` 导入使用
```ts
import audio from 'uniapp-audio-system'

audio.play('https://xxx.mp3')
```

- 通过 `vue实例` 身上调用
```ts
export default {
  methods: {
    demo() {
      this.$audioSystem.play('https://xxx.mp3')
    }
  }
}
```

## 用法示例
```ts
import audio from 'uniapp-audio-system'

// 播放音频
/**
 * 1. 如果传递src
 *    1.1 如果src与当前正在播放的src一样，则从原先暂停的位置开始播放
 *    1.2 如果src与当前正在播放的src不一样，则从头开始播放
 * 2. 如果不传递src，且当前音频管理器上存在src，则从原先暂停的位置开始播放，否则默认啥也不干
 * 3. 第二个参数随便传，音频管理器会在相关的事件监听器中原样返回
 */
audio.play('https://xxx.mp3', { a: '1', b: false, c: 'xxx' })

// 暂停播放
audio.pause()

// 停止播放（仅微信支持）
audio.stop()

// 跳转到第30s
audio.seek(30)

// 监听开始播放
audio.onPlay((ev) => {})

// 监听暂停播放
audio.onPause((ev) => {})

// 监听停止播放
audio.onStop((ev) => {})

// 监听播放出错
audio.onError((ev) => {})

// 监听音频进入可以播放的状态
audio.onCanplay((ev) => {})

// 监听播放进度
audio.onTimeUpdate((ev) => {})

// 监听播放改变，参数是新旧params
audio.onChange((newParams, oldParams) => {})

// 获取歌曲信息（当前时长|总时长|播放状态等）
(async () => {
  let info = await audio.info('https://xxx.mp3')
})()
```

### 各方法类型定义
```ts
type TEventResult = {
  // 当前播放进度
  current: number,
  // 音频总时长
  duration: number || undefined,
  // 播放状态，true=正在播放，false=未在播放
  status: boolean,
  // 当前的src
  audioSrc: string,
  // 自定义数据
  params: any,
}

audio.play(audioSrc?: string, params: any): void

audio.pause(): void

audio.stop(): void

audio.seek(duration: number): void

audio.onPlay((ev: TEventResult) => void)

audio.onPause((ev: TEventResult) => void)

audio.onStop((ev: TEventResult) => void)

audio.onTimeUpdate((ev: TEventResult) => void)

audio.onError((ev: any) => void)

audio.onCanplay((ev: TEventResult) => void)

audio.onChange(cb: (newParams?: any, oldParams?: any) => void)

audio.info(audioSrc: string): Promise<TEventResult>

```