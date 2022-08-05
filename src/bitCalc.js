(function () {

    class BitCalc {
        static getFirstIndex(bin) {
            let i = 0;
            while (bin > 0) {
                if (bin & 1) {
                    break;
                }
                i++;
                bin >>= 1;
            }
            return i;
        }
        static getCount(bin) {
            let count = 0;
            while (bin > 0) {
                if (bin & 1) {
                    count++;
                }
                bin >>= 1;
            }
            return count;
        }
    }

    NNKPZ.BitCalc = BitCalc;

}());