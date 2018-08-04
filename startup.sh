#!/bin/bash -ex

sudo yum update

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
nvm install 8.9.4

sudo amazon-linux-extras install redis4.0
redis-server &
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
 edit server: sudo vim /etc/nginx/nginx.conf
   server_name  places2b.zbay.xyz;
   location / {
       proxy_pass http://127.0.0.1:7654;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
   }
   sudo service nginx restart
   cd places2B
   pm2 start server.js
 pm2 startup && pm2 save
 sudo chkconfig nginx on'



    server {

  listen       443 ssl http2 default_server;
  listen       [::]:443 ssl http2 default_server;
  server_name  places2b.zbay.xyz;
  root         /usr/share/nginx/html;

  ssl_certificate   /etc/letsencrypt/live/places2b.zbay.xyz/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/places2b.zbay.xyz/privkey.pem;
  include /etc/letsencrypt/options-ssl-nginx.conf;
        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
                       proxy_pass http://127.0.0.1:7654;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }

server {
  listen       80 default_server;
  listen       [::]:80 default_server;
  server_name  places2b.zbay.xyz;
  root         /usr/share/nginx/html;
  # location / {
  # }
  # Redirect non-https traffic to https
  if ($scheme != "https") {
    return 301 https://$host$request_uri;
  }
}


// In sudo vim /etc/letsencrypt/options-ssl-nginx.conf

# This file contains important security parameters. If you modify this file
# manually, Certbot will be unable to automatically provide future security
# updates. Instead, Certbot will print and log an error message with a path to
# the up-to-date file that you will need to refer to when manually updating
# this file.

ssl_session_cache shared:le_nginx_SSL:1m;
ssl_session_timeout 1440m;

ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_prefer_server_ciphers on;

ssl_ciphers "ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:!DSS";
