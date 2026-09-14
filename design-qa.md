# Alphadoc 일반대화 섹션 Design QA

- final result: passed
- implementation: `http://127.0.0.1:3010/ko/product/alphadoc#general`
- source visual truth:
  - 실제 알파닥 공개 화면: `https://alphadoc.ai/`
  - 현재 대화 UI 구조: `/Users/gossa777/Documents/alphadoc/src/components/chat/ChatInput.tsx`
  - 현재 대화 UI 스타일: `/Users/gossa777/Documents/alphadoc/src/index.css`

## Viewport, density, and state

| Surface | Viewport | DPR | Captured state |
| --- | --- | --- | --- |
| Source desktop | 1280 × 900 CSS px | 2 | 공개 시작 화면, 입력창 표시 |
| Implementation desktop | 1280 × 900 CSS px | 2 | 일반 모드, 사용자 질문과 답변 표시 |
| Source mobile | 390 × 844 CSS px | 2 | 공개 시작 화면, 입력창 표시 |
| Implementation mobile | 390 × 844 CSS px | 2 | 일반 모드, 사용자 질문과 답변 표시 |

두 화면은 각 뷰포트별로 source와 implementation을 같은 비교 입력에서 함께 확인했다. 로그인이나 인증 상태를 변경하지 않았기 때문에 실제 알파닥의 인증 후 대화 화면은 현재 소스의 `ChatInput.tsx`와 `index.css`를 구조·치수 기준으로 사용했다.

## Full-page and focused comparison

- Full-page: 제품 페이지의 어두운 재질 배경과 실제 알파닥의 밝고 얇은 글래스 UI 대비가 유지된다.
- Focused chat surface: 사용자 말풍선은 `#171719`, 20px 계열 라운드와 꼬리, 14px 본문을 사용한다. 답변은 별도 아바타 없이 바로 시작한다.
- Focused composer: 모드 선택은 데스크톱 126 × 32px, 모바일 126 × 44px다. 작성기는 `44px + minmax(0, 1fr)` 구조이며 첨부 44px, 입력 셸 44px, 전송 36px를 유지한다.
- Header: 8px 인셋, 52px 높이, 26px 라운드의 플로팅 헤더와 실제 알파닥 아이콘 자산을 사용한다. 공개 페이지의 마케팅 상태 문구는 추가하지 않았다.
- Motion: 일반대화와 기존 워크스페이스 모션 모두 `12s` cycle과 `.18s` delay를 공유한다. 질문 입력, 전송, 사용자 말풍선, 답변 순서가 한 주기 안에서 이어진다.

## Comparison history

1. 첫 구현은 실제 알파닥보다 카드·배지 중심의 별도 목업처럼 보였고, 작성기 구조와 전송 버튼도 달랐다.
2. 실제 `ChatInput.tsx`와 `index.css`를 기준으로 플로팅 헤더, 직접 시작하는 답변, 분리된 첨부 버튼과 입력 셸, 원형 ArrowUp 전송 버튼으로 재구성했다.
3. 초기 회귀 검증에서 `오픈 베타` 문구가 기존 제품 페이지의 상태 카피 계약과 충돌했다. UI 형태는 유지하고 상태 문구만 제거한 뒤 다시 비교했다.
4. 데스크톱과 모바일을 동일 CSS viewport와 DPR로 재캡처했으며, 추가 조정이 필요한 시각적·구조적 불일치는 발견되지 않았다.

## Browser checks

- Desktop and mobile horizontal overflow: none
- Motion activation: `data-motion-active="true"`
- Existing workspace animation: `12s / .18s`
- General-chat animation: `12s / .18s`
- External Alphadoc UI assets: all complete with non-zero natural width
- Console logs and errors: none
- Interaction check: 이 섹션은 `aria-hidden`인 비상호작용 제품 모션이므로 클릭·키보드 동작은 적용 대상이 아니다.
