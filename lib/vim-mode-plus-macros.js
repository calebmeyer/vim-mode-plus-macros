/** @babel */

import { CompositeDisposable } from 'atom';

export default {
  activate(_state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'vim-mode-plus-macros:start-recording-macro': () => this.startRecordingMacro()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  startRecordingMacro() {
    console.log('VimModePlusMacros has started recording a macro');
    let editor = atom.workspace.getActiveTextEditor();
    console.log(editor.classList);
  }
};
