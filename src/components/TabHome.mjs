import configStore from '../config-store.mjs'

import LinkEditorDialog from './LinkEditorDialog.mjs'
import LinkGrid from './LinkGrid.mjs'
import SearchBox from './SearchBox.mjs'

import {DataStore} from '../storage/DataStore.mjs'

const linkStore = new DataStore('HomePageLinks')

export default {
  
  inheritAttrs: false,
  
  name: 'TabHome',
  
  components: {
    LinkGrid,
    LinkEditorDialog,
    SearchBox
  },
  
  data() {
    return {
      links: [],
      editingLink: null
    }
  },
  
  computed: {
    orderedLinks() {
      return [ ...this.links.sort((linkA, linkB) => linkA.order - linkB.order) ]
    }
  },
  
  mounted() {
    
    this.loadLinks()
    
  },
  
  methods: {
    
    loadLinks() {
      linkStore.getAll().then(links => {
        this.links = links
      }).catch(error => {
        console.error(error)
      })
    },
    
    onSwapItem({srcId, destId}) {
      const src = this.links.find(link => link.id === srcId)
      const dest = this.links.find(link => link.id === destId)
      
      const srcOrder = src.order
      const destOrder = dest.order
      
      src.order = destOrder
      dest.order = srcOrder
      
      Promise.all([
        linkStore.put(src),
        linkStore.put(dest)
      ]).catch(console.error)
    },
    
    onLinkDropped({urls}) {
      this.editingLink = { title: urls[0], url: urls[0] }
    },
    
    onRemoveLink(link) {
      
      const i = this.links.findIndex(l => l.id === link.id)
      linkStore.delete(this.links[i].id)
      this.links.splice(i, 1)
      this.links.forEach(link => {
        if (link.order > i) {
          link.order --
          linkStore.put(link).catch(console.error)
        }
      })
    },
    
    onEditLink(link) {
      this.editingLink = link
    },
    
    onSaveLink(link) {
      
      if (link.id === null) {
        delete link.id
        link.order = this.links.length
        linkStore.add(link).then(() => this.loadLinks()).catch(console.error)
        this.loadLinks()
      } else {
        const linkIndex = this.links.findIndex(l => l.id === link.id)
        this.links.splice(linkIndex, 1, link)
        linkStore.put(link).catch(console.error)
      }
      
      this.editingLink = null
      
    },
    
    onCreateLink(link) {
      this.editingLink = {}
    },
    
    onDrop(e) {
      
      if (e.defaultPrevented)
        return
      
      const types = [...e.dataTransfer.types]
      
      if (types.includes('text/plain') && !types.includes('text/x-projetiva-hp-link-id')) {
        const urls = e.dataTransfer.getData('text/plain').split('\r\n').filter(l => !l.startsWith('#'))
        this.onLinkDropped({ urls })
      }
      
      e.preventDefault()
      
    }
    
  },
  
  template: `
    <div
      class="tab-home"
      @dragover.prevent
      @drop="onDrop"
    >
      <SearchBox
        request-method="GET"
        search-url="https://www.duckduckgo.com"
      />
      
      <LinkGrid
        :links="orderedLinks"
        @create-link="onCreateLink"
        @edit-link="onEditLink"
        @remove-link="onRemoveLink"
        @link-dropped="onLinkDropped"
        @swap-item="onSwapItem"
      />
      
      <LinkEditorDialog
        v-if="editingLink"
        :link="editingLink"
        @cancel="editingLink = null"
        @save="onSaveLink"
      />
    </div>
  `
}