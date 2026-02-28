// prepare helpers
console.log('preparing... (1)');
const originalCWD = process.cwd();
const targetCWD = '/';
const {
    readFileSync: read,
    writeFileSync: write,
    appendFileSync: append,
    readdirSync: readDir
} = require('fs');
const { exec } = require('child_process');

exec('ls -la', (error, stdout, stderr) => {
  	if (error) {
    	console.error(error);
    	return;
  	}
  	console.log(stdout);
});

function readDirRecursive(dir) {
  	return read(dir, { withFileTypes: true })
    	.flatMap(entry => {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				return readDirRecursive(fullPath);
			}
			return fullPath;
		});
}


// prepare states
console.log('preparing... (2)');

const files = readDirRecursive(process.cwd())
    .map(file => path.relative(process.cwd(), file));


// final step
console.log('organizing... (3)');
process.chdir(targetCWD);

files.forEach(file => {
	let fileContent = read(file);
	// enforce EOF line
	if (fileContent[fileContent.length - 1] !== '\n') {
		append(file, '\n');
		fileContent = read(file);
	}
	// run lint
	exec(`npx eslint ${file}`)
})