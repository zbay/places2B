sudo yum update

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
nvm install 8.9.4

sudo amazon-linux-extras install redis4.0

sudo yum install git
git clone https://github.com/zbay/places2B

npm install -g @angular/cli
cd places2B
npm install
cd public
npm install
ng build --prod
cd ../../

npm install pm2 -g

sudo amazon-linux-extras install nginx1.12

// todo: create .env file
// run node server/server and redis-server with pm
