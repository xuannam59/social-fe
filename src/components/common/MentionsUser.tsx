import React from 'react';
import {
  Mention,
  MentionsInput,
  type SuggestionDataItem,
} from 'react-mentions';
import defaultStyle from '@social/defaults/defaultStyle';
import { Form } from 'antd';
import AvatarUser from './AvatarUser';

// Helper function để tạo slug từ string
const createSlug = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '') // Remove spaces
    .trim();
};

const MentionsInputComponent = MentionsInput as any;
const MentionComponent = Mention as any;

interface IProps {
  inputRef: React.RefObject<any>;
  onPressEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  fieldName?: string;
}

const users = [
  {
    id: '123123123123',
    display: 'Nguyễn Trung',
    slug: createSlug('Nguyễn Trung'),
    avatar: 'https://i.pravatar.cc/100?img=1',
  },
  {
    id: '12312233123123',
    display: 'Anh Tài Nguyễn Lưu',
    slug: createSlug('Anh Tài Nguyễn Lưu'),
    avatar: 'https://i.pravatar.cc/100?img=2',
  },
  {
    id: '345345435345',
    display: 'Hân Nguyễn',
    slug: createSlug('Hân Nguyễn'),
    avatar: 'https://i.pravatar.cc/100?img=3',
  },
  {
    id: '345345435345344345',
    display: 'Nguyễn M Đức Mạnh',
    slug: createSlug('Nguyễn M Đức Mạnh'),
    avatar: 'https://i.pravatar.cc/100?img=4',
  },
  {
    id: '34534542342343534534345',
    display: 'Thu Hương',
    slug: createSlug('Thu Hương'),
    avatar: 'https://i.pravatar.cc/100?img=5',
  },
  {
    id: '345345432423423534534345',
    display: 'Nguyễn Đức Cảnh',
    slug: createSlug('Nguyễn Đức Cảnh'),
    avatar: 'https://i.pravatar.cc/100?img=6',
  },
  {
    id: '345345432423423533453654534345',
    display: 'Vũ Huy Long',
    slug: createSlug('Vũ Huy Long'),
    avatar: 'https://i.pravatar.cc/100?img=7',
  },
  {
    id: '123145345345432423423533453654534345',
    display: 'Nguyễn Mạnh Bảo Long',
    slug: createSlug('Nguyễn Mạnh Bảo Long'),
    avatar: 'https://i.pravatar.cc/100?img=8',
  },
];

const MentionsUser: React.FC<IProps> = ({
  inputRef,
  onPressEnter,
  fieldName = 'content',
}) => {
  const mentionsRef = React.useRef<any>(null);
  const [domElement, setDomElement] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    if (mentionsRef.current) {
      const timer = setTimeout(() => {
        if (mentionsRef.current) {
          let element = mentionsRef.current;

          if (mentionsRef.current.$el) {
            element = mentionsRef.current.$el;
          } else if (mentionsRef.current.querySelector) {
            element = mentionsRef.current;
          } else {
            const textarea = document.querySelector(
              `textarea[id="${fieldName}"]`
            );
            if (textarea) {
              element = textarea.parentElement || textarea;
            }
          }

          setDomElement(element);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [mentionsRef.current]);

  React.useImperativeHandle(
    inputRef,
    () => ({
      querySelector: (selector: string) => {
        if (domElement && domElement.querySelector) {
          return domElement.querySelector(selector);
        }
        return document.querySelector(selector);
      },
      textareaRef: {
        current:
          domElement?.querySelector('textarea') ||
          document.querySelector(`textarea[id="${fieldName}"]`),
      },
      getBoundingClientRect: () => {
        if (domElement && domElement.getBoundingClientRect) {
          return domElement.getBoundingClientRect();
        }

        return {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          width: 0,
          height: 0,
        };
      },
    }),
    [domElement]
  );

  const searchUsers = (query: string, callback: (data: any[]) => void) => {
    if (!query) {
      callback(users);
      return;
    }

    const searchSlug = createSlug(query);
    const filteredUsers = users.filter(user => {
      // Tìm kiếm trong cả display name và slug
      const displayMatch = user.display
        .toLowerCase()
        .includes(query.toLowerCase());
      const slugMatch = user.slug.includes(searchSlug);
      return displayMatch || slugMatch;
    });

    callback(filteredUsers);
  };

  const renderSuggestion = (
    suggestion: SuggestionDataItem,
    _search: string,
    highlightedDisplay: React.ReactNode,
    _index: number,
    focused: boolean
  ) => {
    const userData = users.find(user => user.id === suggestion.id);

    return (
      <div
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg ${
          focused && 'border border-sky-500'
        }`}
      >
        <AvatarUser avatar={userData?.avatar || ''} size={36} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {highlightedDisplay}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Form.Item name={fieldName} className="!m-0">
      <MentionsInputComponent
        ref={mentionsRef}
        placeholder="Thêm bình luận..."
        style={defaultStyle}
        allowSuggestionsAboveCursor
        onKeyDown={onPressEnter}
        id={`${fieldName}`}
      >
        <MentionComponent
          trigger="@"
          data={searchUsers}
          renderSuggestion={renderSuggestion}
          className="bg-mention"
          displayTransform={(_id: string, display: string) => `${display}`}
        />
      </MentionsInputComponent>
    </Form.Item>
  );
};

export default MentionsUser;
