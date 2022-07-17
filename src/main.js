const { spawn } = require('child_process');
const term = require( 'terminal-kit' ).terminal;

var argv = process.argv.slice(2)

var child = spawn("java", argv, {env:{FORCE_COLOR: true}});

child.stdout.setEncoding('utf8');
child.stdout.on('data', function(data) {
    term(data);
});

child.stderr.setEncoding('utf8');
child.stderr.on('data', function(data) {
    console.log(data);
});

term.on('key', function(name, matches, data) {
	if (name === 'CTRL_C') {
        term.bold.red("Are you sure you want to close the server? [Y|n] ");
        term.yesOrNo({yes: ['y', 'ENTER'], no: ['n']}, function(error, result) {
            if (result) {
                child.stdin.write("exit\n")
                term("Closed the server.");
                process.exit();
            }
            else {
                term.green("Ok\n");
            }
        });
    }
});

var history = [];
var autoComplete = [
    "help",
    "version",
    "exit",
    "stop",
    "host",
    "maps",
    "reloadmaps",
    "status",
    "mods",
    "mod",
    "js",
    "say",
    "pause",
    "rules",
    "fillitems",
    "playerlimit",
    "config",
    "subnet-ban",
    "whitelist",
    "shuffle",
    "nextmap",
    "kick",
    "ban",
    "bans",
    "unban",
    "pardon",
    "admin",
    "admins",
    "players",
    "runwave",
    "load",
    "save",
    "saves",
    "gameover",
    "info",
    "search",
    "gc",
    "yes"
]
function commandInput() {
    term.inputField({
        autoComplete: autoComplete,
        history: history,
        autoCompleteHint: true,
        autoCompleteMenu: false,
        tokenHook: function(token, previousTokens, term) {
            if (autoComplete.indexOf(token) > -1 || autoComplete.indexOf(previousTokens[0]) > -1) {
                return term.green;
            }
            else {
                return term.brightRed;
            }
        }
        }, function(error, input) {
            if (error) {
                return term.blue("[MSC]").red(`[ERROR]: ${error}`)
            }
            term.moveTo(...process.stdout.getWindowSize());
            child.stdin.write(input + "\n");
            if (history.length == 34) {
                history.shift()
            }
            history.push(input);
            term("\n");
            commandInput();
    });
}
commandInput();
