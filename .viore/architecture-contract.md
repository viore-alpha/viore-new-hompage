# Viore Public Architecture Claim Contract

**Contract version:** `2026-10-26.1`
**Distribution profile:** public-safe

## Public-safe portfolio

- AlphaEvidence: 의료 근거의 출처·권리·버전·검색 기반
- AlphaDoc Engine: 근거와 사용자 맥락을 제품 workflow로 연결하는 실행 계층
- AlphaDocument: 문서와 문서 이미지의 구조를 일관되게 만드는 artifact engine
- AlphaImage: 정적 이미지 입력을 안전하고 일관된 artifact로 만드는 기술 경계
- AlphaLayer: 선택된 보호 텍스트 경로에 연결된 외부 AI 실행 통제 기술 경계
- AlphaSeal: 지원되는 1:1 대화 본문을 참여자 브라우저 사이에서 종단간 암호화하는 기술 경계
- 일방향 AI 구조: 지침, 문헌, 모델과 보안 업데이트를 바이오레에서 기관 환경으로 한 방향으로 보내고 기관의 문서, 질문, 답변, 노트는 기관 환경에 두는 배포 구조. 첫 기관(KMI 한국의학연구소) 사내망에 적용
- 사내망·분리 클라우드 알파닥: 같은 알파닥을 기관의 사내망 또는 기관별로 분리한 클라우드에 설치하는 배포 형태. KMI 사내망에 설치, 공개 기반 모델로 구동
- 기관 단위 보안 체계(Zero Trust): 요청 인증과 권한 확인, 민감정보 탐지·치환과 토큰 매핑, 입력·자료 검증, 허용 모델 호출, 응답 검증·복원, 감사 기록과 보관 정책. 구축 중
- 의료 특화 AI 모델(V1): 검증된 공개 기반 모델 위에 의료 지식을 미세조정하는 모델. 개발 중

## Claim rules

1. 구현, 통합 진행, 설계, 계획 상태를 구분한다.
2. AlphaImage의 내부 제한 검증을 Alphadoc 사용자 workflow의 전면 운영,
   환자정보 처리 준비 또는 법적 적합성으로 표현하지 않는다. AlphaLayer도 선택된
   보호 경로를 넘어 같은 주장을 하지 않는다.
3. AlphaSeal은 지원되는 1:1 대화 본문에 한정한다. 그룹 대화, 완전한 순방향
   비밀성, 메타데이터 비공개 또는 환자정보 적합성으로 확대하지 않는다.
4. AlphaDoc Engine을 자체 LLM 또는 완성된 범용 provider platform으로 표현하지 않는다.
5. 기반 오픈소스·인프라·외부 모델을 Viore 자체 기술로 재분류하지 않는다.
6. 공급자, 모델, prompt, routing, token, 평가 임계값을 공개하지 않는다.
7. 공개 수치에는 기준일과 정의를 붙이고 live 증거 없이 갱신하지 않는다.
8. 환자정보, 파트너 연동, 완전한 익명화·무위험 표현은 검증과 승인이 없으면 사용하지 않는다.
9. 일방향 AI 구조는 데이터가 머무는 위치와 흐름에 관한 설계로 표현한다. 기관의
   개인정보 처리 근거나 법적 적합성으로 확대하지 않는다.
10. 외부 AI 미사용, 기관 데이터 반출 없음, 기관 데이터 비학습은 사내망과 분리
    클라우드 배포에 대해서만 쓴다. 개인 가입 경로는 확인 전까지 넣지 않는다.
11. 기관 단위 보안 체계(Zero Trust)는 구축 중으로 표현한다. 공개 범위는 IR 공개본과
    같은 단계 이름까지이며 탐지 방식, 기준값, 내부 구성 요소 이름은 공개하지 않는다.
12. 의료 특화 AI 모델은 개발 중으로 표현한다. 성능 수치, 기반 모델 이름, 평가
    기준값을 공개하지 않는다. 기관에서 쓰는 현재 모델은 공개 기반 모델로만 쓴다.
13. KMI 한국의학연구소의 이름과 로고는 기관이 동의한 범위 안에서 홈 Partners
    섹션에만 쓴다. 제품, Technology와 llms.txt에서는 기관명 대신 '첫 기관'으로
    쓴다. 기관 유형 표현, PoC 단계, 유료 전환과 매출 일정은 쓰지 않는다.
14. 의학 자료 갱신 주기는 실제 공급 주기를 확인한 뒤에만 쓴다.

Public copy may describe Viore-owned contracts, provenance, workflow controls and
evaluation discipline without disclosing internal implementation details.
