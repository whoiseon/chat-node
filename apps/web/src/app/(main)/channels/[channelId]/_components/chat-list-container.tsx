'use client';

import { useEffect } from 'react';

import {
  type ChatMessageType,
  type ChatSender,
  type ChatGroupProps,
  ChatGroup,
} from '@/app/(main)/channels/[channelId]/_components/chat';
import { useScroll } from '@/app/(main)/channels/[channelId]/_hooks/use-scroll';

const createMockId = (() => {
  let counter = 0;
  return () => {
    counter += 1;
    const random = Math.random().toString(36).slice(2, 10);
    return `msg_${Date.now().toString(36)}_${counter}_${random}`;
  };
})();

const createSender = (params: {
  id: string;
  username: string;
  displayName: string;
}): ChatSender => ({
  id: params.id,
  username: params.username,
  displayName: params.displayName,
});

const SENDER_ME = createSender({
  id: 'user_me',
  username: 'me',
  displayName: '나',
});

const SENDER_ADMIN = createSender({
  id: 'user_admin',
  username: 'admin',
  displayName: '관리자',
});

const SENDER_USER1 = createSender({
  id: 'user_1',
  username: 'user1',
  displayName: '사용자1',
});

const SENDER_USER2 = createSender({
  id: 'user_2',
  username: 'user2',
  displayName: '사용자2',
});

const createMessage = (params: {
  content: string;
  type?: ChatMessageType;
  sender: ChatSender;
  createdAt: string;
}): ChatGroupProps['messages'][number] => ({
  id: createMockId(),
  content: params.content,
  type: params.type ?? 'message',
  sender: params.sender,
  createdAt: params.createdAt,
});

const MOCK_CHAT_GROUPS: ChatGroupProps[] = [
  {
    date: '2026-03-17',
    messages: [
      createMessage({
        content: '안녕하세요, 오늘 일정 정리해볼까요?',
        sender: SENDER_ADMIN,
        createdAt: '2026-03-17T09:00:00',
      }),
      createMessage({
        content: '네\n좋습니다.',
        sender: SENDER_ME,
        createdAt: '2026-03-17T09:01:00',
      }),
      createMessage({
        content: '저도 참여할게요.',
        sender: SENDER_USER1,
        createdAt: '2026-03-17T09:02:00',
      }),
      createMessage({
        content: '우선 오늘 데일리 스탠드업은 10시에 진행합니다.',
        sender: SENDER_ADMIN,
        createdAt: '2026-03-17T09:03:00',
      }),
      createMessage({
        content: '확인했습니다.',
        sender: SENDER_ME,
        createdAt: '2026-03-17T09:04:00',
      }),
      createMessage({
        content: '회의 링크는 어디에 있나요?',
        sender: SENDER_USER2,
        createdAt: '2026-03-17T09:05:00',
      }),
      createMessage({
        content: '캘린더 초대에 링크 넣어두었습니다.',
        sender: SENDER_ADMIN,
        createdAt: '2026-03-17T09:06:00',
      }),
      createMessage({
        content: '시스템 메시지 테스트.',
        sender: SENDER_ADMIN,
        type: 'system',
        createdAt: '2026-03-17T09:07:00',
      }),
      createMessage({
        content: '오늘 채팅 UI 관련 태스크는 제가 맡을게요.',
        sender: SENDER_ME,
        createdAt: '2026-03-17T09:08:00',
      }),
      createMessage({
        content: '저는 알림 관련 로직 작업하겠습니다.',
        sender: SENDER_USER1,
        createdAt: '2026-03-17T09:09:00',
      }),
      createMessage({
        content: '좋아요, 진행 상황은 이 채널에 공유해주세요.',
        sender: SENDER_ADMIN,
        createdAt: '2026-03-17T09:10:00',
      }),
      createMessage({
        content: '지금 브랜치 만들어두었습니다.',
        sender: SENDER_ME,
        createdAt: '2026-03-17T09:11:00',
      }),
      createMessage({
        content: '디자인 시안은 오후에 공유드릴게요.',
        sender: SENDER_USER2,
        createdAt: '2026-03-17T09:12:00',
      }),
      createMessage({
        content:
          '채팅 말풍선이 실제 서비스에서 어떻게 보일지 확인하기 위해 일부러 긴 문장을 넣어보고 있습니다. 여러 줄로 자동 줄바꿈이 되는지, 모바일 화면에서도 가독성이 유지되는지 함께 체크해 주세요.',
        sender: SENDER_ME,
        createdAt: '2026-03-17T09:12:30',
      }),
      createMessage({
        content: '시안 올라오면 리뷰 맡겠습니다.',
        sender: SENDER_ME,
        createdAt: '2026-03-17T09:13:00',
      }),
      createMessage({
        content: '성능 관련해서 체크해야 할 포인트 정리해두었습니다.',
        sender: SENDER_ADMIN,
        type: 'notice',
        createdAt: '2026-03-17T09:14:00',
      }),
      createMessage({
        content: '문서 링크 공유 가능하실까요?',
        sender: SENDER_USER1,
        createdAt: '2026-03-17T09:15:00',
      }),
      createMessage({
        content: '노션에 올려두고 링크 남겼습니다.',
        sender: SENDER_ADMIN,
        type: 'notice',
        createdAt: '2026-03-17T09:16:00',
      }),
      createMessage({
        content: '저녁 전에 1차 PR 올려볼게요.',
        sender: SENDER_ME,
        createdAt: '2026-03-17T09:17:00',
      }),
      createMessage({
        content: '리뷰는 제가 담당하겠습니다.',
        sender: SENDER_USER2,
        createdAt: '2026-03-17T09:18:00',
      }),
      createMessage({
        content: '감사합니다. 리뷰 기준도 슬랙에 남겨둘게요.',
        sender: SENDER_ADMIN,
        type: 'notice',
        createdAt: '2026-03-17T09:19:00',
      }),
      createMessage({
        content: '네, 그럼 각자 진행해봅시다.',
        sender: SENDER_ME,
        createdAt: '2026-03-17T09:20:00',
      }),
    ],
  },
  {
    date: '2026-03-18',
    messages: [
      createMessage({
        content: '굿모닝입니다. 어제 작업 어떻게 되셨나요?',
        sender: SENDER_ADMIN,
        createdAt: '2026-03-18T10:00:00',
      }),
      createMessage({
        content: '채팅 리스트 렌더링까지는 마무리했습니다.',
        sender: SENDER_ME,
        createdAt: '2026-03-18T10:01:00',
      }),
      createMessage({
        content: '스크롤 동작도 자연스럽네요.',
        sender: SENDER_USER1,
        createdAt: '2026-03-18T10:02:00',
      }),
      createMessage({
        content: '오늘은 ChatItem 분기 처리 정리해보려고 합니다.',
        sender: SENDER_ME,
        createdAt: '2026-03-18T10:03:00',
      }),
      createMessage({
        content: '타 유저 메시지 UI 차이는 유지해주세요.',
        sender: SENDER_ADMIN,
        type: 'notice',
        createdAt: '2026-03-18T10:04:00',
      }),
      createMessage({
        content: '넵, 공통 레이아웃 만들고 역할별로 나눠볼게요.',
        sender: SENDER_ME,
        createdAt: '2026-03-18T10:05:00',
      }),
      createMessage({
        content: '저는 날짜 그룹 헤더 스타일링 작업하겠습니다.',
        sender: SENDER_USER2,
        createdAt: '2026-03-18T10:06:00',
      }),
      createMessage({
        content:
          '실제 유저들이 남기는 메시지는 짧은 단문도 있지만, 이렇게 기능 설명이나 문제 상황을 자세히 풀어 쓰는 장문의 텍스트도 꽤 자주 등장합니다. 이런 케이스에서 말풍선이 너무 넓어지지 않도록 제한하는 게 UX 상 더 좋습니다.',
        sender: SENDER_ADMIN,
        createdAt: '2026-03-18T10:06:30',
      }),
      createMessage({
        content: '시스템 메시지 테스트.',
        sender: SENDER_ADMIN,
        type: 'system',
        createdAt: '2026-03-18T10:07:00',
      }),
      createMessage({
        content: '날짜 포맷은 yyyy-MM-dd 그대로 가죠?',
        sender: SENDER_USER1,
        createdAt: '2026-03-18T10:08:00',
      }),
      createMessage({
        content: '네, 우선은 그대로 두고 나중에 locale 맞춰보죠.',
        sender: SENDER_ADMIN,
        createdAt: '2026-03-18T10:09:00',
      }),
      createMessage({
        content: 'chat-list-container에 목업 데이터도 넣어두었습니다.',
        sender: SENDER_ME,
        createdAt: '2026-03-18T10:10:00',
      }),
      createMessage({
        content: 'admin 쪽이랑 web 쪽 date-fns 공유 설정도 확인했습니다.',
        sender: SENDER_ME,
        type: 'notice',
        createdAt: '2026-03-18T10:11:00',
      }),
      createMessage({
        content: '좋아요, 그럼 공통 유틸 패키지는 나중에 분리하죠.',
        sender: SENDER_ADMIN,
        createdAt: '2026-03-18T10:12:00',
      }),
      createMessage({
        content: '테스트 데이터 20개씩이라 동작 확인하기 좋네요.',
        sender: SENDER_USER2,
        createdAt: '2026-03-18T10:13:00',
      }),
      createMessage({
        content:
          '예를 들어, 고객센터 문의나 이슈 리포트처럼 맥락을 길게 설명해야 하는 상황에서는 4줄에서 6줄 정도의 길이가 되는 메시지가 자주 보입니다. 이럴 때도 현재 채팅 UI가 자연스럽게 보여야 합니다.',
        sender: SENDER_USER1,
        createdAt: '2026-03-18T10:13:30',
      }),
      createMessage({
        content: '모바일 레이아웃도 한번 같이 확인해보겠습니다.',
        sender: SENDER_USER1,
        createdAt: '2026-03-18T10:14:00',
      }),
      createMessage({
        content: '반응형 깨지는 부분 있으면 캡처 남겨주세요.',
        sender: SENDER_ADMIN,
        type: 'notice',
        createdAt: '2026-03-18T10:15:00',
      }),
      createMessage({
        content: '알겠습니다. 크롬/사파리 위주로 먼저 볼게요.',
        sender: SENDER_ME,
        createdAt: '2026-03-18T10:16:00',
      }),
      createMessage({
        content: '접근성 관련 포커스 스타일도 체크 부탁드립니다.',
        sender: SENDER_ADMIN,
        type: 'notice',
        createdAt: '2026-03-18T10:17:00',
      }),
      createMessage({
        content: '네, 키보드 네비게이션까지 보겠습니다.',
        sender: SENDER_ME,
        createdAt: '2026-03-18T10:18:00',
      }),
      createMessage({
        content: '이 채널에 진행 상황 계속 공유해주세요.',
        sender: SENDER_ADMIN,
        createdAt: '2026-03-18T10:19:00',
      }),
      createMessage({
        content: '넵, 작업 시작하겠습니다.',
        sender: SENDER_ME,
        createdAt: '2026-03-18T10:20:00',
      }),
    ],
  },
];

export function ChatListContainer() {
  const { scrollToBottom } = useScroll();
  useEffect(() => {
    // 접속 시 스크롤 최하단으로
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    <div className="flex-1">
      {MOCK_CHAT_GROUPS.map((group) => (
        <ChatGroup
          key={group.date}
          date={group.date}
          messages={group.messages}
        />
      ))}
    </div>
  );
}
