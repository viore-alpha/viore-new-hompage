# Viore Public Architecture Claim Contract

**Contract version:** `2026-08-11.1`
**Distribution profile:** public-safe

## Public-safe portfolio

- AlphaEvidence: 의료 근거의 출처·권리·버전·검색 기반
- AlphaDoc Engine: 근거와 사용자 맥락을 제품 workflow로 연결하는 실행 계층
- AlphaDocument: 문서와 문서 이미지의 구조를 일관되게 만드는 artifact engine
- AlphaImage: 정적 이미지 입력을 안전하고 일관된 artifact로 만드는 기술 경계
- AlphaLayer: 선택된 보호 텍스트 경로에 연결된 외부 AI 실행 통제 기술 경계
- AlphaSeal: 지원되는 1:1 대화 본문을 참여자 브라우저 사이에서 종단간 암호화하는 기술 경계

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

Public copy may describe Viore-owned contracts, provenance, workflow controls and
evaluation discipline without disclosing internal implementation details.
