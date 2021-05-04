import ButtonBox from './ButtonBox.mjs'
import LineAwesomeIcon from './LineAwesomeIcon.mjs'
import ModalDialog from './ModalDialog.mjs'
  
export default {
  components: {
    ButtonBox,
    LineAwesomeIcon,
    ModalDialog
  },
  props: {
    iconId: String,
    variant: String
  },
  data() {
    return {
      iconPickerIsOpen: false
    };
  },
  methods: {
    openIconPicker() {
      this.iconPickerIsOpen = true
      this.$nextTick(() => {
        const {iconNameInput} = this.$refs
        iconNameInput.select()
        iconNameInput.focus()
      });
    }
  },
  template: `
    <div class="icon-picker">
    
      <button
        class="icon-picker__button"
        type="button"
        @click="openIconPicker()"
      >
        <LineAwesomeIcon
          size="4x"
          :iconId="iconId"
          :variant="variant"
        />
      </button>
      
      <ModalDialog
        label="Escolher ícone"
        :isOpen="iconPickerIsOpen"
        :iconId="iconId"
        :variant="variant"
        :closeOnOutsideClick="true"
        @close="iconPickerIsOpen = false"
      >
        <p>
          <label>Nome:
            <input
              ref="iconNameInput"
              type="text"
              :value="iconId"
              @keydown.enter="$emit('change', {iconId: $event.target.value, variant}); iconPickerIsOpen = false"
            />
          </label>
        </p>
        <p>Você pode encontrar uma referência dos ícones disponíveis na página da fonte <a href="https://icons8.com/line-awesome" rel="noopener noreferrer" target="_blank">Line Awesome</a>.
        <ButtonBox>
          <button
            type="button"
            @click="iconPickerIsOpen = false"
          >Concluído</button>
        </ButtonBox>
      </ModalDialog>
      
    </div>
  `
}