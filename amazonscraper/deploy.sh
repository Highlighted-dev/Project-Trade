echo "Deploying files to server..."
scp -i ~/.ssh/project-trade -r * project-trade@130.61.215.100:/home/project-trade/amazonscraper
echo "============================================================"
echo "Files deployed successfully"