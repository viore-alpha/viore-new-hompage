# 보안감사 보고서 — 2026-07-28

- **대상**: `viore-new-hompage` 전체 레포 (기준 커밋 `26f5e67`, `main`)
- **방법**: Claude Code 보안 리뷰(코드 전수 분석) + `npm audit --audit-level=high`
- **결론**: 실제 악용 가능한 코드 취약점(HIGH/MEDIUM) **0건**. 의존성 high 9건은 전부 개발 도구(eslint) 체인으로 서비스 번들과 무관.

## 1. 코드 감사 결과: HIGH/MEDIUM 0건

모든 후보 공격 경로가 엄격한 검증 또는 정적 데이터에서 종결됨. 본 사이트는 로그인·폼·쿠키·세션이 없는 공개 사이트로 공격 표면 자체가 작다.

### 검사한 표면

| 표면 | 확인 내용 |
|---|---|
| API 라우트 (`app/api/knowledge/papers`, `app/api/technology/alphaevidence-snapshot`) | 사용자 입력은 `scope`(허용목록)·`cursor`(날짜+UUID 정규식 강제)뿐. SSRF·PostgREST 필터 주입 불가(정규식이 메타문자 차단). 스냅샷 라우트는 입력 자체가 없음. |
| 업스트림 fetcher (`app/knowledge-feed.ts`, `app/company-metrics.ts`, `app/alphaevidence-snapshot.ts`) | 엔드포인트 URL은 서버 env/하드코딩 상수만 — 요청 유래 host/path/protocol 없음. 응답은 계약 파서로 재검증 후 사용. |
| XSS 싱크 | `dangerouslySetInnerHTML` 4곳 전부 정적 상수 JSON-LD + `<` 이스케이프(`<`). 논문 피드 렌더는 JSX 텍스트 노드(자동 이스케이프). 데이터 유래 `href`는 DB CHECK + 서버 파싱 + 클라이언트 재검증 3중으로 `https:`만 허용 — `javascript:` 주입 불가. |
| Supabase 마이그레이션 (`20260721103250_knowledge_infinite_public_feed.sql`) | RLS on, `revoke all` 후 공개 서지 스냅샷 select만 grant. `private.*`(SECURITY DEFINER 포함)은 service_role 전용. 과다 노출 없음. |
| 스크립트 (`scripts/*.mjs`, `.viore/verify-contract.mjs`) | 커맨드 주입·경로 탈출 없음(고정 argv, 고정 경로). 소셜 카드 텍스트는 하드코딩 상수. IndexNow 키는 프로토콜상 공개 설계, 제출 URL은 자체 사이트맵 origin 필터링. |
| GitHub 워크플로우 | `permissions: contents: read`, 시크릿 없음, 신뢰 안 되는 이벤트 필드의 `run:` 보간 없음. |
| 라우팅·설정 | `[lang]`은 ko/en 허용목록(`dynamicParams=false`), `[...slug]`는 정적 콘텐츠 맵만 조회. `next.config.ts`는 정적 리다이렉트·캐시 헤더뿐. |
| 비밀정보 스캔 | 발견 키는 Supabase publishable·IndexNow·검색엔진 인증 토큰뿐 — 전부 공개 설계. secret/service-role 키 유입 없음. |

### 평가 후 기각한 후보 (기각 사유)

1. `cursor`를 통한 PostgREST 필터 주입 — 정규식이 필요한 메타문자를 전부 차단.
2. 논문 `href`의 `javascript:`/`data:` URL 주입 — 3중 `https:` 강제.
3. JSON-LD `</script>` 탈출 — 정적 데이터 + `<` 이스케이프.
4. API 경유 SSRF — 아웃바운드 URL에 요청 유래 성분 없음.
5. 스냅샷 라우트의 503 응답 캐싱 — 가용성 영향만(감사 기준상 제외).
6. CSP/HSTS/X-Frame-Options 부재 — 인증 없는 정적 사이트의 심층방어 항목(LOW, 선택 과제).
7. publishable/IndexNow 키 하드코딩 — 설계상 공개.

## 2. 의존성 감사: high 9건 = 단일 계열, 개발 도구 한정

`brace-expansion` DoS(GHSA-mh99-v99m-4gvg) 1건이 eslint 관련 패키지 체인(minimatch → @eslint/* → eslint-config-next 등)에 물려 9건으로 집계됨.

- **런타임 영향 없음**: 전부 devDependencies — lint 실행 시에만 사용, 프로덕션 번들·서버에 미포함.
- **해결 경로**: `eslint@10` 메이저 업그레이드(브레이킹) 필요 → 별도 결정 사안. alphadoc 레포의 인지된 잔여와 동일 계열.

## 3. 후속 과제 (선택, 별도 트랙)

1. 보안 헤더 추가(CSP·HSTS 등) — 심층방어, 우선순위 낮음.
2. eslint 10 메이저 업그레이드 — dev 전용 audit 잔여 해소.
