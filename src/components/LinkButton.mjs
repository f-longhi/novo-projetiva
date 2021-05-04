import * as menus from '../webui-menu/menu.js'
import LineAwesomeIcon from './LineAwesomeIcon.mjs'
  
export default {
  components: { LineAwesomeIcon },
  props: {
    url: String,
    iconId: String,
    title: String
  },
  mounted() {
    const cxm = new menus.DropdownMenu()
    
    cxm.append('Editar', () => { this.$emit('edit') })
    cxm.append('Remover', () => { this.$emit('remove') })
    
    cxm.setContext(this.$refs.actions)
  },
  template: `
    <a
      :href="url"
      class="link-button"
      v-on="$listeners"
    >
      <LineAwesomeIcon size="3x" :icon-id="iconId" />
      <span class="link-button__text">{{title}}</span>
      <span
        class="link-button__actions"
        ref="actions"
      >
        <LineAwesomeIcon size="1x" icon-id="ellipsis-v" />
      </span>
    </a>
  `
}