import LinkButton from './LinkButton.mjs'
import LineAwesomeIcon from './LineAwesomeIcon.mjs'
  
export default {
  components: {
    LinkButton,
    LineAwesomeIcon
  },
  props: {
    links: Array
  },
  methods: {
    onDragStart(e, link) {
      e.dataTransfer.setData('text/x-projetiva-hp-link-id', link.id)
      e.dataTransfer.setData('text/uri-list', link.url)
      e.dataTransfer.setData('text/plain', link.url)
      e.dataTransfer.dropEffect = 'move'
    },
    onDrop(e, link) {
      
      const types = [...e.dataTransfer.types]
      
      if (types.includes('text/x-projetiva-hp-link-id')) {
        const srcId = Number(e.dataTransfer.getData('text/x-projetiva-hp-link-id'))
        this.$emit('swap-item', {
          srcId: srcId,
          destId: link.id
        })
      } else if (types.includes('text/plain')) {
        const urls = e.dataTransfer.getData('text/plain').split('\r\n').filter(l => !l.startsWith('#'))
        this.$emit('link-dropped', {
          destId: link.id,
          urls
        })
      }
      
    }
  },
  template: `
    <div class="link-grid">
      <LinkButton
        v-for="link of links"
        :key="link.id"
        :iconId="link.iconId"
        :title="link.title"
        :url="link.url"
        draggable="true"
        @dragstart="onDragStart($event, link)"
        @dragover.prevent
        @drop.prevent="onDrop($event, link)"
        @remove="$emit('remove-link', link)"
        @edit="$emit('edit-link', link)"
      />
      <button
        class="link-grid__add"
        @click="$emit('create-link')"
      >
        <LineAwesomeIcon
          size="2x"
          iconId="plus"
        />
      </button>
    </div>
  `
}