echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -i ~/.ssh/ssh-key-2022-08-03.key -r build/* ubuntu@138.2.128.241:/var/www/138.2.128.241
echo "============================================================"
echo "Files deployed successfully"