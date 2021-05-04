export default {
  props: {
    'progress': {
      type: Number,
      default: 0
    }
  },
  template: `
    <div class="progress-bar">
      <div class="progress-bar__track"></div>
      <div class="progress-bar__thumb" :style="{width: progress + '%'}"></div>
    </div>
  `
}
