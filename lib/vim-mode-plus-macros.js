/** @babel */

import { CompositeDisposable } from 'atom'

let commandQueue = []
let recording = false

// all the characters we record keypresses of
const characters = [
  'space', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-',
  '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<',
  '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
  'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
  'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
  'y', 'z', '{', '|', '}', '~'
]

export default {
  activate(_state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    const convertToCommand = (accumulator, character) => {
      const actualCharacter = character === 'space' ? ' ' : character
      accumulator[`vim-mode-plus-macros:record-insert-of-${character}`] = () => this.typeCharacter(actualCharacter)
      return accumulator
    }
    const characterCommands = characters.reduce(convertToCommand, {})

    this.subscriptions.add(atom.commands.add('atom-workspace', Object.assign(characterCommands, {
      'vim-mode-plus-macros:start-recording-macro': () => this.startRecordingMacro(),
      'vim-mode-plus-macros:stop-recording-macro': () => this.stopRecordingMacro(),
      'vim-mode-plus-macros:apply-macro': () => this.applyMacro()
    })))

    atom.commands.onDidDispatch(this.logCommand)
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  startRecordingMacro() {
    let editor = atom.views.getView(atom.workspace.getActiveTextEditor())
    editor.classList.add('recording-macro')
    commandQueue = [] // empty the queue
    recording = true
    atom.notifications.addInfo('Recording macro')
  },

  stopRecordingMacro() {
    let editor = atom.views.getView(atom.workspace.getActiveTextEditor())
    editor.classList.remove('recording-macro')
    recording = false
    atom.notifications.addInfo('Stopped recording macro')
  },

  applyMacro() {
    atom.notifications.addInfo('Applying macro')
    let editor = atom.views.getView(atom.workspace.getActiveTextEditor())
    let cursor = editor.querySelector('.cursor')
    commandQueue.forEach(command => {
      atom.commands.dispatch(cursor, command)
    })
  },

  logCommand(event) {
    if (!recording) {
      return
    }
    const commandName = event.type
    if (commandName === 'vim-mode-plus-macros:start-recording-macro') {
      return
    }
    commandQueue.push(commandName)
  },

  typeCharacter(character) {
    let editor = atom.workspace.getActiveTextEditor()
    editor.insertText(character)
  }
};
