import { VideoComponent } from './src/VideoComponent'
import { Network } from './src/Network'
import { VideoMediaPlayer } from './src/VideoMediaPlayer'
import manifestJSON from './manifest.json'

const localHost = ['127.0.0.1', 'localhost']

async function main() {
  const isLocal = !!~localHost.indexOf(window.location.hostname)
  const host = isLocal ? manifestJSON.localhost : manifestJSON.productionHost
  const videoComponent = new VideoComponent()
  const network = new Network({ host })
  const videoPlayer = new VideoMediaPlayer({
    manifestJSON,
    network
  })

  videoPlayer.initializeCodec()
  videoComponent.initializePlayer()
}

window.onload = main
