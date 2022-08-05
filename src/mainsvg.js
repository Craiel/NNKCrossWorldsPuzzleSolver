(function () {

    class MainSVG {
        static init() {
            const el = this.getTetroGroup();
            for (let y = 0; y < 9; y++) {
                for (let x = 0; x < 9; x++) {
                    const rect = this.createRect({
                        x: x * 100,
                        y: y * 100,
                        width: 100,
                        height: 100,
                        stroke: 'none'
                    });
                    el.appendChild(rect);
                    rect.addEventListener('click', (e) => {
                        if (!this.customMode) {
                            return;
                        }
                        e.currentTarget.classList.toggle('_active');
                        this.customTetro = this.readTetro();
                        NNKPZ.Dom.onChangeTetro();
                    });
                }
            }
            for (let x = 0; x <= 9; x++) {
                const line = NNKPZ.SVG.create('line', {
                    x1: x * 100,
                    y1: 0,
                    x2: x * 100,
                    y2: 9 * 100,
                    stroke: 'black',
                    'stroke-width': 1
                });
                el.appendChild(line);
            }
            for (let y = 0; y <= 9; y++) {
                const line = NNKPZ.SVG.create('line', {
                    x1: 0,
                    y1: y * 100,
                    x2: 9 * 100,
                    y2: y * 100,
                    stroke: 'black',
                    'stroke-width': 1
                });
                el.appendChild(line);
            }
        }
        static readTetro() {
            const rects = this.getTetroGroup().children;
            const bins = [];
            for (let y = 0; y < 9; y++) {
                let bin = 0;
                for (let x = 0; x < 9; x++) {
                    bin <<= 1;
                    if (rects.item(y * 9 + x).classList.contains('_active')) {
                        bin |= 1;
                    }
                }
                bins.push(bin);
            }
            return NNKPZ.Tetro.binsToTetro(bins);
        }
        static drawTetro(tetro) {
            this.getSolutionGroup().innerHTML = '';
            const rects = this.getTetroGroup().children;
            for (let i = 0; i < rects.length; i++) {
                rects.item(i).classList.remove('_active');
            }

            const points = NNKPZ.Tetro.getPoints(tetro);
            for (let i = 0; i < points.length; i++) {
                const { x, y } = points[i];
                rects.item(y * 9 + x).classList.add('_active');
            }
        }
        static drawSolution(tetro, solution, color) {
            this.getSolutionGroup().innerHTML = '';
            const blockLines = NNKPZ.Tetro.solutionToBlockLines(tetro, solution);
            for (let i = 0; i < blockLines.length; i++) {
                const blockLine = blockLines[i];
                var attr = {
                    'stroke-width': 80,
                    'stroke-linecap': 'square'
                };
                var blocks = NNKPZ.SVG.drawBlock(this.getSolutionGroup(), blockLine, attr, 100, { x: 50, y: 50 });
                console.log(blocks);
                for(var b = 0; b < blocks.length; b++) {
                    let bEl = $(blocks[b]);
                    bEl.addClass('tile-color-' + color);
                }
            }
        }
        static getTetroGroup() {
            return document.getElementById('_group_tetro');
        }
        static getSolutionGroup() {
            return document.getElementById('_group_solution');
        }
        static createRect(attr) {
            return NNKPZ.SVG.create('rect', attr);
        }
    }

    MainSVG.customMode = false;
    MainSVG.customTetro = NNKPZ.Tetro.binsToTetro([0, 0, 0, 0, 0, 0, 0, 0, 0]);

    NNKPZ.MainSVG = MainSVG;

}());