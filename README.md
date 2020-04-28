# Hypertube
42 Webtorrent Streaming project<br><br>
![Hypertube](https://i.ibb.co/VTGZ7qK/movies-final.png)


## How to use
- Install PM2 `npm install pm2 -g` <br><br>
- Edit `back-end-example.config.js` and copy it to `back-end/back-end.config.js`<br>
/ Edit front env `front-end/package.json` <br> <br>

Run `npm install` on front-end && back-end before run these commands

- Run back-end `pm2 start back-end/back-end.config.js`
- Run react front dev `cd front-end && npm run dev` <br>


## Deployment on prod
- Add your SSH key in your github account settings <br>
- Edit `back-end/back-end.config.js` <br>
- `pm2 deploy back-end/back-end.config.js production`<br>

### Some commands
- List process `pm2 list`
- Show logs `pm2 logs <Name>`
- Delete all process `pm2 delete all`
