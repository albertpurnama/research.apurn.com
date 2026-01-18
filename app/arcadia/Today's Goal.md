Consistently reproduce the production issue locally


Findings
- \<Enter\> in the middle of the link also produces the same error
- This issue doesn't only happen on links, seems to happen on any leaf


Pulling from vercel env, running production build seems to work

Create new doppler env duplicating prd_march_1. then make sure everything still look production-like

Plan: activate one feature flag at a time until problem is resolved
make sure that the prod environment still can do stuff perfectly. -> prod doppler environment still produces same error
- Duplicated vercel preview environment into stg_march_1

