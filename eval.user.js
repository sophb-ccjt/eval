// ==UserScript==
// @name         eval
// @namespace    https://ccjit.github.io/my-site
// @version      v2.2
// @description  uate
// @author       ccjt
// @match        https://multiplayerpiano.net/*
// @match        https://multiplayerpiano.org/*
// @match        https://multiplayerpiano.dev/*
// @match        https://mpp.8448.space/*
// @match        https://staging-mpp.sad.ovh/*
// @icon         data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsSAAALEgHS3X78AAAAAXNSR0IArs4c6QAAAUhJREFUeF7tmskOwyAMROH/P5qKAxVCpB4kK7LLyy0pYpnMgklrKaWVi68KADAACeABF3tgwQRJAVKAFCAFSAEDgdZsktTaAyXfJcUgAMAAJGCKGw/ABEkBUyYRGxCDXtVg1r2CxACFugCQdLMEA/AApxMhPAAPyFkwYYKKCb6pb2UsZV/S2ygVqsQAZVLKYMrElbGUfgAABiABPEDxJUyQGBRqASWaFLop8aWMpfTjGoPqgB7trgfAA8STPiQTPOkwW1sAUFIg21s9mW84Bswm2JOl388Jc3pvgRESAHXBA4wZlBWglACMSQ8gdgvtbVa2jGcne5LwDJgX9fSm/54Buzf75AU7VvySQTgGWJr1/h0A2AcI1aA37SL1hwSQABLg7/L2V81IruU8F0wQE8QE7zDBtWL8lty3SGA9Uxj3V5jg7rxgPPsAQdQYDUupC18AAAAASUVORK5CYII=
// @downloadURL  https://github.com/ccjit/eval/raw/refs/heads/main/eval.user.js
// @updateURL    https://github.com/ccjit/eval/raw/refs/heads/main/eval.user.js
// @grant        GM_info
// ==/UserScript==
let header = GM_info.script
let version = header.version

const errors = [
    "failed",
    "error",
    "err",
    "nope",
    "nuh uh",
    "no",
    "uh oh",
    "yesn't",
    "oopsies",
    "oops",
    "oop",
    "fail",
    "false",
    ":(",
    ";(",
    "D:",
    "Uncaught SyntaxError",
    "Uncaught ReferenceError",
    "Uncaught TypeError",
    "Uncaught RangeError",
    "Uncaught SkillError",
    "Uncaught IntelligenceError",
    "Uncaught Error",
    "❌",
    "❎",
    "🤷"
]
const zwsp = "​"
const outsymbols = [
    "⧔",
    ">",
    zwsp + "~",
    "⤷",
    "⧐"
]
let outsymbol = outsymbols[0]
let types = false
MPP.client.on("a", function(msg) {
    let args = msg.a.split(" ");
    let cmd = args[0];
    let charLimit = 512
    let error = errors[Math.floor(Math.random()*errors.length)]
    let send = function (msg, reply, replyTo) {
        if (typeof msg == "string") {
            msg = msg
        } else {
            msg = JSON.stringify(msg)
        }
        if (msg.length > charLimit) {
            if (msg.length > charLimit * 2) {
                for (let i = 0; i < Math.floor(msg.length / charLimit) + 1; i++) {
                    MPP.client.sendArray([{
                        "m": "dm",
                        "message": msg.slice(charLimit * i, charLimit * (i + 1)),
                        "_id": msg.p._id
                    }])
                }
            } else {
                for (let i = 0; i < Math.floor(msg.length / charLimit) + 1; i++) {
                    MPP.chat.send(msg.slice(charLimit * i, charLimit * (i + 1)));
                }
            }
        } else {
            if (reply == undefined || reply) {
                if (!replyTo) {
                    MPP.chat.send(msg)
                } else {
                    MPP.chat.send(msg)
                }
            } else {
                if (!replyTo) {
                    MPP.chat.send(msg)
                } else {
                    MPP.chat.send(msg)
                }
            }
        }
    }
    let reply = function(r, id) { MPP.client.sendArray([ { m: "a", reply_to: id, _id: "ReplyParticipantid", message: r, } ]) };
    let client = MPP.client;
    let on = function(i) { return msg.a.substring(i).trim() }
    let id = msg.p.id;
    let color = msg.p.color;
    let name = msg.p.name;
    let log = function(txt) {console.log(txt)}
    let err = error[Math.floor(Math.random()*error.length)]
    if (MPP.client.participantId == msg.p.id) {
        if (cmd == '.') {
            try {
                let result = eval(msg.a.substring(cmd.length).trim())
                let app = ""
                if (types) app = "[" + (typeof result).toUpperCase() + "] "
                if (typeof result == "string") {
                    send(outsymbol + ' ' + app + result.replaceAll("\\", "").replaceAll(localStorage.token, "no").replaceAll(btoa(localStorage.token), "no"))
                } else {
                    if (typeof result == "undefined") {
                        send(outsymbol + ' ' + app + 'undefined')
                    } else if (typeof result == "string") {
                        send(outsymbol + ' ' + app + result.replaceAll("\\", ""))
                    } else if (typeof result == "number") {
                        send(outsymbol + ' ' + app + result)
                    } else if (typeof result == "function") {
                        send(outsymbol + ' ' + app + '𝑓 ' + result.name + "(..." + result.length + ")")
                    } else {
                        send(outsymbol + ' ' + app + JSON.stringify(result))
                    }
                }
            } catch (err) {
                console.log(err)
                if (!err.message) {
                    send("~ *" + error + "* - ❌ " + err)
                } else {
                    send("~ *" + error + "* - ❌ " + err.message)
                }
                throw 'yeet'
            } finally {
                console.log('eval executed')
            }
        }
        if (cmd == "'about") {
            let verstr = version.startsWith("v") ? version.substring(1) : version
            MPP.chat.send("eval - made by ccjt - running version " + verstr)
        }
    }
});
