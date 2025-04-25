Note: Take t2.medium instance type for fast performance with out any latency

*******************Install Docker********************
sudo yum update -y
sudo yum install docker -y
sudo service docker start 
sudo chkconfig docker on
sudo service docker status
sudo docker --version
sudo usermod -a -G docker ec2-user

*****************Install Docker Compose******************
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose version

****************Install Git***********************
If you already have code in GitHub do this step. Otherwise, no need to install
sudo yum install git -y
git clone <repository_url>

****************Install nodejs & npm********************
sudo yum update -y
sudo yum install -y nodejs npm
node -v
npm -v

************************************************************************
Install the required dependencies: npm install express mysql2 body-parser
To generate your own package-lock.json, run the following command after you create the package.json file:: npm install (Optional)

