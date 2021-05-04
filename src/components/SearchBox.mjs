import LineAwesomeIcon from './LineAwesomeIcon.mjs'

export default {
  components: {
    LineAwesomeIcon
  },
  props: {
    requestMethod: {
      type: String,
      default: 'GET'
    },
    searchUrl: {
      type: String,
      default: 'https://www.duckduckgo.com/'
    }
  },
  template: `
    <form
      class="search-box"
      spellcheck="false"
      :method="requestMethod"
      :action="searchUrl"
    >
      
      <button type="button" class="search-box__search-icon">
        <LineAwesomeIcon size="lg" icon-id="search" />
      </button>
      
      <input 
        class="search-box__search-field"
        name="q"
        type="text"
        value=""
        autocomplete="off"
        spellcheck="false"
        placeholder="Pesquisar"
      />
      
      <button type="submit" class="search-box__submit">
        <LineAwesomeIcon size="lg" icon-id="arrow-right" />
      </button>
      
    </form>
  `
}