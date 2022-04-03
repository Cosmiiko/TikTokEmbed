# TikTokEmbed - tiktokembed.com 
![License MIT](https://img.shields.io/badge/license-MIT-green)  

Make TikTok videos appear in Discord embeds! Just edit `tiktok.com` into `tiktokembed.com`.  

## Usage
```
npm run start
```
I'd recommend using this in some monitoring service, like a docker container or a pm2 instance.  
Also, this service must run under a reverse proxy or the like, configured to redirect any subdomains to the top level domain (i.e. `vm.yoursite.com/5tuFf` -> `yoursite.com/5tuFf`).

## Config
```
+-----------------------+------------+---------------+----------------------------------------------------------------+
| Key                   | Value type | Default value | Info                                                           |
+-----------------------+------------+---------------+----------------------------------------------------------------+
| debug                 | boolean    | true          | Enables more verbose logging                                   |
+-----------------------+------------+---------------+----------------------------------------------------------------+
| redirectUnknownAgents | boolean    | false         | Redirects users who click the link to the TikTok post if true, |
|                       |            |               | shows the info page (response.ejs) if false.                   |
+-----------------------+------------+---------------+----------------------------------------------------------------+
| httpPort              | number     | 80            | Port the express server will use.                              |
+-----------------------+------------+---------------+----------------------------------------------------------------+
```

## Note
Yes, I am aware the code for this isn't the greatest. I made this out of boredom in an afternoon, I never intended this to be perfect, just good enough to work.
