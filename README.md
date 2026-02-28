# eval
simple eval script

# how to use
use `.` or `>` to run javascript code
structure: `{command ("." or ">" by default)} {any javascript code that works in a browser}`
example: `. MPP.chat.send('Hello world from the eval userscript!')`

# notice
global `let` variables are meant to be changed to what you want.
you can easily change them by using the eval command, as well.
for example, you can run `. validCmds.push(";")`, which enables you to use `; {code}`.
