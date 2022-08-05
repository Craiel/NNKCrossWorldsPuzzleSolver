(function () {

    class Tetro {
        static binsToTetro(bins) {
            const sb = [];
            for (let j = 0; j < bins.length; j++) {
                sb.push(String.fromCharCode(bins[j]));
            }
            return sb.join('');
        }
        static getPoints(tetro) {
            const points = [];
            for (let j = 0; j < tetro.length; j++) {
                let bin = tetro.charCodeAt(j);
                let i = 0;
                while (bin > 0) {
                    if (bin & 1) {
                        points.push({ x: 9 - 1 - i, y: j });
                    }
                    i++;
                    bin >>= 1;
                }
            }
            return points;
        }
        static tetroToInput(tetro) {
            const sb = [];
            for (let j = 0; j < tetro.length; j++) {
                const bin = tetro.charCodeAt(j);
                sb.push(('0'.repeat(9) + bin.toString(2)).slice(-9));
            }
            return sb.join('\n');
        }
        static getMarginTop(tetro) {
            let mt = 0;
            for (let j = 0; j < tetro.length; j++) {
                if (tetro.charCodeAt(j) != 0) {
                    break;
                }
                mt++;
            }
            return mt;
        }
        static getMarginBottom(tetro) {
            let mb = 0;
            for (let j = tetro.length - 1; j >= 0; j--) {
                if (tetro.charCodeAt(j) != 0) {
                    break;
                }
                mb++;
            }
            return mb;
        }
        static getMarginRight(tetro) {
            let mr = 9;
            for (let j = 0; j < tetro.length; j++) {
                const m = NNKPZ.BitCalc.getFirstIndex(tetro.charCodeAt(j));
                if (m < mr) {
                    mr = m;
                }
            }
            return mr;
        }
        static getCount(tetro) {
            let count = 0;
            for (let j = 0; j < tetro.length; j++) {
                count += NNKPZ.BitCalc.getCount(tetro.charCodeAt(j));
            }
            return count;
        }
        static strip(tetro) {
            tetro = tetro.slice(Tetro.getMarginTop(tetro), tetro.length - Tetro.getMarginBottom(tetro));
            const mr = Tetro.getMarginRight(tetro);
            const sb = [];
            for (let j = 0; j < tetro.length; j++) {
                sb.push(String.fromCharCode(tetro.charCodeAt(j) >> mr));
            }
            return sb.join('');
        }
        static getMatchedBlock(tetro, j, i) {
            let block = '';
            for (let shapeIndex = 0; shapeIndex < NNKPZ.data.shapes.length; shapeIndex++) {
                const shape = NNKPZ.data.shapes[shapeIndex];
                for (let pj = 0; pj < shape.bins.length; pj++) {
                    if (j - pj + shape.bins.length <= tetro.length && pj <= j) {
                        let pBin = shape.bins[pj];
                        let pi = 0;
                        while (pBin > 0) {
                            if (pBin & 1) {
                                if (pi <= i) {
                                    let bool = true;
                                    for (let sj = 0; sj < shape.bins.length; sj++) {
                                        let sBin = shape.bins[sj];
                                        let bin = tetro.charCodeAt(j - pj + sj);
                                        if (((sBin << (i - pi)) & ~bin) != 0) {
                                            bool = false;
                                            break;
                                        }
                                    }
                                    if (bool) {
                                        const newBlock = NNKPZ.Block.make(j - pj, i - pi, shapeIndex);
                                        if (block.length == 0) {
                                            block = newBlock;
                                        }
                                        else {
                                            return null;
                                        }
                                    }
                                }
                            }
                            pi++;
                            pBin >>= 1;
                        }
                    }
                }
            }
            return block;
        }
        static getMatchOfFirstPoint(tetro, i) {
            let match = 0;
            for (let shapeIndex = 0; shapeIndex < NNKPZ.data.shapes.length; shapeIndex++) {
                match <<= 1;
                const shape = NNKPZ.data.shapes[shapeIndex];
                const pi = NNKPZ.BitCalc.getFirstIndex(shape.bins[0]);
                if (pi <= i || shape.bins.length <= tetro.length) {
                    let bool = true;
                    for (let sj = 0; sj < shape.bins.length; sj++) {
                        const sBin = shape.bins[sj];
                        const bin = tetro.charCodeAt(sj);
                        if (((sBin << (i - pi)) & ~bin) != 0) {
                            bool = false;
                            break;
                        }
                    }
                    if (bool) {
                        match |= 1;
                    }
                }
            }
            return match;
        }
        static removeBlock(tetro, block) {
            const blockCode = block.charCodeAt(0);
            const j = (blockCode >> 12) & 0b1111;
            const i = (blockCode >> 8) & 0b1111;
            const shapeIndex = blockCode & 0b11111111;
            const shape = NNKPZ.data.shapes[shapeIndex];
            const sb = [tetro.slice(0, j)];
            for (let sj = 0; sj < shape.bins.length; sj++) {
                const sBin = shape.bins[sj];
                const bin = tetro.charCodeAt(j + sj);
                sb.push(String.fromCharCode(bin & ~(sBin << i)));
            }
            sb.push(tetro.slice(j + shape.bins.length));
            return sb.join('');
        }
        static scanGetBlock(tetro) {
            if (Tetro.scanMap.has(tetro)) {
                return Tetro.scanMap.get(tetro);
            }
            for (let j = 0; j < tetro.length; j++) {
                let bin = tetro.charCodeAt(j);
                let i = 0;
                while (bin > 0) {
                    if (bin & 1) {
                        const block = Tetro.getMatchedBlock(tetro, j, i);
                        if (block != null) {
                            if (block.length == 0) {
                                Tetro.scanMap.set(tetro, '');
                                return '';
                            }
                            Tetro.scanMap.set(tetro, block);
                            return block;
                        }
                    }
                    i++;
                    bin >>= 1;
                }
            }
            Tetro.scanMap.set(tetro, null);
            return null;
        }
        static getSolutionList(tetro_) {
            const solutions = [];
            function buildSolution(tetro, solution) {
                tetro = Tetro.strip(tetro);
                if (tetro == '') {
                    solutions.push(solution);
                    return true;
                }
                const scanBlock = Tetro.scanGetBlock(tetro);
                if (scanBlock == null) {
                    const i = NNKPZ.BitCalc.getFirstIndex(tetro.charCodeAt(0));
                    let match = Tetro.cmMap.get(tetro);
                    if (match !== undefined) {
                        let shapeIndex = NNKPZ.data.shapes.length - 1;
                        while (match > 0) {
                            if (match & 1) {
                                const block = NNKPZ.Block.fromFirstMatch(i, shapeIndex);
                                buildSolution(Tetro.removeBlock(tetro, block), solution + block);
                            }
                            shapeIndex--;
                            match >>= 1;
                        }
                        return true;
                    }
                    let completeMatch = 0;
                    match = Tetro.getMatchOfFirstPoint(tetro, i);
                    let shapeIndex = NNKPZ.data.shapes.length - 1;
                    while (match > 0) {
                        if (match & 1) {
                            const block = NNKPZ.Block.fromFirstMatch(i, shapeIndex);
                            if (buildSolution(Tetro.removeBlock(tetro, block), solution + block)) {
                                completeMatch |= 1 << (NNKPZ.data.shapes.length - 1 - shapeIndex);
                            }
                        }
                        shapeIndex--;
                        match >>= 1;
                    }
                    if (completeMatch > 0) {
                        Tetro.cmMap.set(tetro, completeMatch);
                        return true;
                    }
                    return false;
                }
                if (scanBlock.length == 0) {
                    return false;
                }
                return buildSolution(Tetro.removeBlock(tetro, scanBlock), solution + scanBlock);
            }
            buildSolution(tetro_, '');
            return solutions;
        }
        static getSolutionMapList(tetro) {
            if (Tetro.getCount(tetro) % 4 != 0) {
                return [];
            }
            const solMap = new Map();
            const sols = Tetro.getSolutionList(tetro);
            for (let i = 0; i < sols.length; i++) {
                const sol = sols[i];
                let cb = [0, 0, 0, 0, 0, 0, 0];
                for (let j = 0; j < sol.length; j++) {
                    const blockCode = sol.charCodeAt(j);
                    const shapeIndex = blockCode & 0b11111111;
                    const shapeType = NNKPZ.data.shapes[shapeIndex].shapeType;
                    cb[shapeType]++;
                }
                const key = String.fromCharCode(...cb);
                let arr;
                if (solMap.has(key)) {
                    arr = solMap.get(key);
                }
                else {
                    arr = [];
                    solMap.set(key, arr);
                }
                arr.push(sol);
            }
            return [...solMap.entries()].sort();
        }
        static solutionToBlockLines(tetro, solution) {
            const res = [];
            let tpj = 0;
            let tpi = 0;
            for (let k = 0; k < solution.length; k++) {
                const mt = Tetro.getMarginTop(tetro);
                const mb = Tetro.getMarginBottom(tetro);
                tetro = tetro.slice(mt, tetro.length - mb);
                tpj += mt;
                const mr = Tetro.getMarginRight(tetro);
                tpi += mr;
                const sb = [];
                for (let j = 0; j < tetro.length; j++) {
                    sb.push(String.fromCharCode(tetro.charCodeAt(j) >> mr));
                }
                tetro = sb.join('');
                tetro = Tetro.removeBlock(tetro, solution[k]);
                const blockCode = solution.charCodeAt(k);
                const j = (blockCode >> 12) & 0b1111;
                const i = (blockCode >> 8) & 0b1111;
                const shapeIndex = blockCode & 0b11111111;
                const shape = NNKPZ.data.shapes[shapeIndex];
                const blockLine = [];
                for (let l = 0; l < shape.blockLine.length; l++) {
                    const line = shape.blockLine[l];
                    blockLine.push({
                        x1: 9 - 1 - tpi - i + line.x1,
                        y1: tpj + j + line.y1,
                        x2: 9 - 1 - tpi - i + line.x2,
                        y2: tpj + j + line.y2
                    });
                }
                res.push(blockLine);
            }
            return res;
        }
    }

    Tetro.cmMap = new Map();
    Tetro.scanMap = new Map();

    NNKPZ.Tetro = Tetro;

}());