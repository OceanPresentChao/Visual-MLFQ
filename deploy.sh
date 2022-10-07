# 发生错误时终止
set -e

# npm run build 

cd dist

git add .

git commit -m 'deploy'

git push -f git@github.com:OceanPresentChao/Visual-MLFQ.git master:gh-pages

cd -