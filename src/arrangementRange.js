(function () {

    class ArrangementRange {
        static init() {
            this.getRange().addEventListener('input', (e) => {
                const range = e.currentTarget;
                const index = parseInt(range.value);
                this.getLabel().innerHTML = `${index + 1}/${this.sols.length}`;
                NNKPZ.Dom.onChangeArrange(index);
            });
        }
        static reset() {
            this.setVisible(false);
            this.getRange().value = '0';
        }
        static applySols(sols) {
            this.sols = sols;
            this.getRange().value = '0';
            this.getRange().max = `${sols.length - 1}`;
            if (sols.length == 0) {
                this.setVisible(false);
                NNKPZ.MainSVG.drawSolution(Dom.getTetro(), '');
            }
            else {
                if (sols.length == 1) {
                    this.setVisible(false);
                }
                else {
                    this.getLabel().innerHTML = `1/${sols.length}`;
                    this.setVisible(true);
                }
                NNKPZ.Dom.onChangeArrange(0);
            }
        }
        static getRange() {
            return document.getElementById('_range_arrangement');
        }
        static getLabel() {
            return document.getElementById('_label_arrangement');
        }
        static setVisible(bool) {
            const div = document.getElementById('_div_arrangement_control');
            div.style.visibility = bool ? 'visible' : 'hidden';
        }
    }
    ArrangementRange.sols = [];

    NNKPZ.ArrangementRange = ArrangementRange;

}());