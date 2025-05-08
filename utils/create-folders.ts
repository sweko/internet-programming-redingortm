import fs from 'fs';

const isDirectory = (path: string): boolean => {
    const stats = fs.statSync(path);
    return stats.isDirectory();
}

const copyDirectory = (source: string, destination: string, skipNames: string[]): void => {
    fs.mkdirSync(destination);
    const files = fs.readdirSync(source)
    for (const file of files) {
        if (skipNames.includes(file)) {
            continue;
        }
        const sourcePath = `${source}\\${file}`;
        const isFolder = isDirectory(sourcePath);
        if (isFolder) {
            copyDirectory(sourcePath, `${destination}\\${file}`, skipNames);
            continue;
        }
        const destinationPath = `${destination}\\${file}`;
        fs.copyFileSync(sourcePath, destinationPath);
    }
}

function createStudentFolder(student: string, templateFolderName: string, destinationFolderName: string, skipNames: string[]): void {
    if (!destinationFolderName.endsWith("\\")) {
        destinationFolderName = `${destinationFolderName}\\`;
    }
    const studentFolderName = `${destinationFolderName}${student}`;
    console.log(`  Creating folder ${studentFolderName}`);
    if (fs.existsSync(studentFolderName)) { 
        console.log(`    Folder ${studentFolderName} already exists, skipping`);
        return;
    }
    copyDirectory(templateFolderName, studentFolderName, skipNames);
}

async function main() {
    const [studentFileName, templateFolderName, destinationFolderName, skipFile] = process.argv.slice(2);

    if (!studentFileName || !templateFolderName || !destinationFolderName) {
        console.error("Usage: node create-folders.js <student-file> <template-folder> <destination-folder> <skip-files (optional)>");
        process.exit(1);
    }

    if (!fs.existsSync(studentFileName)) {
        console.error(`Student file ${studentFileName} does not exist`);
        process.exit(1);
    }

    if (!fs.existsSync(templateFolderName)) {
        console.error(`Template folder ${templateFolderName} does not exist`);
        process.exit(1);
    }

    if (!fs.existsSync(destinationFolderName)) {
        console.error(`Destination folder ${destinationFolderName} does not exist`);
        process.exit(1);
    }

    const skipNames: string[] = [];
    if (skipFile) {
        console.log(`Loading skip names from ${skipFile}`);
        if (!fs.existsSync(skipFile)) {
            console.error(`Skip file ${skipFile} does not exist`);
            process.exit(1);
        }
        skipNames.push(...fs.readFileSync(skipFile, 'utf-8').split('\r\n').map(s => s.trim()).filter(s => s.length > 0));
        console.log(`Found ${skipNames.length} skip names`);
    }

    console.log(`Loading students from ${studentFileName}`);
    console.log(`Using template folder ${templateFolderName}`);
    console.log(`Writing to destination folder ${destinationFolderName}`);

    const students = fs.readFileSync(studentFileName, 'utf-8').split('\r\n').map(s => s.trim()).filter(s => s.length > 0);

    console.log(`Found ${students.length} students`);

    for (const student of students) {
        console.log(`Creating folder for ${student}`);
        createStudentFolder(student, templateFolderName, destinationFolderName, skipNames);
    }

}

main();