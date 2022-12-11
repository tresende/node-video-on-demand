export class VideoComponent {
  constructor() {}

  initializePlayer() {
    const player = window.videojs('vid')
    const ModalDialog = window.videojs.getComponent('ModalDialog')
    const modal = new ModalDialog(player, {
      temporary: false,
      closeable: true
    })

    player.addChild(modal)
  }
}
