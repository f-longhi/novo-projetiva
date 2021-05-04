export default {
  props: {
    isActive: false
  },
  template: `
    <button
      class="dropdown-button dropdown-button-simple"
      :class="{ active: isActive }"
      v-on="$listeners"
    >
      <slot></slot>
    </button>
  `
}