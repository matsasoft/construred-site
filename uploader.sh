CMS_API_URL=https://admin.miconstrured.com PUBLIC_CMS_API_URL=https://admin.miconstrured.com pnpm build

rsync -avz --delete dist/ deployer@construred-vps:/var/www/construred/
