'use client';

import { Editor, EditorContent } from '@tiptap/react';
import React, { useState } from 'react';
import TextEditorButton from './TextEditorButton';
import { uploadImage } from '@/app/helpers/s3';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface IBodyEditor {
  editor: Editor | null;
  updateUploadedImagesList?: (imageKey: string) => void;
}

const BodyEditor = (props: IBodyEditor) => {
  const [isFontDropdownVisible, setIsFontDropdownVisible] = useState(false);
  const [activeFontType, setActiveFontType] = useState('Paragraph');

  function toggleBold() {
    props.editor?.chain().focus().toggleBold().run();
  }

  function toggleItalic() {
    props.editor?.chain().focus().toggleItalic().run();
  }

  function toggleStrikethrough() {
    props.editor?.chain().focus().toggleStrike().run();
  }

  function handleFontTypeChange(fontType: string) {
    if (fontType === 'h1') {
      props.editor?.chain().focus().toggleHeading({ level: 1 }).run();
      setActiveFontType('Heading 1');
    } else if (fontType === 'h2') {
      props.editor?.chain().focus().toggleHeading({ level: 2 }).run();
      setActiveFontType('Heading 2');
    } else if (fontType === 'h3') {
      props.editor?.chain().focus().toggleHeading({ level: 3 }).run();
      setActiveFontType('Heading 3');
    } else if (fontType === 'p') {
      props.editor?.chain().focus().setParagraph().run();
      setActiveFontType('Paragraph');
    }
    setIsFontDropdownVisible(false);
  }

  function toggleBulletList() {
    props.editor?.chain().focus().toggleBulletList().run();
  }

  function toggleOrderedList() {
    props.editor?.chain().focus().toggleOrderedList().run();
  }

  function toggleCodeBlock() {
    props.editor?.chain().focus().toggleCodeBlock().run();
  }

  async function insertImage(e: React.ChangeEvent<HTMLInputElement>) {
    const image = e.target.files?.[0];
    if (image) {
      const url = await uploadImage(image);
      if (url) {
        props.editor
          ?.chain()
          .insertContentAt(props.editor.state.selection.anchor, {
            type: 'image',
            attrs: { src: url, alt: 'Article image', title: 'Article image' },
          })
          .focus()
          .run();
        const splitImageUrl = url.split('/');
        if (props.updateUploadedImagesList)
          props.updateUploadedImagesList(
            splitImageUrl[splitImageUrl.length - 1]
          );
      }
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex items-center gap-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            onClick={() => setIsFontDropdownVisible(!isFontDropdownVisible)}
            className="relative bg-dark-gray px-2 py-2 border border-light-gray rounded-md"
          >
            <span>{activeFontType}</span>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                className="bg-dark-gray w-full p-2"
                onSelect={() => handleFontTypeChange('h1')}
              >
                <span>Heading 1</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="bg-dark-gray w-full p-2"
                onSelect={() => handleFontTypeChange('h2')}
              >
                <span>Heading 2</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="bg-dark-gray w-full p-2"
                onSelect={() => handleFontTypeChange('h3')}
              >
                <span>Heading 3</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="bg-dark-gray w-full p-2"
                onSelect={() => handleFontTypeChange('p')}
              >
                <span>Paragraph</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <div className="flex items-center gap-2 pr-2 border-r border-r-white border-solid">
          <TextEditorButton
            onClick={toggleBold}
            isActive={props.editor?.isActive('bold')}
            iconName="format_bold"
          />
          <TextEditorButton
            onClick={toggleItalic}
            isActive={props.editor?.isActive('italic')}
            iconName="format_italic"
          />
          <TextEditorButton
            onClick={toggleStrikethrough}
            isActive={props.editor?.isActive('strike')}
            iconName="strikethrough_s"
          />
        </div>
        <div className="flex items-center gap-4 pr-2 border-r border-r-white border-solid">
          <TextEditorButton
            onClick={toggleBulletList}
            isActive={props.editor?.isActive('bulletList')}
            iconName="format_list_bulleted"
          />
          <TextEditorButton
            onClick={toggleOrderedList}
            isActive={props.editor?.isActive('orderedList')}
            iconName="format_list_numbered"
          />
        </div>
        <div className="flex items-center gap-4">
          <TextEditorButton
            onClick={toggleCodeBlock}
            isActive={props.editor?.isActive('codeBlock')}
            iconName="code"
          />
          <label htmlFor="image-input" className="cursor-pointer">
            <span className="material-symbols-outlined">image</span>
          </label>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            name="image-input"
            id="image-input"
            onChange={insertImage}
          />
        </div>
      </div>
      <EditorContent
        editor={props.editor}
        className="text-md leading-6 border border-light-gray border-solid rounded-md p-2 [&_img]:text-center"
      />
    </div>
  );
};

export default BodyEditor;
