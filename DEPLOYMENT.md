# dramahub.co.kr 운영 도메인 연결

대표 주소는 `https://dramahub.co.kr`이며 `src/lib/site.ts`에서 서버와 브라우저가 함께 사용합니다. `VERCEL_URL` 또는 Cloud Run 주소로 canonical을 만들지 않습니다.

## Vercel에서 마무리할 설정

1. `drama1-brown.vercel.app`을 서비스하는 **기존 drama1 프로젝트**의 Settings → Domains에 `dramahub.co.kr`과 `www.dramahub.co.kr`을 추가합니다. 새 프로젝트를 만들지 않습니다.
2. 도메인 업체 DNS에 **해당 Vercel 화면이 지정한 값**을 입력합니다. 루트는 표시된 A 레코드, www는 표시된 CNAME 값을 사용하며 기존 충돌 레코드는 확인 후 정리합니다. 이미 설정된 루트 A 값은 Vercel 요구값과 같은지 먼저 확인합니다.
3. Vercel에서 두 도메인이 Valid Configuration이고 HTTPS가 정상인지 확인합니다. www는 코드의 308 규칙으로 루트 도메인에 통합합니다.
4. 새 도메인이 실제 사이트와 글을 정상 제공한 뒤, Vercel 운영 환경변수 `DRAMA_REDIRECT_LEGACY=1`을 설정하고 재배포합니다. 이후 기존 `drama1-brown.vercel.app` 링크도 경로/쿼리를 유지해 새 도메인으로 308 이동합니다. 도메인 연결 전에는 이 값을 켜지 않아 기존 접속을 유지합니다.
5. Search Console와 네이버 서치어드바이저에 새 도메인을 확인하고 `https://dramahub.co.kr/sitemap.xml`을 제출합니다. 임시 배포 주소를 사이트맵으로 제출하지 않습니다.

## 검증

- `npm run build` 후 `npm run lint`(Vercel API 진입점이 생성된 dist/server.cjs를 참조하므로 이 순서로 실행).
- `node tests/domain-seo.cjs`: 실제 공개 DB 자료를 읽어 목록·사이트맵 동일성, 글별 초기 HTML/메타/구조화 데이터, 잘못된 경로 404, www/구주소 리디렉션을 검증합니다. DB에 글을 쓰지 않습니다.
- 사이트맵은 공개 목록/상세와 같은 조회 함수를 사용합니다. 공개 중인 기존 기본 기사도 유지해 포함하며, 비공개·삭제·예약 글은 제외합니다.
- DB 조회 실패는 빈 정상 페이지 대신 503으로 응답합니다.
