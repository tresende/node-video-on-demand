export class VideoMediaPlayer {
  constructor({ manifestJSON, network }) {
    this.manifestJSON = manifestJSON
    this.network = network
    this.videoElement = null
    this.souceBuffer = null
    this.selected = {}
    this.videoDuration = 0
  }
  sourceOpenWrapper(mediaSource) {
    return async () => {
      this.sourceBuffer = mediaSource.addSourceBuffer(this.manifestJSON.codec)
      const selected = (this.selected = this.manifestJSON.intro)
      mediaSource.duration = this.videoDuration
      await this.fileDownload(selected.url)
    }
  }

  async fileDownload(url) {
    const prepareUrl = {
      url,
      fileResolution: 360,
      fileResolutionTag: this.manifestJSON.fileResolutionTag,
      hostTag: this.manifestJSON.hostTag
    }

    const finalUrl = this.network.parseManifestURL(prepareUrl)
    this.setVideoPlayerDuration(finalUrl)
    const data = await this.network.fetchFile(finalUrl)
    return this.processBufferSegments(data)
  }

  initializeCodec() {
    this.videoElement = document.getElementById('vid')
    const mediaSourceSupported = !!window.MediaSource
    if (!mediaSourceSupported) {
      alert('Unsupported browser!')
      return
    }

    const codecSupported = MediaSource.isTypeSupported(this.manifestJSON.codec)
    if (!codecSupported) {
      alert(`Unsupported codec: ${this.manifestJSON.codec}`)
      return
    }

    const mediaSource = new MediaSource()
    this.videoElement.src = URL.createObjectURL(mediaSource)

    mediaSource.addEventListener('sourceopen', this.sourceOpenWrapper(mediaSource))
  }

  setVideoPlayerDuration(finalURL) {
    const bars = finalURL.split('/')
    const [, videoDuration] = bars[bars.length - 1].split('-')
    this.videoDuration += videoDuration
  }

  async processBufferSegments(allSegments) {
    const sourceBuffer = this.sourceBuffer
    sourceBuffer.appendBuffer(allSegments)

    return new Promise((resolve, reject) => {
      const updateEnd = () => {
        sourceBuffer.removeEventListener('updateend', updateEnd)
        sourceBuffer.timestampOffset = this.videoDuration

        return resolve()
      }

      sourceBuffer.addEventListener('updateend', updateEnd)
      sourceBuffer.addEventListener('error', reject)
    })
  }
}
