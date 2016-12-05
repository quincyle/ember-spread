import Ember from 'ember'
const {typeOf} = Ember

export function create (action, actionArgs = []) {
  Ember.assert('expected actionArgs to be array.', typeOf(actionArgs) === 'array')
  let context = this
  let actionArgsLength = actionArgs.length
  let wrapperFunc

  if (actionArgsLength > 0) {
    wrapperFunc = function (...passedArguments) {
      let args = new Array(actionArgsLength + passedArguments.length)

      for (let i = 0; i < actionArgsLength; i++) {
        args[i] = actionArgs[i]
      }

      for (let i = 0; i < passedArguments.length; i++) {
        args[i + actionArgsLength] = passedArguments[i]
      }

      return action.apply(context, args)
    }
  } else {
    wrapperFunc = function () {
      return action.apply(context, arguments)
    }
  }

  return wrapperFunc
}



export default create
