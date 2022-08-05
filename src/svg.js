(function () {

    class SVG {
        static create(tag, attr) {
            const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (const key in attr) {
                el.setAttributeNS(null, key, attr[key]);
            }
            return el;
        }
        static drawBlock(group, blockLine, attr, size, offset) {
            for (let i = 0; i < blockLine.length; i++) {
                const line = blockLine[i];
                group.appendChild(SVG.create('line', Object.assign(Object.assign({}, attr), { x1: line.x1 * size + offset.x, y1: line.y1 * size + offset.y, x2: line.x2 * size + offset.x, y2: line.y2 * size + offset.y })));
            }
        }
    }

    NNKPZ.SVG = SVG;

}());