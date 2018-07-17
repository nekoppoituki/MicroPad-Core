import { IStoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import NotepadExplorerComponent, { INotepadExplorerComponentProps } from '../components/explorer/NotepadExplorerComponent';
import { INotepadsStoreState, INotepadStoreState } from '../types/NotepadTypes';
import { Action } from 'redux';
import { actions } from '../actions';
import { FlatNotepad, Note } from 'upad-parse/dist';
import { ThemeValues } from '../ThemeValues';

let notepad: FlatNotepad | undefined;
export function mapStateToProps({ notepads, explorer, meta, currentNote }: IStoreState) {
	let note: Note | undefined = undefined;
	if (currentNote.ref.length !== 0) {
		note = notepads.notepad!.item!.notes[currentNote.ref];
	}

	notepad = ((notepads || <INotepadsStoreState> {}).notepad || <INotepadStoreState> {}).item;

	return {
		notepad: (!!notepad) ? notepad.toNotepad() : undefined,
		openSections: explorer.openSections,
		isFullScreen: meta.isFullScreen,
		openNote: note,
		theme: ThemeValues[meta.theme]
	};
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): Partial<INotepadExplorerComponentProps> {
	return {
		flipFullScreenState: () => dispatch(actions.flipFullScreenState(undefined)),
		deleteNotepad: (title: string) => dispatch(actions.deleteNotepad(title)),
		exportNotepad: () => dispatch(actions.exportNotepad(undefined)),
		loadNote: (ref: string) => dispatch(actions.loadNote.started(ref)),
		expandSection: (guid: string) => dispatch(actions.expandSection(guid)),
		collapseSection: (guid: string) => dispatch(actions.collapseSelection(guid)),
		renameNotepad: newTitle => dispatch(actions.renameNotepad.started(newTitle)),
		deleteNotepadObject: internalId => dispatch(actions.deleteNotepadObject(internalId)),
		renameNotepadObject: params => dispatch(actions.renameNotepadObject(params)),
		expandAll: () => dispatch(actions.expandAllExplorer.started(undefined)),
		collapseAll: () => dispatch(actions.collapseAllExplorer(undefined)),
		newSection: obj => dispatch(actions.newSection(obj)),
		newNote: obj => dispatch(actions.newNote(obj)),
		expandFromNote: note => {
			if (!notepad) return;
			dispatch(actions.expandFromNote({
				notepad,
				note: notepad.notes[note.internalRef]
			}));
		},
		print: () => dispatch(actions.print.started(undefined))
	};
}

export default connect<INotepadExplorerComponentProps>(mapStateToProps, mapDispatchToProps)(NotepadExplorerComponent);
