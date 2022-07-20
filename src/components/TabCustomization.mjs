import configStore from '../config-store.mjs'

const component = {
  inheritAttrs: false,
  name: 'TabCustomization',
  props: {
    settings: Object
  },
  data() {
    return {
      allowedBlendModes: [
        { name: 'Normal', value: 'normal' },
        { name: 'Sobrepor', value: 'overlay' },
        { name: 'Multiplicar', value: 'multiply' },
      ]
    }
  },
  template: `
    <div class="tab-customization">
      <h1>Personalização</h1>
      
      <div class="tab-customization__content">
      
        <section class="tab-customization__settings-grid">
        
          <label class="tab-customization__settings-grid-label">URL da imagem de fundo:</label>
          
          <input
            type="text"
            :value="settings.backgroundImageUrl"
            @change="$emit('set-setting', 'backgroundImageUrl', $event.target.value.trim() || null)"
          />
          
          <label class="tab-customization__settings-grid-label">
            Cor do plano de fundo:
          </label>

          <input
            type="color"
            :value="settings.backgroundColor"
            @change="$emit('set-setting', 'backgroundColor', $event.target.value)"
          />
          
          <label class="tab-customization__settings-grid-label">
            Modo de mistura do fundo:
          </label>
          
          <select
            :value="settings.backgroundBlendMode"
            @change="$emit('set-setting', 'backgroundBlendMode', $event.target.value)"
          >
            <option
              v-for="blendMode of allowedBlendModes"
              :value="blendMode.value"
            >{{blendMode.name}}</option>
          </select>
          
          <label class="tab-customization__settings-grid-label">
            Driver de armazenamento da aba "Início"*:
          </label>
          
          <select
            :value="settings.homeTabStorageDriver"
            @change="$emit('set-setting', 'homeTabStorageDriver', $event.target.value)"
          >
            <option value="localStorage">Armazenamento local (experimental)</option>
            <option value="IndexedDB">Base de dados IndexedDB</option>
          </select>
          
          <label class="tab-customization__settings-grid-label">
            Meus dados:
          </label>
          
          <div>
            <button
              type="button"
              @click="$emit('create-backup')"
            >Criar backup</button>
            
            <button
              type="button"
              @click="$emit('restore-from-backup')"
            >Restaurar do arquivo</button>
          </div>
          
        
        </section>
        
        <p>* Será necessário recarregar a página para que esta configuração tome efeito.</p>
        
      </div>
      
    </div>
  `
}



export default {
  id: 'customization',  
  name: 'Personalização',
  visibleInTabList: false,
  component
}