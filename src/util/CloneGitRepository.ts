import { execSync } from 'child_process';
import { existsSync, fstat, lstatSync, mkdirSync, readdirSync, rmdirSync, unlinkSync } from 'fs';
import { join } from 'path';

export default (repoPath: string, branch: string, location: string) => {
    return new Promise<void>((resolve, reject) => {

        // Deleting the target folder if it already exists
        const folderName = repoPath.split('/').pop()!;
        deleteFolderRecursive(join(location, folderName));

        // Creating working directory if it doesn't exist
        mkdirSync(location, { recursive: true });

        execSync(`git clone https://github.com/${repoPath} --branch ${branch}`, {
            cwd: location
        });
        resolve();
    });
}

const deleteFolderRecursive = function(path: string) {
    if(existsSync(path) ) {
        readdirSync(path).forEach(function(file) {
          var curPath = path + "/" + file;
            if(lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                unlinkSync(curPath);
            }
        });
        rmdirSync(path);
      }
  };