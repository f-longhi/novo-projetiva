

import Vue from 'vue'
import configStore from './config-store.mjs'

import TabHome from './components/TabHome.mjs'
import TabTasks from './components/TabTasks.mjs'
import TabCustomization from './components/TabCustomization.mjs'
import TransparentButton from './components/TransparentButton.mjs'

const urlParams = new URLSearchParams(location.search)

const INITIAL_ACTIVE_TAB = urlParams.get('tab') || 'home'

const availableTabs = [
  {
    id: 'home',
    name: 'Início',
    component: TabHome,
    visibleInTabList: true,
  },
  {
    id: 'tasks',  
    name: 'Tarefas',
    component: TabTasks,
    visibleInTabList: true,
  },
  {
    id: 'customization',  
    name: 'Personalização',
    component: TabCustomization,
    visibleInTabList: false,
  },
]


const vm = new Vue({
  el: '#app',
  
  components: {
    ... availableTabs.reduce((o, t) => { o[t.component.name] = t.component; return o }, {}),
    TransparentButton
  },
  
  data: {
    activeTabId: INITIAL_ACTIVE_TAB,
    tabs: availableTabs,
    settings: {
      backgroundBlendMode: 'normal',
      backgroundColor: '#509F00',
      backgroundImageUrl: null
    },
  },
  
  computed: {
    activeTabComponent() {
      return this.tabs.find(tab => tab.id === this.activeTabId).component
    },
    
    visibleTabs() {
      return this.tabs.filter(tab => tab.visibleInTabList)
    },
    
    appContainerDynamicStyle() {
      return {
        backgroundColor: this.settings.backgroundColor,
        backgroundImage: this.settings.backgroundImageUrl !== null ? `url(${this.settings.backgroundImageUrl})` : 'none',
        backgroundBlendMode: this.settings.backgroundBlendMode
      }
    }
  },
  
  mounted() {
    this.initSettings()
  },
  
  methods: {
    onSetSetting(key, value) {
      this.settings[key] = value
      configStore.setOption(`Settings/${key}`, value)
    },
    
    initSettings() {
      for (const key of Object.keys(this.settings)) {
        this.settings[key] = configStore.getOption(`Settings/${key}`, this.settings[key])
      }
    }
  },
  
  template: `
  
    <div id="app" :style="appContainerDynamicStyle">
  
      <nav id="navigation">
  
        <span class="pull-right hbox">
          

          <TransparentButton
            v-for="(tab, tabIndex) of visibleTabs"
            :key="tab.name"
            :is-active="tab.id === activeTabId"
            @click.prevent="activeTabId = tab.id"
          >{{tab.name}}</TransparentButton>
          
          <span id="prefs-dialog-cmd-open" class="transparent-button" style="display: none"><span class="la la-2x la-cogs"></span></span>
          
          <span
            class="user-icon la la-user"
            @click="activeTabId = 'customization'"
          ></span>
        
        </span>
      
      </nav>
      
      
      
      <div class="tab-list expand">
        
        <keep-alive>
          <component
            :is="activeTabComponent"
            class="tab-content"
            :settings="settings"
            @set-setting="onSetSetting"
          />
        </keep-alive>
        
      </div>
      
    </div>

  `
})

