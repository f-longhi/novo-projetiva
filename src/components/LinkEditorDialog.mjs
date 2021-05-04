import ModalDialog from './ModalDialog.mjs'
import LineAwesomeIcon from './LineAwesomeIcon.mjs'
import ButtonBox from './ButtonBox.mjs'
import IconPicker from './IconPicker.mjs'

export default {
  components: {
    ModalDialog,
    LineAwesomeIcon,
    ButtonBox,
    IconPicker
  },
  props: {
    link: Object
  },
  data() {
    if (this.link) {
      return {
        id: this.link.id || null,
        url: this.link.url || '',
        title: this.link.title || '',
        iconId: this.link.iconId || 'globe',
        order: this.link.order
      };
    } else {
      return {
        id: null,
        url: '',
        title: '',
        iconId: 'globe'
      };
    }
  },
  methods: {
    onIconChange({iconId, variant}) {
      this.iconId = iconId;
    },
    onSave() {
      
      let {id, url, title, iconId, order} = this;
      
      if (!/^[\w\-]+:/.test(url))
        url = `https://${url}`;
      
      this.$emit('save', {
        id,
        url,
        title,
        iconId,
        order
      });
    }
  },
  template: `
    <ModalDialog
      :isOpen="true"
      label="Editar vínculo"
      @close="$emit('cancel')"
    >
      <div class="link-editor-dialog">
        <div class="link-editor-dialog__grid">
          
          <div
            class="field-wrapper link-editor-dialog__icon-picker-button"
            id="link-icon-field"
          >
            <label>Ícone</label>
            <IconPicker
              size="4x"
              :iconId="iconId"
              @change="onIconChange"
            />
          </div>
          
          <div
            class="field-wrapper"
            id="link-title-field"
          >
            <label>Título</label>
            <input
              type="text"
              v-model="title"
              placeholder="Digite um título"
              size="42"
            />
          </div>
          
          <div
            class="field-wrapper"
            id="link-url-field"
          >
            <label>URL</label>
            <input
              type="text"
              v-model="url"
              placeholder="Digite ou cole um URL"
              size="42"
            />
          </div>
          
        </div>
        
        <ButtonBox>
          <button @click="$emit('cancel')">Cancelar</button>
          <button @click="onSave">Salvar</button>
        </ButtonBox>
        
      </div>
    </ModalDialog>
  `
}