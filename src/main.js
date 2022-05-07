const { spawn } = require('child_process');
var term = require( 'terminal-kit' ).terminal;
term.windowTitle("Mindustry server");

process.chdir("./server");
var child = spawn("java", "-jar server.jar".split(" "), {env:{FORCE_COLOR: true}});

child.stdout.setEncoding('utf8');
child.stdout.on('data', function(data) {
    //Here is where the output goes
    term(data);
});

child.stderr.setEncoding('utf8');
child.stderr.on('data', function(data) {
    //Here is where the error output goes
    console.log(data);
});

term.on('key', function(name, matches, data) {
	if (name === 'CTRL_C') {
        term.bold.red("Are you sure you want to close the server? [Y|n] ");
        term.yesOrNo({yes: ['y', 'ENTER'], no: ['n']}, function(error, result) {
            if (result) {
                term("Good bye!");
                child.kill("SIGINT");
                process.exit();
            }
            else {
                term.green("Okay!\n");
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
        tokenHook: function(token, isEndOfOut, previousTokens, term, config) {
            if (autoComplete.indexOf(token) > -1 || autoComplete.indexOf(previousTokens[0]) > -1) {
                return term.green;
            }
            else {
                return term.brightRed;
            }
        }
        }, function(error , input) {
            child.stdin.write(input + "\n")
            history.push(input);
            term("\n");
            commandInput();
    });
}
commandInput()