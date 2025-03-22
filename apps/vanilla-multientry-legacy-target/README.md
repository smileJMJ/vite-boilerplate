# Vanilla Multi Entry

## 소개

- 멀티 엔트리로 구성하여 여러 개의 빌드 파일로 생성해야 할 때
- Native ESM 을 사용할 수 없는 환경을 위한 빌드 파일 생성 방법
- JS, CSS 셋팅 파일을 분리한 이유는 JS 빌드 시 `rollupOptions.inlineDynamicImports: true` 옵션을 사용하기 위해(멀티 엔트리에서 설정 불가능) 폴더별 JS entry 파일을 싱글 엔트리처럼 각각 빌드를 실행하기 위함이며, CSS는 한 번에 빌드를 돌려도 되어 따로 빌드 파일을 생성하는 것이 효율적임
- `@vitejs/plugin-legacy` 플러그인은 사용하지 않았으며, 사용할 경우 해당 셋팅에서 plugin 추가하면 됨
