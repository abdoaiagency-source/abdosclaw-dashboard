# GitHub Publishing Checklist

## Before creating the repo
- [x] Project reviewed
- [x] Documentation package created
- [ ] Optional cleanup of placeholder links and mocked labels
- [ ] Confirm final repo name
- [ ] Confirm GitHub owner/org
- [ ] Provide GitHub token with repo creation permissions

## Suggested repo names
- `abdosclaw-dashboard`
- `abdosclaw-cockpit`
- `abdosclaw-mission-control`

## Initial repo structure should include
- source app
- docs/
- cleaned README
- .gitignore
- package-lock.json

## Suggested first tags / topics
- `react`
- `vite`
- `dashboard`
- `openclaw`
- `agent-ui`
- `mission-control`

## After repo creation
- initialize git if needed
- create first clean commit
- connect origin
- push main
- verify README rendering
- connect Vercel to repo
- add GitHub Actions secrets for backend auto-deploy
- verify Actions tab shows CI and deploy workflows
