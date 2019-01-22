// ==UserScript==
// @name         FPT AP Autologin
// @version      0.1
// @author       Tai
// @include      /717739814477-ik190eo8tpfp9mo486a9v5gkotgk26s7/
// @match        *://ap.fpt.edu.vn/index.php
// @match        *://ap.fpt.edu.vn
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

(async function() {
    'use strict';

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() {
            onDOMloaded();
        });
    } else {
        onDOMloaded();
    }

    async function askEmail(email, prompt = "School email"){
        email = window.prompt(prompt, "@fpt.edu.vn");
        if(email != null){
            await GM.setValue('email', email);
            console.log('saved: ' + await GM.getValue('email'));
        }
    }

    async function onDOMloaded() {
        console.log('found ap login page');
        var btn;

        if(window.location.hostname == 'ap.fpt.edu.vn')
        {
            console.log('ap');

            btn = document.querySelectorAll("[href='http://ap.fpt.edu.vn/login.php?provider=Google']")[0];
            if(btn) btn.click();

        }else if(window.location.hostname == 'accounts.google.com')
        {
            console.log('google');

            var email = await GM.getValue('email');
            console.log('saved email: ' + email);

            if(!email){
                askEmail(email)
            }

            window.onload = async function(){
                btn = document.querySelectorAll(`[data-email='${email}']`)[0];

                var loop = setInterval(await tryClick, 250);
                var tryCount = 0;

                async function tryClick(){
                    if(tryCount > 8){
                        askEmail(email, "Can't find button with email account, try again");
                        btn = document.querySelectorAll(`[data-email='${email}']`)[0];
                        tryCount = 0;
                    }

                    tryCount++;

                    if(btn){
                        btn.click();
                        console.log('clicked');
                        clearInterval(loop);
                    }
                }
            }

            console.log('registered onload');
        }
    };
})();
