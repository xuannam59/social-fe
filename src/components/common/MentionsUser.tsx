import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Mention,
  MentionsInput,
  type SuggestionDataItem,
} from 'react-mentions';
import defaultStyle from '@social/defaults/defaultStyle';
import { Form } from 'antd';
import AvatarUser from './AvatarUser';
import type { IMentionUser } from '@social/types/user.type';
import { callApiFetchUserFriendList } from '@social/apis/user.api';
import { debounce } from 'lodash';
import { formatSlug } from '@social/common/convert';

const MentionsInputComponent = MentionsInput as any;
const MentionComponent = Mention as any;

interface IProps {
  inputRef: React.RefObject<any>;
  fieldName?: string;
  loading: boolean;
  onPressEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const MentionsUser: React.FC<IProps> = ({
  inputRef,
  fieldName = 'content',
  loading = false,
  onPressEnter,
}) => {
  const mentionsRef = React.useRef<any>(null);
  const [domElement, setDomElement] = React.useState<HTMLElement | null>(null);

  const [listUser, setListUser] = useState<IMentionUser[]>([]);

  const fetchUserFriendList = useCallback(async () => {
    try {
      const res = await callApiFetchUserFriendList('limit=10');
      if (res.data) {
        const users: IMentionUser[] = res.data.friends.map(user => ({
          id: user._id,
          display: user.fullname,
          avatar: user.avatar,
        }));

        setListUser(users);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchUserFriendList();
  }, [fetchUserFriendList]);

  const debouncedFetch = useMemo(
    () =>
      debounce(async (query: string, callback) => {
        try {
          const slug = formatSlug(query);
          const res = await callApiFetchUserFriendList(
            `limit=10${slug ? `&search=${slug}` : ''}`
          );
          if (res.data) {
            const users = res.data.friends.map(user => ({
              id: user._id,
              display: user.fullname,
              avatar: user.avatar,
            }));
            callback(users);
            return;
          }
        } catch (error) {
          console.log(error);
        }
      }, 200),
    []
  );

  useEffect(() => {
    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

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
  }, [fieldName]);

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
    [domElement, fieldName]
  );

  const searchUsers = (query: string, callback: (data: any[]) => void) => {
    if (!query) {
      callback(listUser);
      return;
    }

    debouncedFetch(query, callback);
  };

  const renderSuggestion = (
    suggestion: SuggestionDataItem,
    _search: string,
    highlightedDisplay: React.ReactNode,
    _index: number,
    focused: boolean
  ) => {
    const userData = listUser.find(user => user.id === suggestion.id);

    return (
      <>
        <div
          className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg ${
            focused && 'border border-sky-500'
          }`}
        >
          <AvatarUser avatar={userData?.avatar} size={36} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {highlightedDisplay}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <Form.Item name={fieldName} className="!m-0" initialValue="">
      <MentionsInputComponent
        disabled={loading}
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
