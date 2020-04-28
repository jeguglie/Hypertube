const back_end_path = '/home/jvg/www/hypertube.jv-g.fr/back-end';
const front_end_path = '/home/jvg/www/hypertube.jv-g.fr/front-end';

module.exports = {
    "apps": [{
        "name": "H_BACK",
        "script": "npm",
        "args": "start",
        "env": {
            NODE_ENV: "development",
            MONGO_URI: "",
            SECRET: "",
            API_IMDB: "",
            SOCKET_PORT: 9001,
            SERVER_PORT: 9002,
            REACT_PORT: 3001,
        },
        "env_production": {
            NODE_ENV: "production",
            MONGO_URI: "",
            SECRET: "",
            API_IMDB: "",
            SOCKET_PORT: 9001,
            SERVER_PORT: 9002
        }
    }],
    deploy: {
        // "production" is the environment name
        production: {
            // SSH key path, default to $HOME/.ssh
            key: '/Users/jv/.ssh/id_rsa',
            user: "jvg",
            host: ["jv-g.fr"],
            ssh_options: "StrictHostKeyChecking=no",
            // GIT remote/branch
            ref: "origin/master",
            // GIT remote
            repo: "https://github.com/jeguglie/Hypertube.git",
            // path in the server
            path: "/home/jvg/www/hypertube.jv-g.fr/",
            // Pre-setup command or path to a script on your local machine
            // 'pre-setup': "npm install pm2 -g && pm2 update",
            // Post-setup commands or path to a script on the host machine
            // eg: placing configurations in the shared dir etc
            // 'post-setup': `sudo chown -R jvg:collab ${path} && sudo chmod -R g+w ${path}`,
            'post-deploy': `cd ${back_end_path} && cp /home/jvg/back-end-hypertube.config.js ./back-end.config.js &&  rm -rf node_modules/ && npm install && sed -i 's/1337x.to/1377x.to/g' node_modules/xtorrent/index.js &&  cd ${front_end_path} && rm -rf node_modules &&` +
                "npm install && npm rebuild node-sass && npx webpack --env.REACT_APP_CUSTOM_NODE_ENV=production --env.REACT_APP_SOCKET_PORT=9001 --env.REACT_APP_SERVER_PORT=9002 --progress --config ./webpack.config.js &&" +
                `cd ${back_end_path} && pm2 start back-end.config.js --env production`
        }
    }
}