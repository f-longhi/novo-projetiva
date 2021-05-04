import BasicDataStore from './BasicDataStore.mjs'
import IDBDataStore from './IDBDataStore.mjs'

const dataStoreBackendPref = new URLSearchParams(location.search).get('datastore')

export let DataStore =
  dataStoreBackendPref === 'basic' ? BasicDataStore : IDBDataStore