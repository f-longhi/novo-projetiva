export default {
  props: {
    iconId: String,
    size: {
      type: String,
      validator(size) {
        return 'lg xs sm lx 1x 2x 3x 4x 5x 6x 7x 8x 9x 10x fw'.split(' ').includes(size)
      }
    }
  },
  computed: {
    appliedClasses() {
      const classes = ['la', `la-${this.iconId}`]
      
      if (this.size)
        classes.push(`la-${this.size}`)
      
      return classes
    }
  },
  template: `
    <i :class="appliedClasses"></i>
  `
}