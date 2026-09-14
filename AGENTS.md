# Viore public website repository rules

이 저장소는 주식회사 바이오레(Viore Inc.)의 공개 웹사이트를 담당한다.

## Viore 공통 아키텍처 계약

- 기술·제품·회사 소개를 수정하기 전에
  [`.viore/architecture-contract.md`](.viore/architecture-contract.md)의
  `public-safe` 계약을 읽는다.
- 현재 계약 버전은 `2026-08-11.1`이며 내부 단일 진실 원본은 비공개
  `viore-alpha/viore-architecture` 저장소다.
- 공개 카피는 저장소 구현, 제품 통합, 배포와 운영 상태를 서로 섞지 않는다.
- AlphaImage는 구현된 정적 이미지 artifact 기술로 표현하되 Alphadoc 사용자
  workflow의 전면 운영, 환자정보 처리 준비 또는 법적 적합성으로 확대하지 않는다.
- AlphaLayer는 선택된 보호 텍스트 경로에 연결된 기술 경계로 표현하되 같은 범위를
  넘어 전면 운영 또는 법적 적합성이 확인된 것으로 표현하지 않는다.
- AlphaSeal은 지원되는 1:1 대화 본문 암호화로 한정하며 그룹 대화, 완전한 순방향
  비밀성, 메타데이터 비공개 또는 환자정보 적합성으로 확대하지 않는다.
- AlphaDoc Engine을 자체 LLM 또는 검증되지 않은 범용 provider platform으로
  표현하지 않는다.
- 공급자, 모델, prompt, routing, token, 평가 임계값과 내부 보안 경계를 공개하지
  않는다.
- 검증되지 않은 환자정보 활용, 파트너 연동, 완전한 익명화, 무위험 주장을 하지
  않는다.

## 작업 원칙

- 기본 답변은 한국어로 한다.
- 요청과 직접 관련된 파일만 최소한으로 변경한다.
- 실제 렌더링, responsive 화면, 테스트와 production route를 구분해 검증한다.
- `main`에 직접 커밋하지 않고 작업 브랜치와 PR을 사용한다.
- `.env*`, `.vercel`, 빌드 산출물, 비밀정보를 커밋하지 않는다.
