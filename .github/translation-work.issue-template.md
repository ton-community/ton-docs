---
title: Translating {{ env.originBranch }} to {{ env.language }}
---

This is an issue to support translation work.

---

Two commands `/preview` and `/previewdraft` are handled as comments in this issue, they do similar two things:

1. Pull translations from Crowdin to a git branch:

   - `/preview` updates `translation-{issue_number}-{{ env.language }}` branch with the _complete and approved_ translations.
     
      Also, a pull request will be created once there are any changes.
      
      When translation work is done, update that pr with `/preview` command, review it and merge.

   - `/previewdraft` updates `translation-{issue_number}-{{ env.language }}-draft` branch with current state of translation (including unapproved or untranslated strings)

2. Deploys the updated branch to staging environment (same for preview or previewdraft):

   `https://staging-{{ env.language }}-tondocs.tapps.ninja/`
