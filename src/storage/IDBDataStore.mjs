import Dexie from 'dexie'

export default class IDBDataStore {
  
  constructor(storeName) {
    this._db = new Dexie(storeName)
    
    this._db.version(1).stores({
      items: '++id'
    })
  }
  
  async getAll() {
    return this._db.items.toArray()
  }
  
  async add(entry) {
    return this._db.items.add(entry)
  }
  
  async bulkAdd(entries) {
    return this._db.items.bulkAdd(entries)
  }
  
  async get(entryId) {
    return this._db.items.get(entryId).toArray()
  }
  
  async put(entry) {
    return this._db.items.put(entry)
  }
  
  async bulkPut(entries) {
    return this._db.items.bulkPut(entries)
  }
  
  async delete(entryId) {
    return this._db.items.delete(entryId)
  }
  
  async bulkDelete(entryIds) {
    return this._db.items.bulkDelete(entryIds)
  }
  
  async clear() {
    return this._db.items.clear()
  }
  
}