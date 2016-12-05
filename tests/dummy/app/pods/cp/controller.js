import Ember from 'ember'
const {set, typeOf} = Ember

function prepareCp(options) {
  Object.keys(options).forEach((key) => {
    let value = options[key]
    if (typeOf(value) === 'string' && value.startsWith('cp.')) {
      const cpKey = value.slice(3)
      set(options, key, this.get(cpKey))
      this.addObserver(cpKey, function () {
        set(options, key, this.get(cpKey))
      })
    }
  })
}

export default Ember.Controller.extend({

  init() {
    this._super(...arguments)
    const options = this.get('config.options')

    prepareCp.call(this, options)
  },


  number: 0,

  // cp.displayText refer to the computed property instead of string
  config: {
    component: 'frost-button',
    options: {
      text: 'cp.displayText',
      priority: 'secondary',
      size: 'medium'
    }
  },

  displayText: Ember.computed('number', function () {
    return `Number: ${this.get('number')}`
  })
})
