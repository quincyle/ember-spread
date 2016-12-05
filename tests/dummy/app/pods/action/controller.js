import Ember from 'ember'
const {get, set, typeOf} = Ember
import createActionClosure from '../../utils/action-closure'

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

function prepareAction(options, config) {
  Object.keys(options).forEach((key) => {
    let value = options[key]

    if (typeOf(value) === 'string' && value.startsWith('actions.')) {
      let action = this.get(get(options, key))
      let actionArgs = config[key]

      if(actionArgs) {
        actionArgs.forEach((attr, index) => {
          if (typeOf(attr) === 'string' && attr.startsWith('cp.')) {
            let cpKey = attr.slice(3)
            actionArgs[index] = this.get(cpKey)
            Ember.set(options, key, createActionClosure.call(this, action, actionArgs))

            this.addObserver(cpKey, () => {
              actionArgs[index] = this.get(cpKey)
              Ember.set(options, key, createActionClosure.call(this, action, actionArgs))
            })
          } else {
            Ember.set(options, key, createActionClosure.call(this, action, actionArgs))
          }
        })
      }
    }

  })
}


export default Ember.Controller.extend({

  init() {
    this._super(...arguments)
    const options = this.get('config.options')

    // these two can be merged into one function.
    prepareCp.call(this, options)

    // prepareAction takes options object and extra config, config is a key: value pair where you can provide
    // attrs you want to curry with your action. 'cp.displayText' is refer to a cp instead of a string value
    prepareAction.call(this, options, {
      onClick: ['hello', 'cp.displayText']
    })
  },

  number: 0,

  config: {
    component: 'frost-button',
    options: {
      id: 'button-id',
      text: 'cp.displayText',
      priority: 'secondary',
      size: 'medium',
      onClick: 'actions.click'
    }
  },

  displayText: Ember.computed('number', function () {
    return `Number: ${this.get('number')}`
  }),

  actions: {
    click() {
      this.set('actionAttrs', arguments)
    }
  }
})
