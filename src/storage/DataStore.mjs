import BasicDataStore from './BasicDataStore.mjs'
import IDBDataStore from './IDBDataStore.mjs'

const dataStoreBackendPref = new URLSearchParams(location.search).get('datastore')

export let DataStore =
  dataStoreBackendPref === 'basic' ? BasicDataStore : IDBDataStore
  
export function getDataStoreDriver(driverName) {
  
  switch (driverName) {
    case 'localStorage': return BasicDataStore
    case 'IndexedDB': return IDBDataStore
    default: throw new Error('Data driver not found')
  }
  
}