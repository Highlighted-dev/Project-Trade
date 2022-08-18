echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -i ~/.ssh/project-trade -r build/* project-trade@130.61.215.100:/var/www/130.61.215.100
echo "============================================================"
echo "Files deployed successfully"