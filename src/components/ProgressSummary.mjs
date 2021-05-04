import ProgressBar from './ProgressBar.mjs'

export default {
  components: {
    ProgressBar
  },
  props: {
    name: String,
    status: String,
    progress: Number
  },
  filters: {
    round(n) {
      return Math.round(n)
    }
  },
  template: `
    <div class="progress-summary">
      <span class="progress-summary__label">{{name}}</span>
      <div class="progress-summary__progress-bar-wrapper">
        <ProgressBar :progress="progress" />
      </div>
      <span class="progress-summary__infobar">
        <span class="progress-summary__status">{{status}}</span>
        <span class="progress-summary__progress-text">{{progress | round}}%</span>
      </span>
    </div>
  `
}
