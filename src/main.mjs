

import Vue from 'vue'
import configStore from './config-store.mjs'

import TabHome from './components/TabHome.mjs'
import TabTasks from './components/TabTasks.mjs'
import TabCustomization from './components/TabCustomization.mjs'
import TabCalendar from './components/TabCalendar.mjs'
import TransparentButton from './components/TransparentButton.mjs'

import {saveBlob, openFile} from './files6.mjs'

const urlParams = new URLSearchParams(location.search)

const availableTabs = [
  TabHome,
  TabTasks,
  TabCalendar,
  TabCustomization,
]
const INITIAL_ACTIVE_TAB = urlParams.get('tab') || availableTabs.find(tab => tab.visibleInTabList).id

async function createBackup() {
  
  const componentData = []
  
  for (const tab of availableTabs) {
    
    if (typeof tab.serialize !== 'function')
      continue
    
    componentData.push({
      componentId: tab.id,
      data: await tab.serialize()
    })
    
  }
  
  const wrappedPackage = {
    application: 'ProjetivaHP2',
    packageType: 'BasicBackup',
    schemaVersion: 1,
    componentData
  }
  
  const serializedData = JSON.stringify(wrappedPackage)
  
  const dataBlob = new Blob([ serializedData ], { type: 'application/json' });
  
  const
    padNum = num => String(num).padStart(2, '0'),
    now = new Date(),
    y = now.getFullYear(),
    m = padNum(now.getMonth() + 1),
    d = padNum(now.getDate()),
    h = padNum(now.getHours()),
    M = padNum(now.getMinutes()),
    s = padNum(now.getSeconds()),
    fileName = `projetiva-hp-2-backup-${y}${m}${d}-${h}${M}${s}.json`
  
  saveBlob(dataBlob, fileName)
  
}

async function restoreFromBackup() {
  
  const serializedData = await openFile({ accept: 'application/json' })
  
  if (!serializedData)
    return
  
  const wrappedPackage = JSON.parse(serializedData)
  
  if (wrappedPackage.application !== 'ProjetivaHP2')
    throw new Error('O arquivo não parece ser um backup do Projetiva HP 2')
  
  if (wrappedPackage.packageType !== 'BasicBackup')
    throw new Error('O arquivo é um pacote do Projetiva HP 2, mas não é um arquivo de backup suportado por esta versão do aplicativo')
  
  const componentData = wrappedPackage.componentData
  
  if (Array.isArray(componentData)) {
    
    for (const componentDataEntry of componentData) {
      
      const tab = availableTabs.find(tab => tab.id === componentDataEntry.componentId)
        
      if (tab && typeof tab.deserialize === 'function') {
        await tab.deserialize(componentDataEntry.data)
      }
      
    }
    
  }
  
}

const vm = new Vue({
  el: '#app',
  
  components: {
    TransparentButton
  },
  
  data: {
    activeTabId: INITIAL_ACTIVE_TAB,
    tabs: availableTabs,
    settings: {
      backgroundBlendMode: 'normal',
      backgroundColor: '#509F00',
      backgroundImageUrl: null,
      homeTabStorageDriver: 'IndexedDB'
    },
    instanceKey: Date.now()
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
    },
    
    onCreateBackup() {
      createBackup().catch(error => {
        alert(error)
        console.error(error)
      })
    },
    
    onRestoreFromBackup() {
      restoreFromBackup().catch(error => {
        alert(error)
        console.error(error)
      })
      this.instanceKey = Date.now()
    }
  },
  
  template: `
  
    <div
      id="app"
      :style="appContainerDynamicStyle"
      :key="instanceKey"
    >
  
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
            @create-backup="onCreateBackup"
            @restore-from-backup="onRestoreFromBackup"
          />
        </keep-alive>
        
      </div>
      
    </div>

  `
})

