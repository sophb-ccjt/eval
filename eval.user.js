// ==UserScript==
// @name         eval
// @namespace    <gone>
// @version      3.0.2
// @description  simple eval script
// @author       soph b
// @include      /^https?:\/\/(?:www\.)?(?:multiplayerpiano\.(?:org|net|dev|com)|(?:soot)?mpp\.(?:8448\.space|smp-meow\.net|(?:hyye|autoplayer)\.xyz)|piano\.(?:mpp\.community|ourworldofpixels\.com)|staging-mpp\.sad\.ovh)(?:\/.*)?/
// @icon         data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsSAAALEgHS3X78AAAAAXNSR0IArs4c6QAAAUhJREFUeF7tmskOwyAMROH/P5qKAxVCpB4kK7LLyy0pYpnMgklrKaWVi68KADAACeABF3tgwQRJAVKAFCAFSAEDgdZsktTaAyXfJcUgAMAAJGCKGw/ABEkBUyYRGxCDXtVg1r2CxACFugCQdLMEA/AApxMhPAAPyFkwYYKKCb6pb2UsZV/S2ygVqsQAZVLKYMrElbGUfgAABiABPEDxJUyQGBRqASWaFLop8aWMpfTjGoPqgB7trgfAA8STPiQTPOkwW1sAUFIg21s9mW84Bswm2JOl388Jc3pvgRESAHXBA4wZlBWglACMSQ8gdgvtbVa2jGcne5LwDJgX9fSm/54Buzf75AU7VvySQTgGWJr1/h0A2AcI1aA37SL1hwSQABLg7/L2V81IruU8F0wQE8QE7zDBtWL8lty3SGA9Uxj3V5jg7rxgPPsAQdQYDUupC18AAAAASUVORK5CYII=
// @downloadURL  https://raw.githubusercontent.com/sophb-ccjt/eval/refs/heads/main/eval.user.js
// @updateURL    https://raw.githubusercontent.com/sophb-ccjt/eval/refs/heads/main/eval.user.js
// ==/UserScript==

let header = {};
async function populateHeader() {
    header = {}; // set header to default

    /* fetch script */
    const updateURL = 'https://raw.githubusercontent.com/sophb-ccjt/eval/refs/heads/main/eval.user.js';
    const r = await fetch(updateURL);
    const script = await r.text();

    /* parse header */
    const headerLines = script
        .split("// ==/Userscript==")[0] // split script into header at index 0 and script content at index 1
        .split('\n') // split by lines
        .slice(1); // remove the first item of the array, giving the header's lines without the separator

    const headerRegex = /\/\/ +@(.+) +(.+)/g; // group 1 is property name, group 2 is property value
    headerLines.forEach(line => {
        const groupMatches = line
            .match(headerRegex) // get groups based on regex
            .map(v => v) // normalize array (remove items with keys)
            .slice(1); // remove first item of array, giving only groups

        header[groupMatches[0]] = groupMatches[1];
    });

    // freeze the header so it can't be messed with during runtime
    Object.freeze(header);
}
// populate the header
populateHeader();

let errors = [
    'failed',
    'error',
    'err',
    'nope',
    'nuh uh',
    'no',
    'uh oh',
    "yesn't",
    'oopsies',
    'oops',
    'oop',
    'fail',
    'false',
    ':(',
    ';(',
    'D:',
    'Uncaught SkillIssue',
    'Uncaught IntelligenceError',
    '❌',
    '❎',
    '🤷',
    'javascript is weird, right?',
    'S#!%',
    'F@$#',
    ';;;;;;;;;;;;;;;;;;;;;;;;;;;'
];
const zwsp = "​";
let outsymbols = [
    "⧔",
    ">",
    "<",
    zwsp + "~",
    "⤷",
    "⧐"
];
let outsymbol = outsymbols[0];
let types = false;
let validCmds = [
    '.',
    '>'
];

if (localStorage.eval_variables == null) {
    // defaults
    localStorage.eval_variables = JSON.stringify(
        {
            errors,
            outsymbol,
            outsymbols,
            types,
            validCmds
        }
    );
}
// set variables
const variables = JSON.parse(localStorage.eval_variables);
// load variables from storage
for (const [variable, value] of Object.entries(variables)) {
    window[variable] = value;
}

const log = [];
const charLimit = 512;
MPP.client.on("a", function(msg) {
    // helpers
    const args = msg.a.split(" ");
    const cmd = args[0];
    const error = errors[Math.floor(Math.random()*errors.length)];
    const client = MPP.client;
    const logMsg = (msg) => {
        const prefix = `${Date.now()} [EVAL] `;
        const suffix = '';
        log.push(msg);
        console.log(prefix + msg + suffix);
    }

    // send function
    const send = (msg) => {
        if (typeof msg !== "string")
            msg = JSON.stringify(msg);

        if (msg.length > charLimit) {
            if (msg.length > charLimit * 2) {
                for (let i = 0; i < Math.floor(msg.length / charLimit) + 1; i++) {
                    MPP.client.sendArray([{
                        "m": "dm",
                        "message": msg.slice(
                            charLimit * i, charLimit * (i + 1)
                        ),
                        "_id": msg.p._id
                    }])
                }
            } else {
                for (let i = 0; i < Math.floor(msg.length / charLimit) + 1; i++) {
                    MPP.chat.send(
                        msg.slice(
                            charLimit * i, charLimit * (i + 1)
                        )
                    );
                }
            }
        } else
            MPP.chat.send(msg);
    }
    
    // the actual eval
    if (MPP.client.getOwnParticipant()._id === msg.p._id) {
        if (validCmds.includes(cmd)) {
            try {
                const result = eval(msg.a.substring(cmd.length).trim());
                const app = types ? `[${(typeof result).toUpperCase()}] ` : "";
                const output = (text) => {
                    MPP.chat.send(`${outsymbol} ${app}${text}`);
                }
                switch (typeof result) {
                    case 'string':
                        output(
                            (() => {
                                function btoaCensor(text, targetStr, replacer, depth = 10) {
                                    let finalStr = targetStr;
                                    for (let i = 1; i <= depth; i++) {
                                        finalStr = finalStr
                                        .replaceAll(
                                            eval(`${
                                                'btoa('.repeat(i)
                                            }"${
                                                text.replaceAll('"', '\\"')
                                            }"${
                                                ')'.repeat(i)
                                            }`)
                                        , replacer);
                                    }
                                    return finalStr;
                                }
                                return btoaCensor(localStorage.token, 'a'.replaceAll("\\", ""), '[no]', 15);
                            })()
                        );
                        break;


                    case 'object':
                        const maxItems = 5;
                        if (result === null) {
                            // null
                            output('null')
                        } else if (Array.isArray(result)) {
                            // array
                            const arrayItemsStr = [...result]
                                .slice(0, maxItems)
                                .join(', ');
                            const arrayStr = `(${result.length} items) [ ${arrayItemsStr}${result.length > maxItems ? ', ...' : ''} ]`;
                            output(arrayStr);
                        } else {
                            // plain-object
                            output(JSON.stringify(result));

                            /* === NOTE === */
                            // make behavior consistent with array?
                            // don't know how to do that yet
                            // do when you get an epiphany or however you spell it
                        }
                        break;

                    case 'function':
                        output(`𝑓 ${result.name}(...${result.length})`)
                        break;

                    default:
                        output(JSON.stringify(result))
                        break;
                }
                logMsg('eval executed')
            } catch (err) {
                if (!err.message) {
                    send(`${outsymbol} *${error}* - ❌ [Raw \`throw\`] ${err}`);
                } else {
                    send(`${outsymbol} *${error}* - ❌ [${err.name}] ${err}`);
                }
                logMsg(`error: ${err}`);
            } finally {
                logMsg('eval executed');
                for (const [variable, value] of Object.entries(variables)) {
                    if (window[variable] !== value) {
                        variables[variable] = window[variable];
                        localStorage.eval_variables = JSON.stringify(variables);
                    }
                }
            }
        }
        if (new RegExp(`(?:${validCmds.map(RegExp.escape).join('|')})about`)) {
            MPP.chat.send("eval - made by ccjt - running version " + header.version)
        }
    }
});
