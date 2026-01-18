module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 새 기능
        'fix',      // 버그 수정
        'test',     // 테스트 추가/수정
        'refactor', // 리팩토링
        'chore',    // 빌드/설정 변경
        'docs',     // 문서만 변경
        'style',    // 코드 포맷팅
      ],
    ],
    'subject-case': [0], // subject case 검사 안 함 (한글 허용)
  },
};
