import InputSelect from '../input-select'
import InputLabel from '../input-label'
export default {
  name: 'builder',
  components: {
    InputSelect,
    InputLabel
  },
  computed: {
    typedTemplateOptions () {
      let opts = []
      for (var opt in this.templateOptions) {
        let type = ''
        switch (typeof this.templateOptions[opt]) {
          case 'string':
            if (
              this.templateOptions[opt].charAt(0) === '#' &&
              (this.templateOptions[opt].length === 7 || this.templateOptions[opt].length === 4)
            ) {
              type = 'color'
              break
            }
            type = 'text'
            break
          case 'number':
            type = 'number'
        }
        let label = opt.match(/([a-z]|[A-Z])[a-z]+/g).join(' ').toLowerCase()
        label = label.charAt(0).toUpperCase() + label.slice(1)
        opts.push({
          label,
          type,
          name: opt,
          value: this.templateOptions[opt]
        })
      }
      return opts
    }
  },
  data () {
    return {
      template: '',
      result: '',
      templateOptions: {},
      isLoading: false,
      templateTypes: [
        { name: 'Simple', value: 'simple' },
        { name: 'Rocks', value: 'rocks' }
      ]
    }
  },
  methods: {
    getTemplate: async function (template) {
      this.template = template.value
      this.isLoading = true
      let opts = await fetch(`https://api.badge.dog/opts/${this.template}`)
      this.templateOptions = await opts.json()
      this.isLoading = false
    },
    getBadge: async function () {
      this.isLoading = true
      this.result = ''
      var queryString = Object.keys(this.templateOptions).map(key => key + '=' + encodeURIComponent(this.templateOptions[key])).join('&')
      let result = await fetch(`https://api.badge.dog/woof/${this.template}.svg?${queryString}`)
      result = await result.text()
      this.isLoading = false
      this.result = result
    }
  }
}
