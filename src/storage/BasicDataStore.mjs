import ConfigStore from '../config-store.mjs'

export default class BasicDataStore {
  
  constructor(storeName) {
    this._storeName = storeName
    this._entries = JSON.parse(ConfigStore.getOption('DataStores/' + this._storeName, '[]'))
  }
  
  _save() {
    ConfigStore.setOption('DataStores/' + this._storeName, JSON.stringify(this._entries))
  }
  
  async getAll() {
    return this._entries
  }
  
  async add(entry) {
    
    const id = this._entries.reduce((highest, entry) => Math.max(highest, entry.id), 0) + 1
    
    entry.id = id
    
    this._entries.push(entry)
    
    this._save()
  }
  
  async bulkAdd(entries) {
    
    for (const entry of entries) {
      const id = this._entries.reduce((highest, entry) => Math.max(highest, entry.id), 0) + 1
      
      entry.id = id
      
      this._entries.push(entry)
    }
    
    this._save()
  }
  
  async get(entryId) {
    return this._entries.find(entry => entry.id === entryId)
  }
  
  async put(entry) {
    const i = this._entries.findIndex(storedEntry => storedEntry.id === entry.id)
    
    if (i === -1) {
      this._entries.push(entry)
    }
    else {
      this._entries.splice(i, 1, entry)
    }
    
    this._save()
  }
  
  async bulkPut(entries) {
    
    for (const entry of entries) {

      const i = this._entries.findIndex(storedEntry => storedEntry.id === entry.id)
      
      if (i === -1) {
        this._entries.push(entry)
      }
      else {
        this._entries.splice(i, 1, entry)
      }
    
    }
    
    this._save()

  }    
  
  async delete(entryId) {
    const i = this._entries.findIndex(storedEntry => storedEntry.id === entryId)
    
    if (i!==-1) {
      this._entries.splice(i, 1)
      this._save()
    }
    
  }
  
  async bulkDelete(entryIds) {
    
    for (const entryId of entryIds) {
      const i = this._entries.findIndex(storedEntry => storedEntry.id === entryId)
      
      if (i!==-1) {
        this._entries.splice(i, 1)
      }
    }
    
    this._save()
  }
  
  async clear() {
    this._entries = []
    this._save()
  }
  
}