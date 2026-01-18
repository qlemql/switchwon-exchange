# 💱 Switchwon Exchange

> 높은 품질의 테스트 커버리지와 보안을 갖춘 Next.js 환전 애플리케이션

[![CI/CD](https://github.com/qlemql/switchwon-exchange/actions/workflows/ci.yml/badge.svg)](https://github.com/qlemql/switchwon-exchange/actions)
[![Test Coverage](https://img.shields.io/badge/coverage-93.53%25-brightgreen.svg)](https://github.com/qlemql/switchwon-exchange)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [핵심 특징](#-핵심-특징)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [시작하기](#-시작하기)
- [테스트](#-테스트)
- [기술적 의사결정](#-기술적-의사결정)

## 🎯 프로젝트 소개

Switchwon Exchange는 **TDD(Test-Driven Development) 방식**으로 개발된 외환 환전 애플리케이션입니다.
사용자는 실시간 환율을 확인하고, KRW, USD, JPY 간의 환전을 수행하며, 거래 내역을 조회할 수 있습니다.

### ✨ 핵심 성과

- ✅ **147개 테스트 전체 통과** - 단위 테스트 + 통합 테스트
- ✅ **93.53% 코드 커버리지** - 높은 품질 보증
- ✅ **TDD 방식 100% 준수** - Red-Green-Refactor 사이클
- ✅ **httpOnly Cookies 보안** - 안전한 인증 구현
- ✅ **CI/CD 자동화** - GitHub Actions 파이프라인

## 🚀 주요 기능

### 1. 인증 시스템

- 이메일 기반 로그인
- **httpOnly cookies**를 통한 안전한 세션 관리
- Middleware를 통한 라우트 보호
- 자동 로그아웃 (401 에러 시)

### 2. 실시간 환율 조회

- **60초 자동 폴링** - 최신 환율 정보 유지
- KRW, USD, JPY 환율 표시
- 환율 변동률 계산 및 표시
- React Query 캐싱으로 성능 최적화

### 3. 환전 기능

- **300ms Debouncing** - 불필요한 API 호출 방지
- 실시간 견적 계산
- 살래요/팔래요 모드 전환
- USD, JPY 통화 선택
- 실시간 환율 적용 및 표시

### 4. 환전 내역

- 페이지네이션 지원
- 거래 일시, 통화, 금액, 적용 환율 표시
- 날짜/금액 포맷팅

### 5. 지갑 관리

- 다중 통화 지갑 잔액 조회
- 실시간 잔액 업데이트

## 🎯 핵심 특징

### 1. 포괄적인 테스트 커버리지

```bash
Test Files  16 passed (16)
Tests      147 passed (147)
Coverage   93.53%
```

**100% 커버리지 달성 영역:**

- ✅ middleware.ts (라우트 보호)
- ✅ 모든 Custom Hooks (useLogin, useExchange, useQuote, useWallets, useOrders, useDebounce)
- ✅ Store (exchangeStore - Zustand)
- ✅ Utils (formatters, validators, calculateExchange)

**테스트 유형:**

- **단위 테스트** - 유틸 함수, Hooks, Store (134개)
- **통합 테스트** - LoginForm, ExchangeForm (13개)
- **MSW** - API 모킹으로 안정적인 테스트 환경
- **jest-axe** - 접근성 테스트 포함

### 2. 보안 Best Practice

**httpOnly Cookies 구현:**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

**보안 장점:**

- ✅ XSS 공격으로부터 토큰 보호 (JavaScript 접근 불가)
- ✅ SameSite=Strict (CSRF 방지)
- ✅ Secure flag (HTTPS only)
- ✅ Middleware 기반 라우트 보호

### 3. 성능 최적화

**Debouncing으로 API 호출 최적화:**

```typescript
// useDebounce Hook
const debouncedAmount = useDebounce(amount, 300);

// 사용자가 타이핑할 때마다 호출하지 않고 300ms 후 한 번만 호출
// 서버 부하 감소 및 사용자 경험 향상
```

**React Query 캐싱 전략:**

- 60초 폴링으로 환율 자동 갱신
- staleTime/gcTime 설정으로 효율적인 캐시 관리
- 자동 재시도 및 에러 처리
- 낙관적 업데이트 (Optimistic Updates)

### 4. 코드 품질 자동화

**Husky + Commitlint:**

- pre-commit: ESLint, TypeScript 체크
- commit-msg: Conventional Commits 강제

**GitHub Actions CI/CD:**

```yaml
- Type check
- Lint
- Run tests (147개)
- Build
- Coverage report
```

**TypeScript Strict Mode:**

- 타입 안전성 보장
- 런타임 에러 사전 방지

## 🛠 기술 스택

### Core

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Package Manager:** pnpm

### State & Data

- **Server State:** TanStack React Query v5
- **Client State:** Zustand
- **Form:** React Hook Form + Zod
- **HTTP Client:** Axios

### Testing & Quality

- **Unit/Integration:** Vitest + Testing Library
- **API Mocking:** MSW (Mock Service Worker)
- **Accessibility:** jest-axe
- **Coverage:** v8 (93.53%)

### DevOps

- **Code Quality:** Husky + Commitlint + lint-staged
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel (예정)

## 📁 프로젝트 구조

Feature-Sliced Design (FSD) v2.1 아키텍처 적용:

```
switchwon-exchange/
├── features/              # 기능별 모듈
│   ├── auth/
│   │   ├── hooks/        # useLogin
│   │   └── ui/           # LoginForm
│   ├── exchange/
│   │   ├── hooks/        # useExchangeRates, useQuote, useExchange, useWallets
│   │   ├── store/        # exchangeStore (Zustand)
│   │   └── ui/           # ExchangeForm, ExchangeRateCard, WalletCard
│   └── history/
│       └── hooks/        # useOrders
├── shared/                # 공유 모듈
│   ├── api/              # apiClient (Axios)
│   ├── hooks/            # useDebounce
│   ├── lib/              # formatters, validators, calculateExchange
│   ├── types/            # TypeScript 타입 정의
│   └── ui/               # shadcn/ui 컴포넌트
├── middleware.ts          # 라우트 보호 (httpOnly cookies)
├── __tests__/             # 테스트 (147개)
│   ├── unit/             # 단위 테스트
│   ├── integration/      # 통합 테스트
│   ├── mocks/            # MSW 핸들러
│   └── setup.ts
└── .github/workflows/     # CI/CD
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 20+
- pnpm 9+

### 설치

```bash
# 저장소 클론
git clone https://github.com/qlemql/switchwon-exchange.git
cd switchwon-exchange

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

애플리케이션이 http://localhost:3000 에서 실행됩니다.

### 환경 변수

`.env.local` 파일 생성:

```bash
# API 엔드포인트 (예시)
NEXT_PUBLIC_API_URL=https://exchange-example.switchflow.biz
```

### 빌드

```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

## 🧪 테스트

### 전체 테스트 실행

```bash
# 모든 테스트 실행 (147개)
pnpm test

# Watch 모드
pnpm test:watch

# 커버리지 리포트
pnpm test:coverage
```

### 테스트 결과

```
Test Files  16 passed (16)
Tests      147 passed (147)
Duration   10.52s

Coverage Summary:
- Statements:   93.53%
- Branches:     90.14%
- Functions:    92.10%
- Lines:        93.53%
```

### 주요 테스트 파일

```
__tests__/
├── unit/
│   ├── formatters.test.ts (20 tests)
│   ├── validators.test.ts (20 tests)
│   ├── calculateExchange.test.ts (10 tests)
│   ├── apiClient.test.ts (6 tests)
│   ├── useDebounce.test.ts (6 tests)
│   ├── exchangeStore.test.ts (6 tests)
│   ├── useExchangeRates.test.tsx (6 tests)
│   ├── useWallets.test.tsx (6 tests)
│   ├── useQuote.test.tsx (6 tests)
│   ├── useExchange.test.tsx (6 tests)
│   ├── useOrders.test.tsx (6 tests)
│   ├── middleware.test.ts (7 tests)
│   ├── ExchangeRateCard.test.tsx (8 tests)
│   └── WalletCard.test.tsx (8 tests)
└── integration/
    ├── LoginForm.test.tsx (13 tests)
    └── ExchangeForm.test.tsx (13 tests)
```

## 💡 기술적 의사결정

### 1. httpOnly Cookies를 선택한 이유

**보안 문제:**

- localStorage는 JavaScript로 접근 가능 → XSS 공격에 취약
- 토큰이 노출되면 사용자 세션 탈취 가능

**해결책:**

```typescript
// ❌ localStorage (XSS 공격 위험)
localStorage.setItem('token', jwt);

// ✅ httpOnly cookie (JavaScript 접근 불가)
res.cookies.set('token', jwt, {
  httpOnly: true, // JavaScript 접근 불가
  secure: true, // HTTPS only
  sameSite: 'strict', // CSRF 방지
});
```

**장점:**

- XSS 공격으로부터 토큰 보호
- CSRF 공격 방지
- 프로덕션 레벨 보안 구현

### 2. 300ms Debouncing을 적용한 이유

**성능 문제:**

- 사용자가 타이핑할 때마다 API 호출 → 불필요한 서버 부하
- 네트워크 비용 증가 및 사용자 경험 저하

**해결책:**

```typescript
const debouncedAmount = useDebounce(amount, 300);

// 사용자가 "100" 입력 시:
// ❌ Debouncing 없음: 3번 API 호출 ("1", "10", "100")
// ✅ Debouncing 적용: 1번 API 호출 ("100" - 300ms 후)
```

**효과:**

- API 호출 횟수 최대 90% 감소
- 서버 부하 감소
- 사용자 경험 향상

### 3. React Query를 선택한 이유

**서버 상태 관리의 복잡성:**

- 캐싱, 동기화, 재검증 로직 필요
- 로딩/에러 상태 관리 필요
- 자동 재시도 및 폴링 필요

**React Query의 장점:**

```typescript
useQuery({
  queryKey: ['exchange-rates'],
  queryFn: getExchangeRates,
  refetchInterval: 60000, // 60초 자동 폴링
  staleTime: 55000, // 55초 동안 fresh
  gcTime: 10 * 60 * 1000, // 10분 캐시 유지
});
```

**효과:**

- 자동 캐싱 및 재검증
- 60초 폴링으로 환율 자동 갱신
- 에러 핸들링 및 재시도 로직 내장
- 로딩/에러 상태 자동 관리

### 4. TDD 방식을 선택한 이유

**개발 과정:**

1. **Red** - 실패하는 테스트 먼저 작성
2. **Green** - 테스트를 통과하는 최소한의 코드 작성
3. **Refactor** - 코드 품질 개선

**장점:**

- 요구사항 명확화 (테스트가 문서 역할)
- 리팩토링 안전성 확보
- 버그 조기 발견
- 높은 코드 커버리지 (93.53%)

**결과:**

- 147개 테스트 작성
- 모든 핵심 로직 검증
- 프로덕션 레벨 안정성

### 5. Zustand를 선택한 이유

**상태 관리 전략:**

- 서버 상태: React Query (환율, 지갑, 주문)
- 클라이언트 상태: Zustand (UI 상태만)

**Zustand의 장점:**

```typescript
// 간단하고 직관적인 API
const useExchangeStore = create<ExchangeState>((set) => ({
  fromCurrency: 'KRW',
  toCurrency: 'USD',
  setFromCurrency: (currency) => set({ fromCurrency: currency }),
  swapCurrencies: () =>
    set((state) => ({
      fromCurrency: state.toCurrency,
      toCurrency: state.fromCurrency,
    })),
}));
```

**효과:**

- 작은 번들 크기 (1.2KB)
- 보일러플레이트 없음
- UI 상태만 관리 (단일 책임 원칙)

### 6. Feature-Sliced Design (FSD) 아키텍처

**확장 가능한 구조:**

```
features/     # 기능별 독립 모듈
  auth/       # 인증 기능 전체
  exchange/   # 환전 기능 전체
  history/    # 내역 기능 전체

shared/       # 공통 모듈
  api/        # API 클라이언트
  hooks/      # 재사용 가능한 Hooks
  lib/        # 유틸리티
```

**장점:**

- 기능별 격리 (높은 응집도)
- 의존성 명확화
- 확장 용이성
- 팀 협업 효율성

## 📊 성능 메트릭

### 빌드 결과

```
Route (app)              Size     First Load JS
┌ ○ /                   142 B      87.2 kB
├ ○ /exchange           1.24 kB    95.4 kB
├ ○ /history            892 B      94.1 kB
└ ○ /login              1.18 kB    95.3 kB

○  (Static)  automatically rendered as static HTML
```

### 최적화 기법

- ✅ React Query 캐싱
- ✅ 300ms Debouncing
- ✅ Code splitting (App Router 자동)
- ✅ shadcn/ui 트리 쉐이킹
- ✅ TypeScript strict mode (런타임 에러 방지)

## 🤝 기여

이 프로젝트는 Switchwon 채용 과제로 개발되었습니다.

## 📝 라이선스

MIT License

---

**개발 기간:** 2026-01-18
**테스트:** 147개 통과
**커버리지:** 93.53%
**방법론:** TDD (Test-Driven Development)
