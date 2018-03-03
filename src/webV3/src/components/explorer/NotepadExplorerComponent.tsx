import * as React from 'react';
import './NotepadExplorerComponent.css';
import { INote, INotepad, ISection } from '../../types/NotepadTypes';
import { Icon } from 'react-materialize';
import TreeView from 'react-treeview';
import { generateGuid } from '../../util';
import ExplorerOptionsComponent from './ExplorerOptionsComponent';

export interface INotepadExplorerComponentProps {
	notepad?: INotepad;
	currentNote?: INote;
	isFullScreen: boolean;
	flipFullScreenState?: () => void;
	deleteNotepad?: (title: string) => void;
}

export default class NotepadExplorerComponent extends React.Component<INotepadExplorerComponentProps> {
	render() {
		const { notepad, currentNote, isFullScreen, flipFullScreenState, deleteNotepad } = this.props;

		const notepadExplorerStyle = {
			display: 'initial'
		};
		if (isFullScreen) notepadExplorerStyle.display = 'none';

		// Generate TreeViews
		const treeViews: JSX.Element[] = [];
		((notepad || {} as INotepad).sections || [])
			.forEach((section: ISection) => treeViews.push(this.generateSectionTreeView(section)));

		return (
			<div id="notepad-explorer" style={notepadExplorerStyle}>
				{
					!!notepad &&
					<div style={{paddingBottom: '200px'}}>
						<a href="#!" onClick={flipFullScreenState} style={{color: 'white', paddingRight: '5px', fontSize: '24px'}}>»</a>
						<strong style={{display: 'inline-flex'}}>
							{notepad.title}
							<ExplorerOptionsComponent objToEdit={notepad} type="notepad" deleteNotepad={deleteNotepad} />
						</strong>
						{treeViews}
					</div>
				}
			</div>
		);
	}

	private generateSectionTreeView(section: ISection): JSX.Element {
		const nodeLabelStyle = {
			display: 'inline-flex',
			verticalAlign: 'middle',
			paddingBottom: '5px',
			paddingTop: '5px'
		};

		const childSections: JSX.Element[] = [];
		((section || {} as ISection).sections || [])
			.forEach((child: ISection) => childSections.push(this.generateSectionTreeView(child)));

		const childNotes: JSX.Element[] = [];
		((section || {} as ISection).notes || [])
			.forEach((child: INote) => childNotes.push(
				<div className="explorer-note" key={generateGuid()}>
					<span><a href="#!" style={{color: 'white'}}><Icon>note</Icon> {child.title}</a>
					<ExplorerOptionsComponent objToEdit={child} type="note" /></span>
				</div>
			));

		return (
			<TreeView
				key={generateGuid()}
				nodeLabel={<span style={nodeLabelStyle}><Icon>book</Icon> {section.title} <ExplorerOptionsComponent objToEdit={section} type="section" /></span>}
				defaultCollapsed={true}>
				{childSections}
				{childNotes}
			</TreeView>
		);
	}
}
