(function () {

    class Block {
        static fromFirstMatch(i, shapeIndex) {
            const pi = NNKPZ.BitCalc.getFirstIndex(NNKPZ.data.shapes[shapeIndex].bins[0]);
            return Block.make(0, i - pi, shapeIndex);
        }
        static make(j, i, shapeIndex) {
            let block = j;
            block <<= 4;
            block |= i;
            block <<= 8;
            block |= shapeIndex;
            return String.fromCharCode(block);
        }
    }

    NNKPZ.Block = Block;

}());