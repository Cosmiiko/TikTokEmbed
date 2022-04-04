import express from 'express';
import scraper from 'tiktok-scraper';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { verboseLog } from './utils';

const DISCORD_AGENTS = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:38.0) Gecko/20100101 Firefox/38.0',
    'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)'
];

const DESKTOP_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    'Referer': "https://www.tiktok.com/"
};

dotenv.config();
const app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.get('/', (_req, res) => {
    res.render('home');
});

// Normal format 
app.get('/:username/video/:id', (req, res) => {
    serveContent(`https://www.tiktok.com/${req.params['username']}/video/${req.params['id']}`, req, res);
});

// Shortlink ('vm') format
// Node that reverse proxy must be config'd to redirect any subdomain to top level domain
app.get('/:shortid', (req, res) => {
    if (req.params['shortid'] == 'favicon.ico') return;

    // Resolve vm.tiktok into either www.tiktok.com or m.tiktok.com
    fetch(`https://vm.tiktok.com/${req.params['shortid']}`, {
        headers: DESKTOP_HEADERS,
        redirect: "manual"
    }).then(resolved => {
        let location = resolved.headers.get("location");

        if (location && location.includes("/m.tiktok")) {
            // Resolve m.tiktok into www.tiktok.com
            fetch(location, {
                headers: DESKTOP_HEADERS,
                redirect: "manual"
            }).then(resolved => {
                location = resolved.headers.get("location");

                serveContent(location, req, res);
            }).catch(err => {
                res.render('error', {
                    error: 'Couldn\'t follow redirects.'
                });

                verboseLog('redirect error:', err);
            });
        }
        else {
            serveContent(location, req, res);
        }
    }).catch(err => {
        res.render('error', {
            error: 'Couldn\'t follow redirects.'
        });

        verboseLog('redirect error:', err);
    });
});

function serveContent(link, req, res) {
    verboseLog('request from:', req.headers['user-agent']);

    if (!DISCORD_AGENTS.includes(req.headers['user-agent']) && config.redirectUnknownAgents) {
        res.writeHead(302, {
            'location': link
        });
        res.end();
        return;
    }

    scraper.getVideoMeta(link).then(meta => {
        const vidData = meta.collector[0];

        if (!vidData) {
            res.render('error', {
                error: 'Couldn\'t find video data.'
            });

            return;
        }

        res.render('response', {
            data: {
                description: vidData.text,
                imgUrl: vidData.imageUrl,
                vidUrl: vidData.videoUrl,
                author: vidData.authorMeta.name,
                link
            }
        });
    }).catch(err => {
        res.render('error', {
            error: 'Couldn\'t fetch video metadata.'
        });

        verboseLog('Couldn\'t fetch video metadata:', err);

        return;
    });
};

app.listen(parseInt(process.env.HTTP_PORT), () => {
    console.log('web server listening on port:', process.env.HTTP_PORT);
});