echo "Deploying files to server..."
scp -i ~/.ssh/ssh-key-2022-08-03.key -r * ubuntu@138.2.128.241:/home/ubuntu/express
echo "============================================================"
echo "Files deployed successfully"