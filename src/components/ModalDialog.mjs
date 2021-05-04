export default {
  props: {
    isOpen: Boolean,
    label: String,
    closeOnOutsideClick: Boolean
  },
  methods: {
    onWrapperClick(e) {
      if (!this.closeOnOutsideClick)
        return;
      
      const {popupWindow} = this.$refs;
      
      if (popupWindow && !popupWindow.contains(e.target)) {
        this.$emit('close');
      }
    }
  },
  template: `
    <div v-if="isOpen" class="modal-dialog" @click="onWrapperClick">
      <div class="modal-dialog__window" ref="popupWindow">
        <h3 v-if="label">{{label}}</h3>
        <slot></slot>
      </div>
    </div>
  `
}