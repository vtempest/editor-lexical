
import type {LexicalEditor} from 'lexical';
import type {JSX} from 'react';

import {$createCodeNode, $isCodeNode} from '@lexical/code';
import {
  editorStateFromSerializedDocument,
  exportFile,
  SerializedDocument,
  serializedDocumentFromEditorState,
} from '@lexical/file';
import {$generateHtmlFromNodes} from '@lexical/html';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@lexical/markdown';
import {useCollaborationContext} from '@lexical/react/LexicalCollaborationContext';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';
import {CONNECTED_COMMAND, TOGGLE_CONNECT_COMMAND} from '@lexical/yjs';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isParagraphNode,
  CLEAR_EDITOR_COMMAND,
  CLEAR_HISTORY_COMMAND,
  COLLABORATION_TAG,
  COMMAND_PRIORITY_EDITOR,
  HISTORIC_TAG,
} from 'lexical';
import {Download, File as FileIcon, FileJson, FileText, List} from 'lucide-react';
import {useCallback, useEffect, useState} from 'react';

import {INITIAL_SETTINGS} from '../../appSettings';
import {useSettings} from '../../context/SettingsContext';
import useFlashMessage from '../../hooks/useFlashMessage';
import useModal from '../../hooks/useModal';
import Button from '../../ui/Button';
import DropDown, {DropDownItem} from '../../ui/DropDown';
import Icon from '../../ui/Icon';
import {docFromHash, docToHash} from '../../utils/docSerialization';
import {PLAYGROUND_TRANSFORMERS} from '../MarkdownTransformers';
import mammoth from 'mammoth';
import {
  SPEECH_TO_TEXT_COMMAND,
  SUPPORT_SPEECH_RECOGNITION,
} from '../SpeechToTextPlugin';
import {SHOW_VERSIONS_COMMAND} from '../VersionsPlugin';

async function sendEditorState(editor: LexicalEditor): Promise<void> {
  const stringifiedEditorState = JSON.stringify(editor.getEditorState());
  try {
    await fetch('http://localhost:1235/setEditorState', {
      body: stringifiedEditorState,
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'POST',
    });
  } catch {
    // NO-OP
  }
}

async function validateEditorState(editor: LexicalEditor): Promise<void> {
  const stringifiedEditorState = JSON.stringify(editor.getEditorState());
  let response = null;
  try {
    response = await fetch('http://localhost:1235/validateEditorState', {
      body: stringifiedEditorState,
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'POST',
    });
  } catch {
    // NO-OP
  }
  if (response !== null && response.status === 403) {
    throw new Error(
      'Editor state validation failed! Server did not accept changes.',
    );
  }
}

async function shareDoc(doc: SerializedDocument): Promise<void> {
  const url = new URL(window.location.toString());
  url.hash = await docToHash(doc);
  const newUrl = url.toString();
  window.history.replaceState({}, '', newUrl);
  await window.navigator.clipboard.writeText(newUrl);
}

async function importDocxFile(editor: LexicalEditor, file: File): Promise<void> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({arrayBuffer});
  const html = result.value;

  editor.update(() => {
    const root = $getRoot();
    root.clear();

    // Create a temporary div to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const textContent = doc.body.textContent || '';

    // Split by paragraphs and create paragraph nodes
    const lines = textContent.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      // If no content, create an empty paragraph
      const paragraph = $createParagraphNode();
      root.append(paragraph);
    } else {
      lines.forEach(line => {
        if (line.trim()) {
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode(line));
          root.append(paragraph);
        }
      });
    }
  });
}

async function importMarkdownFile(
  editor: LexicalEditor,
  file: File,
  shouldPreserveNewLines: boolean,
): Promise<void> {
  const text = await file.text();
  editor.update(() => {
    $convertFromMarkdownString(
      text,
      PLAYGROUND_TRANSFORMERS,
      undefined,
      shouldPreserveNewLines,
    );
  });
}

async function importCustomFile(
  editor: LexicalEditor,
  shouldPreserveNewLines: boolean,
): Promise<void> {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.docx,.md,.markdown,.json';

  input.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.docx')) {
      await importDocxFile(editor, file);
    } else if (fileName.endsWith('.md') || fileName.endsWith('.markdown')) {
      await importMarkdownFile(editor, file, shouldPreserveNewLines);
    } else if (fileName.endsWith('.json')) {
      // Use the original importFile from @lexical/file
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        try {
          const json = JSON.parse(content);
          const editorState = editorStateFromSerializedDocument(editor, json);
          editor.setEditorState(editorState);
        } catch (error) {
          console.error('Failed to import JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  input.click();
}

export default function ActionsPlugin({
  shouldPreserveNewLinesInMarkdown,
  useCollabV2,
}: {
  shouldPreserveNewLinesInMarkdown: boolean;
  useCollabV2: boolean;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [isSpeechToText, setIsSpeechToText] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [modal, showModal] = useModal();
  const showFlashMessage = useFlashMessage();
  const {isCollabActive} = useCollaborationContext();
  const {
    settings: {showTableOfContents},
    setOption,
  } = useSettings();
  useEffect(() => {
    if (INITIAL_SETTINGS.isCollab) {
      return;
    }
    docFromHash(window.location.hash).then((doc) => {
      if (doc && doc.source === 'Playground') {
        editor.setEditorState(editorStateFromSerializedDocument(editor, doc));
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
      }
    });
  }, [editor]);
  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      editor.registerCommand<boolean>(
        CONNECTED_COMMAND,
        (payload) => {
          const isConnected = payload;
          setConnected(isConnected);
          return false;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(
      ({dirtyElements, prevEditorState, tags}) => {
        // If we are in read only mode, send the editor state
        // to server and ask for validation if possible.
        if (
          !isEditable &&
          dirtyElements.size > 0 &&
          !tags.has(HISTORIC_TAG) &&
          !tags.has(COLLABORATION_TAG)
        ) {
          validateEditorState(editor);
        }
        editor.getEditorState().read(() => {
          const root = $getRoot();
          const children = root.getChildren();

          if (children.length > 1) {
            setIsEditorEmpty(false);
          } else {
            if ($isParagraphNode(children[0])) {
              const paragraphChildren = children[0].getChildren();
              setIsEditorEmpty(paragraphChildren.length === 0);
            } else {
              setIsEditorEmpty(false);
            }
          }
        });
      },
    );
  }, [editor, isEditable]);

  const handleMarkdownToggle = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();
      if ($isCodeNode(firstChild) && firstChild.getLanguage() === 'markdown') {
        $convertFromMarkdownString(
          firstChild.getTextContent(),
          PLAYGROUND_TRANSFORMERS,
          undefined, // node
          shouldPreserveNewLinesInMarkdown,
        );
      } else {
        const markdown = $convertToMarkdownString(
          PLAYGROUND_TRANSFORMERS,
          undefined, //node
          shouldPreserveNewLinesInMarkdown,
        );
        const codeNode = $createCodeNode('markdown');
        codeNode.append($createTextNode(markdown));
        root.clear().append(codeNode);
        if (markdown.length === 0) {
          codeNode.select();
        }
      }
    });
  }, [editor, shouldPreserveNewLinesInMarkdown]);

  return (
    <>
      {SUPPORT_SPEECH_RECOGNITION && (
        <button
          onClick={() => {
            editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
            setIsSpeechToText(!isSpeechToText);
          }}
          className={
            'action-button action-button-mic ' +
            (isSpeechToText ? 'active' : '')
          }
          title="Speech To Text"
          aria-label={`${
            isSpeechToText ? 'Enable' : 'Disable'
          } speech to text`}>
          <Icon name="mic" />
        </button>
      )}
      <button
        className="action-button import"
        onClick={() => importCustomFile(editor, shouldPreserveNewLinesInMarkdown)}
        title="Import"
        aria-label="Import DOCX, Markdown, or JSON file">
        <Icon name="upload" />
      </button>

      <DropDown
        buttonClassName="action-button export"
        buttonAriaLabel="Export"
        buttonIcon={<Download size={18} />}
        hideChevron={true}
        stopCloseOnClickSelf={true}>
        <DropDownItem
          onClick={() => {
            exportFile(editor, {
              fileName: `Playground ${new Date().toISOString()}`,
              source: 'Playground',
            });
          }}
          className="item">
          <div className="icon-text-container">
            <FileJson size={14} />
            <span className="text">Export JSON</span>
          </div>
        </DropDownItem>
        <DropDownItem
          onClick={() => {
            editor.getEditorState().read(() => {
              const markdown = $convertToMarkdownString(
                PLAYGROUND_TRANSFORMERS,
                undefined,
                shouldPreserveNewLinesInMarkdown,
              );
              const blob = new Blob([markdown], {type: 'text/markdown'});
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Playground ${new Date().toISOString()}.md`;
              a.click();
              URL.revokeObjectURL(url);
            });
          }}
          className="item">
          <div className="icon-text-container">
            <FileIcon size={14} />
            <span className="text">Export Markdown</span>
          </div>
        </DropDownItem>
        <DropDownItem
          onClick={() => {
            editor.getEditorState().read(() => {
              const html = $generateHtmlFromNodes(editor, null);
              const blob = new Blob([html], {type: 'text/html'});
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Playground ${new Date().toISOString()}.html`;
              a.click();
              URL.revokeObjectURL(url);
            });
          }}
          className="item">
          <div className="icon-text-container">
            <FileText size={14} />
            <span className="text">Export HTML</span>
          </div>
        </DropDownItem>
        <DropDownItem
          onClick={() => {
            editor.getEditorState().read(() => {
              const html = $generateHtmlFromNodes(editor, null);
              const blob = new Blob([html], {type: 'application/msword'});
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Playground ${new Date().toISOString()}.doc`;
              a.click();
              URL.revokeObjectURL(url);
            });
          }}
          className="item">
          <div className="icon-text-container">
            <FileText size={14} />
            <span className="text">Export DOCX</span>
          </div>
        </DropDownItem>
        <DropDownItem
          onClick={() => {
            editor.getEditorState().read(() => {
              const html = $generateHtmlFromNodes(editor, null);
              const clipboardItem = new ClipboardItem({
                'text/html': new Blob([html], {type: 'text/html'}),
                'text/plain': new Blob([html], {type: 'text/plain'}),
              });
              navigator.clipboard
                .write([clipboardItem])
                .then(() => showFlashMessage('Copied to clipboard'));
            });
          }}
          className="item">
          <div className="icon-text-container">
            <FileText size={14} />
            <span className="text">Google Docs (Copy)</span>
          </div>
        </DropDownItem>
      </DropDown>

      <button
        className="action-button share"
        disabled={isCollabActive || INITIAL_SETTINGS.isCollab}
        onClick={() =>
          shareDoc(
            serializedDocumentFromEditorState(editor.getEditorState(), {
              source: 'Playground',
            }),
          ).then(
            () => showFlashMessage('URL copied to clipboard'),
            () => showFlashMessage('URL could not be copied to clipboard'),
          )
        }
        title="Share"
        aria-label="Share Playground link to current editor state">
        <Icon name="send" />
      </button>

      <button
        className="action-button"
        onClick={handleMarkdownToggle}
        title="Convert From Markdown"
        aria-label="Convert from markdown">
        <Icon name="markdown" />
      </button>
      <button
        className={`action-button ${showTableOfContents ? 'active' : ''}`}
        onClick={() => {
          setOption('showTableOfContents', !showTableOfContents);
        }}
        title="Table of Contents"
        aria-label={`${showTableOfContents ? 'Hide' : 'Show'} table of contents`}
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <List size={18} strokeWidth={2} style={{opacity: showTableOfContents ? 1 : 0.6}} />
      </button>
      {isCollabActive && (
        <>
          <button
            className="action-button connect"
            onClick={() => {
              editor.dispatchCommand(TOGGLE_CONNECT_COMMAND, !connected);
            }}
            title={`${
              connected ? 'Disconnect' : 'Connect'
            } Collaborative Editing`}
            aria-label={`${
              connected ? 'Disconnect from' : 'Connect to'
            } a collaborative editing server`}>
            <Icon name={connected ? 'plug' : 'plug-fill'} />
          </button>
          {useCollabV2 && (
            <button
              className="action-button versions"
              onClick={() => {
                editor.dispatchCommand(SHOW_VERSIONS_COMMAND, undefined);
              }}>
              <Icon name="clock" />
            </button>
          )}
        </>
      )}
      {modal}
    </>
  );
}

function ShowClearDialog({
  editor,
  onClose,
}: {
  editor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  return (
    <>
      Are you sure you want to clear the editor?
      <div className="Modal__content">
        <Button
          onClick={() => {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
            editor.focus();
            onClose();
          }}>
          Clear
        </Button>{' '}
        <Button
          onClick={() => {
            editor.focus();
            onClose();
          }}>
          Cancel
        </Button>
      </div>
    </>
  );
}
