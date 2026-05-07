CMS_API_URL=https://admin.miconstrured.cloud/ PUBLIC_CMS_API_URL=https://admin.miconstrured.cloud/ pnpm build

rsync -avz --delete dist/ deployer@construred-vps:/var/www/construred/
