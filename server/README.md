# Server

## Deploy

1. Activate virtual environment using requirements.txt
2. Install chalice
   ```
   python3 -m pip install chalice
   ```
3. Install AWS CLI
   ```
   curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
   sudo installer -pkg AWSCLIV2.pkg -target /
   ```
4. Configure AWS
   ```
   aws configure
   ```
   - Server: us-east-1
5. Run using Chalice
   ```
   chalice local --port=8001
   ```
