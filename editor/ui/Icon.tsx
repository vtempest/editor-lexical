import type { JSX } from 'react';

// Import all icons
import columns3 from '../icons/editor/3-columns.svg';
import addSign from '../icons/editor/add-sign.svg';
import arrowClockwise from '../icons/editor/arrow-clockwise.svg';
import arrowCounterclockwise from '../icons/editor/arrow-counterclockwise.svg';
import bgColor from '../icons/editor/bg-color.svg';
import calendar from '../icons/editor/calendar.svg';
import camera from '../icons/editor/camera.svg';
import cardChecklist from '../icons/editor/card-checklist.svg';
import caretRightFill from '../icons/editor/caret-right-fill.svg';
import chatLeftText from '../icons/editor/chat-left-text.svg';
import chatRightDots from '../icons/editor/chat-right-dots.svg';
import chatRight from '../icons/editor/chat-right.svg';
import chatRightText from '../icons/editor/chat-right-text.svg';
import chatSquareQuote from '../icons/editor/chat-square-quote.svg';
import chevronDown from '../icons/editor/chevron-down.svg';
import clipboard from '../icons/editor/clipboard.svg';
import clockHistory from '../icons/editor/clock-history.svg';
import close from '../icons/editor/close.svg';
import code from '../icons/editor/code.svg';
import comments from '../icons/editor/comments.svg';
import copy from '../icons/editor/copy.svg';
import diagram2 from '../icons/editor/diagram-2.svg';
import download from '../icons/editor/download.svg';
import draggableBlockMenu from '../icons/editor/draggable-block-menu.svg';
import dropdownMore from '../icons/editor/dropdown-more.svg';
import figma from '../icons/editor/figma.svg';
import fileEarmarkText from '../icons/editor/file-earmark-text.svg';
import fileImage from '../icons/editor/file-image.svg';
import filetypeGif from '../icons/editor/filetype-gif.svg';
import filterLeft from '../icons/editor/filter-left.svg';
import fontColor from '../icons/editor/font-color.svg';
import fontFamily from '../icons/editor/font-family.svg';
import gear from '../icons/editor/gear.svg';
import highlighter from '../icons/editor/highlighter.svg';
import horizontalRule from '../icons/editor/horizontal-rule.svg';
import imageBroken from '../icons/editor/image-broken.svg';
import indent from '../icons/editor/indent.svg';
import journalCode from '../icons/editor/journal-code.svg';
import journalText from '../icons/editor/journal-text.svg';
import justify from '../icons/editor/justify.svg';
import link from '../icons/editor/link.svg';
import listOl from '../icons/editor/list-ol.svg';
import listUl from '../icons/editor/list-ul.svg';
import lockFill from '../icons/editor/lock-fill.svg';
import lock from '../icons/editor/lock.svg';
import markdown from '../icons/editor/markdown.svg';
import mic from '../icons/editor/mic.svg';
import minusSign from '../icons/editor/minus-sign.svg';
import outdent from '../icons/editor/outdent.svg';
import paintBucket from '../icons/editor/paint-bucket.svg';
import palette from '../icons/editor/palette.svg';
import pencilFill from '../icons/editor/pencil-fill.svg';
import plugFill from '../icons/editor/plug-fill.svg';
import plug from '../icons/editor/plug.svg';
import plusSlashMinus from '../icons/editor/plus-slash-minus.svg';
import plus from '../icons/editor/plus.svg';
import prettierError from '../icons/editor/prettier-error.svg';
import prettier from '../icons/editor/prettier.svg';
import scissors from '../icons/editor/scissors.svg';
import send from '../icons/editor/send.svg';
import squareCheck from '../icons/editor/square-check.svg';
import sticky from '../icons/editor/sticky.svg';
import successAlt from '../icons/editor/success-alt.svg';
import success from '../icons/editor/success.svg';
import table from '../icons/editor/table.svg';
import textCenter from '../icons/editor/text-center.svg';
import textLeft from '../icons/editor/text-left.svg';
import textParagraph from '../icons/editor/text-paragraph.svg';
import textRight from '../icons/editor/text-right.svg';
import trash3 from '../icons/editor/trash3.svg';
import trash from '../icons/editor/trash.svg';
import typeBold from '../icons/editor/type-bold.svg';
import typeCapitalize from '../icons/editor/type-capitalize.svg';
import typeH1 from '../icons/editor/type-h1.svg';
import typeH2 from '../icons/editor/type-h2.svg';
import typeH3 from '../icons/editor/type-h3.svg';
import typeH4 from '../icons/editor/type-h4.svg';
import typeH5 from '../icons/editor/type-h5.svg';
import typeH6 from '../icons/editor/type-h6.svg';
import typeItalic from '../icons/editor/type-italic.svg';
import typeLowercase from '../icons/editor/type-lowercase.svg';
import typeStrikethrough from '../icons/editor/type-strikethrough.svg';
import typeSubscript from '../icons/editor/type-subscript.svg';
import typeSuperscript from '../icons/editor/type-superscript.svg';
import typeUnderline from '../icons/editor/type-underline.svg';
import typeUppercase from '../icons/editor/type-uppercase.svg';
import upload from '../icons/editor/upload.svg';
import user from '../icons/editor/user.svg';
import verticalBottom from '../icons/editor/vertical-bottom.svg';
import verticalMiddle from '../icons/editor/vertical-middle.svg';
import verticalTop from '../icons/editor/vertical-top.svg';
import x from '../icons/editor/x.svg';
import youtube from '../icons/editor/youtube.svg';

const icons: Record<string, string> = {
  '3-columns': columns3,
  'columns': columns3,
  'add-sign': addSign,
  'add-comment': addSign,
  'arrow-clockwise': arrowClockwise,
  'undo': arrowCounterclockwise,
  'arrow-counterclockwise': arrowCounterclockwise,
  'redo': arrowClockwise,
  'bg-color': bgColor,
  'calendar': calendar,
  'camera': camera,
  'card-checklist': cardChecklist,
  'poll': cardChecklist,
  'caret-right-fill': caretRightFill,
  'caret-right': caretRightFill,
  'chat-left-text': chatLeftText,
  'chat-right-dots': chatRightDots,
  'chat-right': chatRight,
  'chat-right-text': chatRightText,
  'chat-square-quote': chatSquareQuote,
  'quote': chatSquareQuote,
  'chevron-down': chevronDown,
  'clipboard': clipboard,
  'clock-history': clockHistory,
  'close': close,
  'code': code,
  'comments': comments,
  'copy': copy,
  'diagram-2': diagram2,
  'download': download,
  'draggable-block-menu': draggableBlockMenu,
  'dropdown-more': dropdownMore,
  'figma': figma,
  'file-earmark-text': fileEarmarkText,
  'file-image': fileImage,
  'image': fileImage,
  'filetype-gif': filetypeGif,
  'gif': filetypeGif,
  'filter-left': filterLeft,
  'font-color': fontColor,
  'font-family': fontFamily,
  'gear': gear,
  'highlighter': highlighter,
  'highlight': highlighter,
  'horizontal-rule': horizontalRule,
  'image-broken': imageBroken,
  'indent': indent,
  'journal-code': journalCode,
  'journal-text': journalText,
  'justify': justify,
  'justify-align': justify,
  'link': link,
  'list-ol': listOl,
  'number': listOl,
  'list-ul': listUl,
  'bullet': listUl,
  'lock-fill': lockFill,
  'lock': lock,
  'markdown': markdown,
  'mic': mic,
  'minus-sign': minusSign,
  'outdent': outdent,
  'paint-bucket': paintBucket,
  'bucket': paintBucket,
  'palette': palette,
  'pencil-fill': pencilFill,
  'plug-fill': plugFill,
  'plug': plug,
  'plus-slash-minus': plusSlashMinus,
  'equation': plusSlashMinus,
  'plus': plus,
  'prettier-error': prettierError,
  'prettier': prettier,
  'scissors': scissors,
  'send': send,
  'square-check': squareCheck,
  'check': squareCheck,
  'sticky': sticky,
  'success-alt': successAlt,
  'success': success,
  'table': table,
  'text-center': textCenter,
  'center-align': textCenter,
  'text-left': textLeft,
  'left-align': textLeft,
  'text-paragraph': textParagraph,
  'paragraph': textParagraph,
  'text-right': textRight,
  'right-align': textRight,
  'trash3': trash3,
  'trash': trash,
  'clear': trash,
  'type-bold': typeBold,
  'bold': typeBold,
  'type-capitalize': typeCapitalize,
  'capitalize': typeCapitalize,
  'type-h1': typeH1,
  'h1': typeH1,
  'type-h2': typeH2,
  'h2': typeH2,
  'type-h3': typeH3,
  'h3': typeH3,
  'type-h4': typeH4,
  'h4': typeH4,
  'type-h5': typeH5,
  'h5': typeH5,
  'type-h6': typeH6,
  'h6': typeH6,
  'type-italic': typeItalic,
  'italic': typeItalic,
  'type-lowercase': typeLowercase,
  'lowercase': typeLowercase,
  'type-strikethrough': typeStrikethrough,
  'strikethrough': typeStrikethrough,
  'type-subscript': typeSubscript,
  'subscript': typeSubscript,
  'type-superscript': typeSuperscript,
  'superscript': typeSuperscript,
  'type-underline': typeUnderline,
  'underline': typeUnderline,
  'type-uppercase': typeUppercase,
  'uppercase': typeUppercase,
  'upload': upload,
  'user': user,
  'vertical-bottom': verticalBottom,
  'vertical-middle': verticalMiddle,
  'vertical-top': verticalTop,
  'x': x,
  'youtube': youtube,
  'page-break': horizontalRule,
};

export function getIconSrc(name: string): string | undefined {
  return icons[name];
}

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export default function Icon({ name, className = '', size = 20, style = {} }: IconProps): JSX.Element | null {
  const src = icons[name];
  if (!src) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  return (
    <img
      src={src}
      alt={name}
      className={`icon ${className}`}
      width={size}
      height={size}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    />
  );
}

// For backwards compatibility with <i className="icon name" /> pattern
export function IconI({ className = '' }: { className?: string }): JSX.Element | null {
  // Extract icon name from className like "icon bold" -> "bold"
  const classes = className.split(' ').filter(c => c && c !== 'icon');
  const name = classes[0];
  if (!name) return null;
  return <Icon name={name} className={classes.slice(1).join(' ')} />;
}
