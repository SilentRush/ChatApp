import {Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap, convertToRaw, convertFromRaw, Entity,ContentState, AtomicBlockUtils, genKey} from 'draft-js';
import React from 'react';
import PrismDecorator from 'draft-js-prism';
import Immutable from 'immutable';

export default class TextEditor extends React.Component {
  constructor(props) {
    super(props);

    const customBlockRenderMap = Immutable.Map({
      'ticketDetails': {
        element: 'div',
      },
      'center': {
        element: 'div',
      },
      'left': {
        element: 'div',
      },
      'right': {
        element: 'div'
      }
    });

    this.decorator = new PrismDecorator({defaultSyntax: 'javascript'});
    this.state = {
      blockRenderMap: DefaultDraftBlockRenderMap.merge(customBlockRenderMap),
      editorState: EditorState.createEmpty(this.decorator),
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => {
      this.setState({editorState});
      if(this.props.changeBody)
        this.props.changeBody({rawbody:convertToRaw(editorState.getCurrentContent()),body:editorState.getCurrentContent().getPlainText()});
    };

    this.submitClick = () => {
      this.props.submitComment({rawbody:convertToRaw(this.state.editorState.getCurrentContent()),body:this.state.editorState.getCurrentContent().getPlainText()});
      this.setState({editorState: EditorState.createEmpty(this.decorator)});
    }

    this.updateClick = () => {
      this.props.updateComment({rawbody:convertToRaw(this.state.editorState.getCurrentContent()),body:this.state.editorState.getCurrentContent().getPlainText()});
    }

    this.ticketDetails = (ticketid) => this._ticketDetails(ticketid);
    this.color = (e) => this._color(e);
    this.colorClick = (e) => this._color(e);

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);

    this.handlePaste = (f) => {
      var image = document.createElement('img');
      image.src = window.URL.createObjectURL(f[0]);
      document.body.appendChild(image);
    }



  }

  componentDidMount(){
    if(this.props.content){
      const content = convertFromRaw(this.props.content);
      const editorState = EditorState.push(this.state.editorState, content);
      this.setState({editorState: editorState});
    }
  }



  _ticketDetails(ticketid){
    var entityKey = Entity.create(
      'ticketDetails',
      'IMMUTABLE',
      {ticketid:ticketid}
    );
    //let {editorState} = insertMediaBlock(this.state.editorState, 'custom', entityKey);
    this.setState({editorState: AtomicBlockUtils.insertAtomicBlock(
              this.state.editorState,
              entityKey,
              ' '
            ) });
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  myBlockRenderer(contentBlock) {
    const type = contentBlock.getType();

    if (type === 'atomic') {
      return {
        component: atomicHandler,
        editable: false,
      };
    }
  }

  render() {
    const {editorState} = this.state;


    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    var textEditor, btn;
    if(this.props.isEdit){
      if(!this.props.changeBody){
        if(this.props.isUpdate)
          btn = <input type="button" value="Update" className="btn btn-primary" onClick={this.updateClick} />;
        else {
          btn = <input type="button" value="Submit" className="btn btn-success" onClick={this.submitClick} />
        }
      }
      textEditor =
      <div className="RichEditor-root">
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <CustomBlockControls
          ticketDetails = {this.ticketDetails}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            key = {this.props.parKey}
            blockRenderMap={this.state.blockRenderMap}
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            ref="editor"
            spellCheck={true}
            blockRendererFn={this.myBlockRenderer}
            handlePastedFiles={this.handlePaste}
          />
        </div>
        {btn}
      </div>;
    }
    else{
      textEditor =
      <div className="RichEditor-root">
        <div onClick={this.focus}>
          <Editor
            blockRenderMap={this.state.blockRenderMap}
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            ref="editor"
            spellCheck={false}
            blockRendererFn={this.myBlockRenderer}
            readOnly={true}
          />
        </div>
      </div>;
    }

    return (
      <div>
        {textEditor}
      </div>
    );
  }
}

const atomicHandler = (props) => {
   const entity = Entity.get(props.block.getEntityAt(0));
   const type = entity.getType();

   let component;
   if (type === 'ticketDetails') {
     const {ticketid} = entity.getData();
     component = <CalendarContainer ticketid={ticketid} />;
   } else if (type === 'center') {
     component = <div></div>
   }

   return component;
 }

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
  HIGHLIGHT: {
    backgroundColor: 'rgb(133, 251, 255)',
    color: 'black'
  },
  H1: {
    fontSize: '3.5em'
  },
  H2: {
    fontSize: '2.0em'
  },
  H3: {
    fontSize: '1.5em'
  },
  H4: {
    fontSize: '0.8em'
  }
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return '.RichEditor-blockquote';
    case 'left': return 'editorAlignLeft';
    case 'center': return 'editorAlignCenter';
    case 'right': return 'editorAlignRight';
    default: return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
  {label: <span className="glyphicon glyphicon-align-left" key="left"></span>, style: 'left'},
  {label: <span className="glyphicon glyphicon-align-center" key="center"></span>, style: 'center'},
  {label: <span className="glyphicon glyphicon-align-right" key="right"></span>, style: 'right'}
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.style}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
  {label: 'Highlight', style:'HIGHLIGHT'},
  {label: 'H1', style:'H1'},
  {label: 'H2', style:'H2'},
  {label: 'H3', style:'H3'},
  {label: 'H4', style:'H4'}
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

const CustomBlockControls = (props) => {
  return (
    <div className="RichEditor-controls">
      <TicketInputContainer ticketDetails={props.ticketDetails} />
    </div>
  );
};
