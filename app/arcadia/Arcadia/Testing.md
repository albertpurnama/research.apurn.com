
## CircleCI
Read the [orb definition](https://circleci.com/developer/orbs/orb/cypress-io/cypress?psafe_param=1&utm_source=google&utm_medium=sem&utm_campaign=sem-google-dg--uscan-en-dsa-tROAS-auth-brand&utm_term=g_-_c__dsa_&utm_content=&gclid=CjwKCAjwq-WgBhBMEiwAzKSH6KFII-2inBmDNNmJql5ITW1jZ_BHeE_AmsVmk549ORUu1TapTBorPBoCorsQAvD_BwE) for better use case.
Read documentation, experiment then experiment by adding filter [like this](https://github.com/typedreamhq/cloud/blob/8b0ec12bd0a568b7f416e25cce76c904316aeee5/.circleci/continue_config.yml#L39)

### Caching
`cypress-cache-key` is the cache specifically for Cypress.

If you see the [orb definition](https://circleci.com/developer/orbs/orb/cypress-io/cypress?psafe_param=1&utm_source=google&utm_medium=sem&utm_campaign=sem-google-dg--uscan-en-dsa-tROAS-auth-brand&utm_term=g_-_c__dsa_&utm_content=&gclid=CjwKCAjwq-WgBhBMEiwAzKSH6KFII-2inBmDNNmJql5ITW1jZ_BHeE_AmsVmk549ORUu1TapTBorPBoCorsQAvD_BwE) , it shows that the orb is using `circleci/node@5` (at the time of writing). You should see how `node/install-command` [docs](https://circleci.com/developer/orbs/orb/circleci/node#commands-install-packages).

![[Screenshot from 2023-03-21 15-27-47.png]]

At the time of writing, we still can't upload the `node_modules` by using the CircleCI orb.