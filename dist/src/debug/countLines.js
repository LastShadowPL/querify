"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function lines(path) {
    let count = 0;
    const fileRegex = /.*\..*$/;
    function getNumOfLines(filePath) {
        return new Promise((res, rej) => {
            let out = 1;
            // debugger
            fs_extra_1.default.createReadStream(filePath)
                .on("data", (c) => {
                // debugger
                let i = 0;
                out--; // Because the loop will run once for idx=-1
                do {
                    i = c.indexOf(10, i + 1);
                    out++;
                } while (i !== -1);
            })
                .on("end", () => {
                // console.log(`[${filePath}]> ${out}`)
                res(out);
            });
        });
    }
    if (fileRegex.test(path)) {
        let o;
        getNumOfLines(path).then(x => o = x);
        return o;
    }
    else {
        fs_extra_1.default
            .readdir(path)
            .then(x => {
            for (const fname of x) {
                if (fileRegex.test(fname)) {
                    getNumOfLines(path_1.default.resolve(path, fname)).then(c => (console.log(c), (count += c)));
                }
                else {
                    count += lines(path_1.default.resolve(path, fname));
                }
            }
        })
            .then(() => {
            console.log(`
          [${path}]> ${count} lines of code
        `);
        })
            .catch(err => {
            console.log(`
        [ERROR]> "${err}"\n
        [FILEPATH]> ${path}
      `);
            debugger;
        });
    }
    return count;
}
(() => __awaiter(this, void 0, void 0, function* () {
    yield lines("C:/Users/xelox/Projects/node/2test/server/src");
}))();
console.log(2 + 43
    + 34
    + 31
    + 64
    + 14
    + 14
    + 159
    + 286
    + 16
    + 87
    + 40
    + 54);
