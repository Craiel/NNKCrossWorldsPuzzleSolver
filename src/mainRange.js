(function () {

    class MainRange {
        static init() {
            const range = this.getRange();
            range.max = `${NNKPZ.data.presets.length - 1}`;
            this.getLabel().innerHTML = `1/${NNKPZ.data.presets.length}`;
            range.addEventListener('input', () => {
                const el = this.getRange();
                const index = parseInt(el.value);
                this.getLabel().innerHTML = `${index + 1}/${NNKPZ.data.presets.length}`;
                NNKPZ.CustomInput.setCheckbox(false);
                NNKPZ.Dom.onChangeTetro();
            });
            this.getButton().addEventListener('click', () => {
                this.calculate();
            });
            this.getButtonLeft().addEventListener('click', () => {
                const el = this.getRange();
                let index = parseInt(el.value);
                if (index == 0) {
                    index = parseInt(el.max);
                }
                else {
                    index -= 1;
                }
                el.value = index.toString();
                el.dispatchEvent(new Event('input'));
            });
            this.getButtonRight().addEventListener('click', () => {
                const el = this.getRange();
                let index = parseInt(el.value);
                if (index == parseInt(el.max)) {
                    index = 0;
                }
                else {
                    index += 1;
                }
                el.value = index.toString();
                el.dispatchEvent(new Event('input'));
            });
        }
        static calculate() {
            const tetro = NNKPZ.Dom.getTetro();
            if (NNKPZ.Tetro.getCount(tetro) % 4 != 0) {
                alert(`${4 - (NNKPZ.Tetro.getCount(tetro) % 4)}개 더 선택해주세요.`);
                return;
            }
            NNKPZ.ResultTable.onCalculate(tetro);
        }
        static getIndex() {
            return parseInt(this.getRange().value);
        }
        static getRange() {
            return document.getElementById('_range_main');
        }
        static getLabel() {
            return document.getElementById('_label_main');
        }
        static getButton() {
            return document.getElementById('_button_main');
        }
        static getButtonLeft() {
            return document.getElementById('_button_preset_left');
        }
        static getButtonRight() {
            return document.getElementById('_button_preset_right');
        }
    }

    NNKPZ.MainRange = MainRange;

}());