sudo yum update

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
nvm install 8.9.4

sudo amazon-linux-extras install redis4.0
sudo amazon-linux-extras install nginx1.12

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

: ' todo: create .env file
 run node server.js and redis-server with pm2
 edit server of /etc/nginx/nginx.conf
   location / {
       proxy_pass http://127.0.0.1:7654;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
   }
   cd places2B
   pm2 start node server
 pm2 startup && pm2 save '
