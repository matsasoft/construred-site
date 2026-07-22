#!/usr/bin/env bash
set -euo pipefail

CMS_API_URL=https://admin.miconstrured.com PUBLIC_CMS_API_URL=https://admin.miconstrured.com PUBLIC_GTM_ID=GTM-W5VT3FZV pnpm build

rsync -avz --delete dist/ deployer@construred-vps:/var/www/construred/
