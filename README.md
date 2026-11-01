# Panda & Saja Studio

브랜드 홈페이지·상세페이지 제작 스튜디오 판다앤사자의 공식 사이트 (EN · KO · JA).

- 사이트: https://movk0808.github.io/pandasaja-studio/
- 관리자: https://movk0808.github.io/pandasaja-studio/admin.html (월 30팀 현황 숫자만 기록)

## 구조
- `index.html` 본문 + 스타일 (Claude 아티팩트 미리보기와 같은 파일)
- `i18n.js` 영어·한국어·일본어 문구
- `data/spots.json` 이번 달 문의·상담·계약·완료 숫자 (관리자 페이지가 수정)
- `build.js` 문서 머리말·공유 이미지·404·사이트맵을 붙여 `_site/` 생성
- `.github/workflows/deploy.yml` main에 push하면 GitHub Pages로 자동 배포

## 개인 도메인 연결 (나중에)
1. 저장소 Settings → Secrets and variables → Actions → Variables에 `CUSTOM_DOMAIN` (예: `pandasaja.com`) 추가
2. 도메인 DNS에 GitHub Pages 레코드 추가 (A: 185.199.108.153 / .109.153 / .110.153 / .111.153, 또는 www에 CNAME `movk0808.github.io`)
3. Settings → Pages에서 Custom domain 입력, Enforce HTTPS 체크
